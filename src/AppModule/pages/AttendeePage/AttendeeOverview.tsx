import React, { FC, Fragment, useRef, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { appGridColDef } from "./app-grid-col-def";
import {
    AppPageHeader,
    AppSwitchView,
    AppListPageToolbar,
    AppLoader,
    AppGridPagination,
    AppFormDropdown,
} from "../../components";
import "./assets/scss/style.scss";
import { AttendeeCard } from "../../components/AttendeeCard";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
    getSelectedPageSize,
    itemsPerPage as defaultItemsPerPage,
    pageSizeOptions,
} from "../../containers/AppGrid";
import { appGridConfig } from "../../config";
import { UserApi } from "../../../AdminModule/apis";
import { User } from "../../models/entities/User";
import { cancelAllPrevRequest, errorToast } from "../../utils";

export const AttendeeOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const { view } = useParams();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [data, setData] = useState<User[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState<number>(
        defaultItemsPerPage
    );
    const [page, setPage] = useState<number>(1);
    const [filter, setFilter] = useState<string>("");
    const { t } = useTranslation();
    const fetchData = (params = {}) => {
        isLoading(true);
        cancelAllPrevRequest(cancelTokenSourcesRef.current);
        UserApi.getAttendeeList<User>(
            page,
            {
                ...params,
                itemsPerPage,
                order: {
                    lastName: "asc",
                },
                user_search: filter,
                isDisplayAsGuest: false,
            },
            (c) => cancelTokenSourcesRef.current.push(c)
        )
            .then(({ response, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                    setData([]);
                    setTotalItems(0);
                } else if (response !== null) {
                    setData(response.items);
                    setTotalItems(response.totalItems);
                }
            })
            .finally(() => {
                isLoading(false);
            });
    };

    useEffect(() => {
        if (view !== "list") {
            fetchData();
        }
    }, [page, itemsPerPage, filter]);

    async function handleFilter(search: string) {
        if (view === "list") {
            appGridApi.current?.setFilterModel({
                user_search: {
                    filter: search,
                },
            });
        } else {
            setFilter(search);
            setPage(1);
        }
    }
    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                UserApi.getAttendeeList<User>(pageNo, {
                    isDisplayAsGuest: false,
                    order: buildSortParams(request),
                    ...buildFilterParams(request),
                }).then(({ response, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (response !== null) {
                        if (response.items.length === 0) {
                            api?.showNoRowsOverlay();
                        }
                        setTotal(response.totalItems);
                        params.successCallback(
                            response.items,
                            response.totalItems
                        );
                    }
                });
            },
        };
    }
    async function handleBookSessionClick() {
        alert("You clicked book session button");
    }
    async function handleGetInContactClick() {
        alert("You clicked get in contract button");
    }
    async function handleAddNewUser() {
        alert("You clicked new user icon");
    }

    const renderView = () => {
        switch (view) {
            case "list":
                return (
                    <Col className="p-0 attendee-overview-page">
                        <AppGrid
                            frameworkComponents={appGridFrameworkComponents}
                            columnDef={appGridColDef({
                                onPressBookSession: handleBookSessionClick,
                                onPressGetInContact: handleGetInContactClick,
                                onPressAddNewUser: handleAddNewUser,
                            })}
                            totalItems={total}
                            dataSource={getDataSource()}
                            onReady={(event) => {
                                appGridApi.current = event.api;
                            }}
                        />
                    </Col>
                );
            case "grid":
            default:
                return (
                    <Row>
                        {loading ? (
                            <AppLoader />
                        ) : (
                            data.map((item) => (
                                <Col
                                    xs={12}
                                    sm={6}
                                    lg={4}
                                    xl={3}
                                    className="attendees-grid--container--item"
                                    key={item.id}
                                >
                                    <AttendeeCard attendee={item} />
                                </Col>
                            ))
                        )}
                        {totalItems > 10 ? (
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
                                        defaultValue={getSelectedPageSize(
                                            itemsPerPage
                                        )}
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
                    </Row>
                );
        }
    };

    return (
        <Fragment>
            <AppPageHeader
                title={t("attendee.list:header.title")}
                customToolbar
            >
                <div className="d-flex pt-2 mb-2 mb-md-5 attendee-header-width">
                    <AppListPageToolbar
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    <AppSwitchView link={"/attendee"} activeLink={view || ""} />
                </div>
            </AppPageHeader>
            {renderView()}
        </Fragment>
    );
};
