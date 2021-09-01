import React, { FC, useState, useEffect, useRef } from "react";
import { RouteComponentProps, useMatch } from "@reach/router";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { ExhibitorApi } from "../../apis";
import { Exhibitor, ExhibitorCategory } from "../../models";
import { useAuthState, useIsGranted } from "../../../AppModule/hooks";
import { ROLES } from "../../../config";
import { errorToast, successToast } from "../../../AppModule/utils";
import {
    AppGridPagination,
    AppFormDropdown,
    AppListPageToolbar,
    AppPageHeader,
    AppLoader,
    AppModal,
} from "../../../AppModule/components";
import {
    pageSizeOptions,
    defaultPageSize,
} from "../../../AppModule/containers/AppGrid";
import { ExhibitorListTabs } from "./ExhibitorListTabs";
import { SimpleObject } from "../../../AppModule/models";
import { ExhibitorListItems } from "./ExhibitorListPageItems";

export const ExhibitorListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const adminPage = useMatch("/admin/exhibitors");
    const isFrontPage = adminPage === null;
    const { containerId } = useAuthState();
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [pageSize, setPageSize] = useState<number>(30);
    const [page, setPage] = useState<number>(1);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor[]>([]);
    const [catWiseData, setCatWiseData] = useState<SimpleObject<Exhibitor[]>>(
        {}
    );
    const [showDelete, setDeleteShow] = useState(0);
    const [filter, setFilter] = useState<string>("");

    const fetchData = (params = {}) => {
        isLoading(true);
        if (!isFrontPage) {
            params = {
                isVisible,
                ...params,
            };
        } else if (!isGrantedControl) {
            params = {
                isVisible: true,
                ...params,
            };
        }
        ExhibitorApi.find<Exhibitor>(
            page,
            {
                "container.id": containerId,
                "translations.name": filter,
                ...params,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        )
            .then(({ response }) => {
                if (response !== null) {
                    const { items } = response;
                    const catWiseItems: SimpleObject<Exhibitor[]> = {};
                    items.forEach((item) => {
                        const cat = (item.category as unknown) as ExhibitorCategory;
                        const catName = cat.name;
                        if (catWiseItems[catName]) {
                            catWiseItems[catName] = [
                                ...catWiseItems[catName],
                                item,
                            ];
                        } else {
                            catWiseItems[catName] = [item];
                        }
                    });
                    setCatWiseData(catWiseItems);
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
    }, [isVisible, pageSize]);

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
            {isFrontPage ? null : (
                <ExhibitorListTabs
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />
            )}
            {loading ? (
                <AppLoader />
            ) : (
                <ExhibitorListItems
                    isFrontPage={isFrontPage}
                    data={data}
                    catWiseData={catWiseData}
                    setDeleteShow={setDeleteShow}
                />
            )}
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
                        itemsPerPage={pageSize}
                        totalItems={totalItems}
                        active={page}
                        onClick={(p) => {
                            setPage(p);
                            fetchData();
                        }}
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
