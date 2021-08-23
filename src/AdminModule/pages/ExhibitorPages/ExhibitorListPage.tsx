import React, { FC, useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { ExhibitorApi } from "../../apis";
import { Exhibitor } from "../../models";
import { useAuthState, useIsGranted } from "../../../AppModule/hooks";
import { ROLES } from "../../../config";
import {
    AppGridPagination,
    AppFormDropdown,
    AppListPageToolbar,
    AppPageHeader,
    AppLoader,
    AppExhibitorCard,
} from "../../../AppModule/components";
import {
    pageSizeOptions,
    defaultPageSize,
} from "../../../AppModule/containers/AppGrid";

export const ExhibitorListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { containerId } = useAuthState();
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [pageSize, setPageSize] = useState<number>(30);
    const [page, setPage] = useState<number>(1);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [active] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor[]>([]);

    const fetchData = (params = {}) => {
        isLoading(true);
        ExhibitorApi.find<Exhibitor>(
            page,
            {
                "container.id": containerId,
                active,
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
    }, [active, pageSize]);

    async function handleFilter(search: string) {
        setPage(1);
        fetchData({ "translations.title": search });
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
            {loading ? (
                <AppLoader />
            ) : (
                data.map((e) => (
                    <AppExhibitorCard
                        key={e.id}
                        data={e}
                        isGrantedControl={isGrantedControl}
                        handleDelete={() => {}}
                        handleClone={() => {}}
                    />
                ))
            )}
            {totalItems > 0 ? (
                <div className="d-flex flex-row app-grid-action py-2">
                    <AppGridPagination
                        className="mr-3"
                        itemsPerPage={pageSize}
                        totalItems={totalItems}
                        active={page}
                        onClick={setPage}
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
