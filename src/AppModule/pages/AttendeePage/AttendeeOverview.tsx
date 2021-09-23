import React, { FC, Fragment, useRef, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { appGridColDef } from "./app-grid-col-def";
import {
    AppPageHeader,
    AppSwitchView,
    AppListPageToolbar,
    AppLoader,
    AppGridPagination,
    AppFormDropdown,
    AppButton,
    AppFormSelectCreatable,
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
import {
    cancelAllPrevRequest,
    errorToast,
    parseConfiguration,
} from "../../utils";
import { useRoles } from "../../hooks";
import { SimpleObject } from "../../models";
import { useGlobalData } from "../../contexts";

const OnlyFilter = [
    "ROLE_READER",
    "ROLE_USER",
    "ROLE_SPEAKER",
    "ROLE_MODERATOR",
    "ROLE_EXHIBITOR",
];

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
    const { container } = useGlobalData();
    const config = parseConfiguration(container);
    const [show, setShow] = useState<boolean>(false);
    const { control } = useForm();
    const { getOptions } = useRoles();
    const [selectedRoles, setSelectedRoles] = useState<SimpleObject<string>[]>(
        getOptions(config.filterUserRoles)
    );
    const [appliedRoles, setAppliedRoles] = useState<SimpleObject<string>[]>(
        getOptions(config.filterUserRoles)
    );
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
                "roles.role[]": appliedRoles?.map((r) => r.value),
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
    }, [page, itemsPerPage, filter, appliedRoles]);

    async function handleFilter(search: string) {
        if (view === "list") {
            appGridApi.current?.setFilterModel({
                user_search: {
                    filter: search,
                },
                "roles.role[]": {
                    filter: appliedRoles?.map((r) => r.value),
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
                    <AppButton
                        className={"mr-1"}
                        type={"button"}
                        variant={"secondary"}
                        onClick={() => setShow(!show)}
                    >
                        <i className="fak fa-filter-regular"></i>
                    </AppButton>
                    <AppListPageToolbar
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    <AppSwitchView link={"/attendee"} activeLink={view || ""} />
                </div>
            </AppPageHeader>
            {appliedRoles.length > 0 ? (
                <div className="filter custom-select-tag-container mb-4">
                    <div className="selected-item-container">
                        {appliedRoles.map((role) => {
                            return (
                                <div className="list-item m-2" key={role.value}>
                                    <span>{role.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
            {renderView()}
            <div className={`off-canvas px-2 py-4 ${show ? "" : "d-none"}`}>
                <Container fluid={false}>
                    <Row>
                        <AppFormSelectCreatable
                            name="roles"
                            label={t("attendee.list:filter.label.userRoles")}
                            md={12}
                            lg={12}
                            sm={12}
                            xl={12}
                            id="user-role-filter"
                            onChangeHandler={setSelectedRoles}
                            value={selectedRoles}
                            options={getOptions(OnlyFilter)}
                            control={control}
                        />
                    </Row>
                    <Row>
                        <Col className={"d-flex justify-content-end"}>
                            <AppButton
                                type={"button"}
                                variant={"secondary"}
                                onClick={() => {
                                    setShow(false);
                                    setSelectedRoles(appliedRoles);
                                }}
                            >
                                {t("attendee.list:filter.button.cancel")}
                            </AppButton>
                            <AppButton
                                type={"button"}
                                variant={"primary"}
                                className={"ml-2"}
                                onClick={() => {
                                    setPage(1);
                                    setAppliedRoles(selectedRoles);
                                    setShow(false);
                                }}
                            >
                                {t("attendee.list:filter.button.apply")}
                            </AppButton>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Fragment>
    );
};
