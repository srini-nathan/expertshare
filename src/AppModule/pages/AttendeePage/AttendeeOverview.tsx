import React, { FC, Fragment, useRef, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import { isString as _isString } from "lodash";
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
    defaultPageSize,
    pageSizeOptions,
} from "../../containers/AppGrid";
import { appGridConfig } from "../../config";
import { UserApi } from "../../../AdminModule/apis";
import { User } from "../../models/entities/User";
import { errorToast } from "../../utils";

export const AttendeeOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const { view } = useParams();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [pageSize, setPageSize] = useState<number>(30);
    const [active, setActive] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { t } = useTranslation();
    const fetchData = (params = {}) => {
        isLoading(true);
        UserApi.getAttendeeList<User>(active, {
            ...params,
            order: {
                lastName: "asc",
            },
            isDisplayAsGuest: false,
        }).then(({ response, error }) => {
            isLoading(false);

            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setTotalItems(response.totalItems);
                setAttendees(response.items);
            }
        });
    };

    useEffect(() => {
        if (view !== "list") {
            fetchData();
        }
    }, [active, pageSize]);

    async function handleFilter(search: string) {
        if (view === "list")
            appGridApi.current?.setFilterModel({
                user_search: {
                    filter: search,
                },
            });
        else fetchData({ user_search: search });
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
                }).then(({ response, error }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        }
                    } else if (response !== null) {
                        if (response.items.length === 0) {
                            api?.showNoRowsOverlay();
                        }
                        setAttendees(response.items);
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
                if (loading) return <AppLoader />;

                return (
                    <Row>
                        {attendees.map((item, index) => (
                            <Col
                                xs={12}
                                md={6}
                                lg={4}
                                xl={3}
                                className="attendees-grid--container--item"
                                key={index}
                            >
                                <AttendeeCard attendee={item} key={index} />
                            </Col>
                        ))}
                        {totalItems > 9 ? (
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
                                        onChange={(e: any) =>
                                            setPageSize(e.value)
                                        }
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
