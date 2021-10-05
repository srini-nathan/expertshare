import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import {
    AppPageHeader,
    AppLoader,
    AppGridPagination,
    AppFormDropdown,
    AppModal,
    AppButton,
} from "../../../AppModule/components";
import { AppTranslation } from "../../../AppModule/containers/AppTranslation";
import { ContainerApi, LanguageApi, TranslationApi } from "../../apis";
import { Language, TranslationGroup } from "../../models";
import { TranslationCombine } from "../../models/entities/TranslationCombine";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import {
    errorToast,
    hideLoader,
    randomInteger,
    showLoader,
    successToast,
} from "../../../AppModule/utils";
import {
    defaultPageSize,
    pageSizeOptions,
} from "../../../AppModule/containers/AppGrid/app-grid-helpers";
import { AppTranslationToolbar } from "./AppTranslationToolbar";
import "./assets/scss/style.scss";
import { SimpleObject } from "../../../AppModule/models";
import { useAuthState } from "../../../AppModule/hooks";
import { useGlobalData } from "../../../AppModule/contexts";

export interface TranslationCombineList {
    translationGroup?: TranslationGroup | undefined;
    itemKey?: any;
    items?: TranslationCombine[] | undefined;
}

export const TranslationAddEdit: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(30);
    const [active, setActive] = useState<number>(1);
    const [activeFilter, setActiveFilter] = useState<string>("tKey");
    const [activeSearchText, setActiveSearchText] = useState<string>("");
    const { t } = useTranslation();
    const [translataionCombines, setTranslationCombines] = useState<
        TranslationCombineList[]
    >([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
    const [loading, isLoading] = useState<boolean>(false);
    const { state } = React.useContext(AuthContext);
    const { containerId } = state as AuthState;
    const { containerResourceId } = useAuthState();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const { container } = useGlobalData();

    useEffect(() => {
        isLoading(true);
        LanguageApi.find<Language>(1, { "container.id": containerId }).then(
            ({ error, response }) => {
                isLoading(false);
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setLanguages(response.items);
                    setSelectedLanguages(response.items);
                }
            }
        );
    }, [containerId]);

    useEffect(() => {
        isLoading(false);
    }, [translataionCombines]);

    const fetchData = (search = activeSearchText) => {
        const extraParams: SimpleObject<string> = {};
        if (search !== "") {
            setActiveSearchText(search);
            extraParams[activeFilter] = search;
        }
        isLoading(true);
        TranslationApi.find<TranslationCombine>(active, extraParams).then(
            ({ error, response }) => {
                isLoading(false);
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    let groups: TranslationCombineList[] = [];

                    response.items.forEach((e) => {
                        const index = groups.findIndex(
                            (item) =>
                                item.translationGroup &&
                                item.translationGroup.tgKey ===
                                    e.translationGroup.tgKey
                        );

                        if (index !== -1) {
                            let items: any = [];
                            if (groups[index]) items = groups[index].items;
                            groups = [
                                ...groups.slice(0, index),
                                {
                                    ...groups[index],
                                    items: [
                                        ...items,
                                        {
                                            itemKey: randomInteger(),
                                            tKey: e.tKey,
                                            defaultValue: e.defaultValue,
                                            id: e.id,
                                            translationGroup:
                                                e.translationGroup,
                                            translationValues: e.translationValues.filter(
                                                (tv) =>
                                                    tv.container ===
                                                    containerResourceId
                                            ),
                                        },
                                    ],
                                },
                                ...groups.slice(index + 1),
                            ];
                        } else {
                            groups.push({
                                translationGroup: e.translationGroup,
                                itemKey: randomInteger(),
                                items: [
                                    {
                                        itemKey: randomInteger(),
                                        tKey: e.tKey,
                                        defaultValue: e.defaultValue,
                                        id: e.id,
                                        translationGroup: e.translationGroup,
                                        translationValues: e.translationValues.filter(
                                            (tv) =>
                                                tv.container ===
                                                containerResourceId
                                        ),
                                    },
                                ],
                            });
                        }
                    });
                    setTranslationCombines(groups);
                    setTotalItems(response.totalItems);
                }
            }
        );
    };
    useEffect(() => {
        fetchData();
    }, [languages, active, pageSize]);

    const generateTranslationSubmit = () => {
        showLoader(
            t("admin.translation:generateTranslation.generatingLoader.message")
        ).then();
        if (container) {
            ContainerApi.generateTranslationRequest(container.id)
                .then(() => {
                    hideLoader();
                    successToast(
                        t("admin.translation:generateTranslation.toast.success")
                    );
                })
                .catch(() => {
                    hideLoader();
                    errorToast(
                        t("admin.translation:generateTranslation.toast.error")
                    );
                });
        }
    };

    const renderTranslations = () => {
        if (loading) {
            return <AppLoader />;
        }
        return (
            translataionCombines &&
            translataionCombines.map((e) => {
                return (
                    <AppTranslation
                        key={e.itemKey}
                        translationGroup={e.translationGroup}
                        items={e.items}
                        activeLanguages={selectedLanguages}
                    />
                );
            })
        );
    };
    const onCreateNew = () => {
        setTranslationCombines([
            {
                translationGroup: undefined,
                itemKey: randomInteger(),
                items: undefined,
            },
            ...translataionCombines,
        ]);
    };
    return (
        <>
            <Row className={"justify-content-end"}>
                <Col
                    xs={"auto"}
                    className="my-2 my-md-0 mr-0 ml-auto px-0 px-2"
                >
                    <AppModal
                        show={showConfirmModal}
                        title={t(
                            "admin.translation:generateTranslation.confirmation.title"
                        )}
                        handleClose={() => {
                            setShowConfirmModal(false);
                        }}
                        handleDelete={() => {
                            generateTranslationSubmit();
                            setShowConfirmModal(false);
                        }}
                        bodyContent={t(
                            "admin.translation:generateTranslation.confirmation.content"
                        )}
                    />
                    <AppButton
                        variant={"danger"}
                        className="justify-content-center"
                        block
                        onClick={() => {
                            setShowConfirmModal(true);
                        }}
                    >
                        {t("admin.translation:includedLanguages")}
                    </AppButton>
                </Col>
                <Col xs={"auto"} className="my-2 my-md-0 px-2">
                    <AppButton
                        variant={"secondary"}
                        className="justify-content-center px-4"
                        block
                        onClick={onCreateNew}
                    >
                        + Create
                    </AppButton>
                </Col>
            </Row>
            <AppPageHeader
                customToolbar
                title={t("admin.translation:header.title")}
            >
                <AppTranslationToolbar
                    options={languages}
                    selectedItems={selectedLanguages}
                    label={`${t("admin.translation:includedLanguages")} (${
                        selectedLanguages.length
                    })`}
                    onChangeSelectFilter={(e: any) => {
                        setActiveFilter(e.value);
                    }}
                    onQuickFilterChange={(e: string) => {
                        fetchData(e);
                    }}
                    onChangeSelect={(item: any) => {
                        let index = -1;
                        selectedLanguages.filter((e, i) => {
                            if (e.locale === item.id) {
                                index = i;
                            }
                            return e;
                        });
                        if (index !== -1) {
                            setSelectedLanguages([
                                ...selectedLanguages.slice(0, index),
                                ...selectedLanguages.slice(index + 1),
                            ]);
                        } else {
                            const selected = languages.filter(
                                (e) => e.locale === item.id
                            );
                            setSelectedLanguages([
                                ...selectedLanguages,
                                selected[0],
                            ]);
                        }
                    }}
                />
            </AppPageHeader>
            {renderTranslations()}
            {totalItems > 10 ? (
                <div className="d-flex flex-row app-grid-action py-1 py-md-3">
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
        </>
    );
};
