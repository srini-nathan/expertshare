import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams, navigate } from "@reach/router";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import { errorToast, successToast } from "../../utils";
import {
    AppPageHeader,
    AppConferenceCard,
    AppLoader,
    AppSwitchView,
    AppListPageToolbar,
    AppGridPagination,
    AppFormDropdown,
    AppModal,
} from "../../components";
import { ConferenceApi } from "../../../AdminModule/apis";
import { useAuthState, useIsGranted } from "../../hooks";
import { PConference } from "../../../AdminModule/models";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../containers/AppGrid";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { appGridConfig } from "../../config";
import { CONSTANTS } from "../../../config";
import "./assets/scss/style.scss";
import {
    defaultPageSize,
    pageSizeOptions,
} from "../../containers/AppGrid/app-grid-helpers";

const { Role: ROLE } = CONSTANTS;

const {
    ROLE: { ROLE_OPERATOR },
} = ROLE;
export const ConferenceGrid: FC<RouteComponentProps> = (): JSX.Element => {
    const { containerId } = useAuthState();
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [conferences, setConferences] = useState<PConference[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const { view } = useParams();
    const appGridApi = useRef<GridApi>();
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);
    const [pageSize, setPageSize] = useState<number>(30);
    const [active, setActive] = useState<number>(1);
    const [showDelete, setDeleteShow] = useState(0);
    const [showClone, setCloneShow] = useState(0);
    const { t } = useTranslation();

    const fetchData = (params = {}) => {
        isLoading(true);
        ConferenceApi.find<PConference>(
            active,
            {
                "container.id": containerId,
                locale: user?.locale || "en",
                ...params,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        ).then(({ response, error }) => {
            isLoading(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                if (response.items.length === 1) {
                    navigate(`/event/${response.items[0].id}/agenda`);
                }
                setConferences(response.items);
                setTotalItems(response.totalItems);
            }
        });
    };

    async function handleFilter(search: string) {
        if (view === "grid") fetchData({ "translations.title": search });
        else
            appGridApi.current?.setFilterModel({
                "translations.title": {
                    filter: search,
                },
            });
    }

    useEffect(() => {
        fetchData();
    }, [active, pageSize]);
    async function handleClone(id: number) {
        ConferenceApi.clone<
            PConference,
            {
                cloneId: number;
            }
        >(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("event.list:clone.info.message"));
                fetchData();
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }
    async function handleDelete(id: number) {
        ConferenceApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("event.list:delete.info.message"));
                if (view === "list")
                    appGridApi.current?.refreshServerSideStore({
                        purge: false,
                        route: [],
                    });
                else fetchData();
            }
        });
    }
    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                ConferenceApi.find<PConference>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        locale: user?.locale || "en",
                        "container.id": containerId,
                    },
                    (c) => {
                        cancelTokenSourcesRef.current.push(c);
                    }
                ).then(({ error, response }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        }
                    } else if (response !== null) {
                        if (response.items.length === 0) {
                            api?.showNoRowsOverlay();
                        }
                        setConferences(response.items);
                        setTotalItems(response.totalItems);
                        params.successCallback(
                            response.items,
                            response.totalItems
                        );
                    }
                });
            },
        };
    }

    const renderView = () => {
        switch (view) {
            case "list":
                return (
                    <Col className="p-0">
                        <AppGrid
                            frameworkComponents={appGridFrameworkComponents}
                            columnDef={appGridColDef({
                                onPressDelete: handleDelete,
                                onPressClone: handleClone,
                                isGrantedControl,
                            })}
                            dataSource={getDataSource()}
                            totalItems={totalItems}
                            onReady={(event) => {
                                appGridApi.current = event.api;
                            }}
                        />
                    </Col>
                );
            case "grid":
            default:
                if (loading) {
                    return <AppLoader />;
                }
                return (
                    <Row className="events-grid--container px-2 px-sm-0">
                        {conferences.map((conference: PConference) => (
                            <AppConferenceCard
                                isGrantedControl={isGrantedControl}
                                handleDelete={(id: number) => {
                                    setDeleteShow(id);
                                }}
                                handleClone={(id: number) => {
                                    setCloneShow(id);
                                }}
                                conference={conference}
                                key={conference.id}
                            />
                        ))}

                        <AppModal
                            show={showDelete > 0}
                            title={t("event.list:delete.confirm.title")}
                            handleClose={() => {
                                setDeleteShow(0);
                            }}
                            handleDelete={() => {
                                setDeleteShow(0);
                                handleDelete(showDelete).then();
                            }}
                            bodyContent={t("event.list:delete.confirm.message")}
                        />
                        <AppModal
                            show={showClone > 0}
                            title={t("event.list:clone.confirm.title")}
                            handleClose={() => {
                                setCloneShow(0);
                            }}
                            handleDelete={() => {
                                setCloneShow(0);
                                handleClone(showClone).then();
                            }}
                            bodyContent={t("event.list:clone.confirm.message")}
                        />
                    </Row>
                );
        }
    };

    return (
        <Fragment>
            <AppPageHeader title={t("event.list:header.title")} customToolbar>
                <div className="d-flex pt-2 mb-5 event-header-width">
                    <AppListPageToolbar
                        createLink={"/event/create"}
                        grantedControl={isGrantedControl}
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />

                    <AppSwitchView link={"/event"} activeLink={view || ""} />
                </div>
            </AppPageHeader>

            {renderView()}
            {totalItems > 10 ? (
                <div className="d-flex flex-row app-grid-action py-2">
                    <AppGridPagination
                        className="mr-3"
                        itemsPerPage={pageSize}
                        totalItems={totalItems}
                        active={active}
                        onClick={setActive}
                    />
                    <div className="pagination-container">
                        <AppFormDropdown
                            id={"pageSize"}
                            defaultValue={defaultPageSize()}
                            options={pageSizeOptions()}
                            onChange={(e: any) => setPageSize(e.value)}
                            menuPlacement={"top"}
                        />
                    </div>
                </div>
            ) : null}
        </Fragment>
    );
};
