import React, { FC, useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { Row } from "react-bootstrap";
import { ExhibitorApi } from "../../apis";
import { Exhibitor } from "../../models";
import { useAuthState, useIsGranted } from "../../../AppModule/hooks";
import { ROLES } from "../../../config";
import {
    cancelAllPrevRequest,
    errorToast,
    successToast,
} from "../../../AppModule/utils";
import {
    AppGridPagination,
    AppFormDropdown,
    AppListPageToolbar,
    AppPageHeader,
    AppLoader,
    AppExhibitorCard,
    AppModal,
} from "../../../AppModule/components";
import {
    pageSizeOptions,
    defaultPageSize,
    itemsPerPage as defaultItemsPerPage,
} from "../../../AppModule/containers/AppGrid";
import { ExhibitorListTabs } from "./ExhibitorListTabs";

export const ExhibitorListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { containerId } = useAuthState();
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [itemsPerPage, setItemsPerPage] = useState<number>(
        defaultItemsPerPage
    );
    const [page, setPage] = useState<number>(1);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor[]>([]);
    const [showDelete, setDeleteShow] = useState(0);
    const [filter, setFilter] = useState<string>("");

    const fetchData = (params = {}) => {
        isLoading(true);
        cancelAllPrevRequest(cancelTokenSourcesRef.current);
        ExhibitorApi.find<Exhibitor>(
            page,
            {
                itemsPerPage,
                "container.id": containerId,
                isVisible,
                "translations.name": filter,
                ...params,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        )
            .then(({ response }) => {
                if (response !== null) {
                    setData(response.items);
                    setTotalItems(response.totalItems);
                }
            })
            .finally(() => {
                isLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [isVisible, itemsPerPage, page]);

    async function handleFilter(search: string) {
        setFilter(search);
        setPage(1);
        fetchData({ "translations.name": search });
    }

    async function handleDelete(id: number) {
        ExhibitorApi.deleteById(id).then(({ error, errorMessage }) => {
            if (error !== null) {
                errorToast(errorMessage);
            } else {
                successToast(t("exhibitor.list:delete.info.message"));
                setPage(1);
                fetchData();
            }
        });
    }

    return (
        <>
            <AppPageHeader
                title={t("exhibitor.list:header.title")}
                customToolbar
            >
                <div className="d-flex pt-2 mb-5 event-header-width">
                    <AppListPageToolbar
                        createLink={"/admin/exhibitors/new"}
                        grantedControl={isGrantedControl}
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                </div>
            </AppPageHeader>
            <ExhibitorListTabs
                isVisible={isVisible}
                setIsVisible={(status) => {
                    setPage(1);
                    setIsVisible(status);
                }}
            />
            <Row>
                {loading ? (
                    <AppLoader />
                ) : (
                    data.map((e) => (
                        <AppExhibitorCard
                            key={e.id}
                            data={e}
                            isGrantedControl={isGrantedControl}
                            handleDelete={(id) => {
                                setDeleteShow(id);
                            }}
                            handleClone={() => {}}
                        />
                    ))
                )}
            </Row>
            <AppModal
                show={showDelete > 0}
                title={t("exhibitor.list:delete.confirm.title")}
                handleClose={() => {
                    setDeleteShow(0);
                }}
                handleDelete={() => {
                    setDeleteShow(0);
                    handleDelete(showDelete).then();
                }}
                bodyContent={t("exhibitor.list:delete.confirm.message")}
            />
            {totalItems > 0 ? (
                <div className="d-flex flex-row app-grid-action py-2">
                    <AppGridPagination
                        className="mr-3"
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        active={page}
                        onClick={(p) => {
                            setPage(p);
                        }}
                    />

                    <div className="pagination-container">
                        <AppFormDropdown
                            id={"pageSize"}
                            defaultValue={defaultPageSize()}
                            options={pageSizeOptions()}
                            onChange={(e: any) => {
                                setItemsPerPage(e.value);
                                setPage(1);
                            }}
                            menuPlacement={"top"}
                        />
                    </div>
                </div>
            ) : null}
        </>
    );
};
