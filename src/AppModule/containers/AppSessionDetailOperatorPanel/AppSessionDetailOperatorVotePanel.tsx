import React, { FC, useRef, useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { find as _find } from "lodash";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { navigate } from "@reach/router";
import { useForm } from "react-hook-form";
import {
    AppButton,
    AppFormSelect,
    AppFormSwitch,
    AppLoader,
} from "../../components";
import {
    ContainerApi,
    LiveVoteQuestionApi,
    SessionApi,
} from "../../../AdminModule/apis";
import { useGlobalData } from "../../contexts";
import {
    LiveVoteQuestion,
    PLiveVoteQuestion,
} from "../../../AdminModule/models";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { appGridColDef } from "./app-grid-col-def";
import { AppGrid, buildFilterParams, buildSortParams } from "../AppGrid";
import { appGridConfig } from "../../config";
import { PrimitiveObject } from "../../models";
import { useCRUDHelperFunctions, useSessionSocketEvents } from "../../hooks";

interface AppSessionDetailOperatorVotePanelType {
    conferenceId: number;
    currentSessionId: number;
}

interface LiveVotePublishResultPayload {
    session: string;
    isResultPublished: boolean;
    entityId: number;
}

export const AppSessionDetailOperatorVotePanel: FC<AppSessionDetailOperatorVotePanelType> = ({
    conferenceId,
    currentSessionId,
}): JSX.Element => {
    const { t } = useTranslation();
    const { container } = useGlobalData();
    const [totalItems, setTotalItems] = useState<number>(0);
    const appGridApi = useRef<GridApi>();
    const [votes, setVotes] = useState<LiveVoteQuestion[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { control, getValues } = useForm();
    const [activating, setActivating] = useState<boolean>(false);
    const { emitRefreshVote } = useSessionSocketEvents();
    const { handleDeleteById } = useCRUDHelperFunctions(LiveVoteQuestionApi);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                if (container) {
                    setLoading(true);
                    LiveVoteQuestionApi.find<LiveVoteQuestion>(
                        pageNo,
                        {
                            order: buildSortParams(request),
                            ...buildFilterParams(request),
                            "session.id": currentSessionId,
                            "container.id": ContainerApi.toResourceUrl(
                                container.id
                            ),
                        },
                        (c) => {
                            cancelTokenSourcesRef.current.push(c);
                        }
                    )
                        .then(({ response }) => {
                            if (response !== null) {
                                if (response.items.length === 0) {
                                    api?.showNoRowsOverlay();
                                }
                                setTotalItems(response.totalItems);
                                setVotes(response.items);
                                params.successCallback(
                                    response.items,
                                    response.totalItems
                                );
                            }
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                }
            },
        };
    }

    function handleDelete(id: number) {
        handleDeleteById(id, {
            success:
                "sessionDetails:section.operatorActions.liveVote.delete.toast.success",
            onSuccess: () => {
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            },
        });
    }

    const handleApplyVote = async () => {
        setActivating(true);
        const selectedVote = getValues("activeVote");
        const anyVote = votes[0]?.id;
        await LiveVoteQuestionApi.publishResult<
            LiveVotePublishResultPayload,
            LiveVotePublishResultPayload
        >({
            session: SessionApi.toResourceUrl(currentSessionId),
            isResultPublished: false,
            entityId: anyVote,
        });
        LiveVoteQuestionApi.makeSelection<PLiveVoteQuestion, PLiveVoteQuestion>(
            selectedVote === 0 ? anyVote : selectedVote,
            {
                isSelected: selectedVote !== 0,
            }
        )
            .then(() => {
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
                emitRefreshVote(currentSessionId);
            })
            .finally(() => {
                setActivating(false);
            });
    };

    const handlePublishResult = async () => {
        const selectedVote = getValues("activeVote");
        const status = getValues("isResultPublished");
        await LiveVoteQuestionApi.publishResult<
            LiveVotePublishResultPayload,
            LiveVotePublishResultPayload
        >({
            session: SessionApi.toResourceUrl(currentSessionId),
            isResultPublished: !status,
            entityId: selectedVote,
        });
    };

    useEffect(() => {
        return () => {
            cancelTokenSourcesRef.current.forEach((c) => {
                c();
            });
        };
    }, []);

    const renderDropDown = () => {
        if (loading) {
            return (
                <Col>
                    <AppLoader containerClassName={"inline-loader"} />
                </Col>
            );
        }
        const active = votes.find((v) => v.isSelected);
        const options = [
            {
                value: 0,
                label: t(
                    "sessionDetails:section.operatorActions.liveVote.label.deActiveDropDownOption"
                ),
            },
            ...votes.map((v) => {
                return {
                    label: v.name,
                    value: v.id,
                };
            }),
        ];
        return (
            <>
                <AppFormSelect
                    id={"activeVote"}
                    name={"activeVote"}
                    label={t(
                        "sessionDetails:section.operatorActions.liveVote.label.activateVoteDropdown"
                    )}
                    md={6}
                    lg={6}
                    xl={6}
                    control={control}
                    defaultValue={active?.id ?? 0}
                    options={options}
                    transform={{
                        output: (l: PrimitiveObject) => l?.value,
                        input: (value: string) => {
                            return _find(options, {
                                value,
                            });
                        },
                    }}
                />
                <AppButton
                    className={
                        "text-capitalize applyvote-btn ml-3 ml-md-0 mb-3 mb-md-0"
                    }
                    variant={"secondary"}
                    type={"button"}
                    onClick={handleApplyVote}
                    isLoading={activating}
                    disabled={activating}
                >
                    {t(
                        "sessionDetails:section.operatorActions.liveVote.button.applyVote"
                    )}
                </AppButton>
                <AppFormSwitch
                    name={"isResultPublished"}
                    label={t(
                        "sessionDetails:section.operatorActions.liveVote.label.activateVoteResultPublished"
                    )}
                    defaultChecked={active?.isResultPublished}
                    control={control}
                    onChange={() => {
                        if (active?.id) {
                            handlePublishResult().then(() => {
                                emitRefreshVote(currentSessionId);
                            });
                        }
                    }}
                />
            </>
        );
    };

    return (
        <div className={"mt-4"}>
            <div className={"header"}>
                <Row>
                    <div className={"col-auto"}>
                        <h5 className="mb-0">
                            {t(
                                "sessionDetails:section.operatorActions.liveVote.header"
                            )}
                        </h5>
                    </div>
                    <div className={"col-auto mr-0 ml-auto"}>
                        <AppButton
                            className={
                                "text-capitalize create-btn float-right d-inline-block"
                            }
                            variant={"secondary"}
                            onClick={() => {
                                navigate(
                                    `/admin/live-votes/${conferenceId}/${currentSessionId}/new`
                                ).then();
                            }}
                        >
                            + {t("common.button:create")}
                        </AppButton>
                    </div>
                </Row>
            </div>
            <hr />
            <Row>
                <Col md={12}>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Row>{renderDropDown()}</Row>
                    </Form>
                </Col>
            </Row>
            <Row className="mt-3 px-0">
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
                            parentId: currentSessionId,
                            grandParentId: conferenceId,
                        })}
                        dataSource={getDataSource()}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi.current = event.api;
                        }}
                        paginationContainerClass={"d-none"}
                        gridOptions={{
                            suppressContextMenu: true,
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};
