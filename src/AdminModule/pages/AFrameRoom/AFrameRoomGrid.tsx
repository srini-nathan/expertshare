import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { isString as _isString } from "lodash";
import { errorToast, successToast } from "../../../AppModule/utils";
import {
    AppPageHeader,
    AppAFrameRoomCard,
    AppLoader,
    AppSwitchView,
    AppListPageToolbar,
    AppGridPagination,
    AppFormDropdown,
    AppModal,
} from "../../../AppModule/components";
import { AFrameRoomApi } from "../../apis";
import { useAuthState, useIsGranted } from "../../../AppModule/hooks";
import { PAFrameRoom } from "../../models";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { appGridConfig } from "../../../AppModule/config";
import { CONSTANTS } from "../../../config";
import "./assets/scss/style.scss";
import {
    defaultPageSize,
    pageSizeOptions,
} from "../../../AppModule/containers/AppGrid/app-grid-helpers";

const { Role: ROLE } = CONSTANTS;

const {
    ROLE: { ROLE_OPERATOR },
} = ROLE;
export const AFrameRoomGrid: FC<RouteComponentProps> = (): JSX.Element => {
    const { containerId } = useAuthState();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [aframerooms, setAFrameRooms] = useState<PAFrameRoom[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const { view } = useParams();
    const appGridApi = useRef<GridApi>();
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);
    const [pageSize, setPageSize] = useState<number>(30);
    const [active, setActive] = useState<number>(1);
    const [showDelete, setDeleteShow] = useState(0);
    const { t } = useTranslation();

    const fetchData = (params = {}) => {
        isLoading(true);
        AFrameRoomApi.find<PAFrameRoom>(
            active,
            {
                "container.id": containerId,
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
                setAFrameRooms(response.items);
                setTotalItems(response.totalItems);
            }
        });
    };

    async function handleFilter(search: string) {
        if (view === "grid") fetchData({ name: search });
        else
            appGridApi.current?.setFilterModel({
                name: {
                    filter: search,
                },
            });
    }

    useEffect(() => {
        fetchData();
    }, [active, pageSize]);
    async function handleDelete(id: number) {
        AFrameRoomApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                if (view === "grid") fetchData();
                else
                    appGridApi.current?.refreshServerSideStore({
                        purge: false,
                        route: [],
                    });
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
                AFrameRoomApi.find<PAFrameRoom>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
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
                        setAFrameRooms(response.items);
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
            case "grid":
                if (loading) {
                    return <AppLoader />;
                }
                return (
                    <Row className="events-grid--container mt-4 mx-0">
                        {aframerooms.map((aframeroom: PAFrameRoom) => (
                            <AppAFrameRoomCard
                                isGrantedControl={isGrantedControl}
                                handleDelete={(id: number) => {
                                    setDeleteShow(id);
                                }}
                                aframeroom={aframeroom}
                                key={aframeroom.id}
                            />
                        ))}
                        <AppModal
                            show={showDelete > 0}
                            title={"Delete Action"}
                            handleClose={() => {
                                setDeleteShow(0);
                            }}
                            handleDelete={() => {
                                setDeleteShow(0);
                                handleDelete(showDelete).then();
                            }}
                            bodyContent={"Are you sure want to delete ?"}
                        />
                    </Row>
                );
            case "list":
            default:
                return (
                    <Col className="p-0">
                        <AppGrid
                            frameworkComponents={appGridFrameworkComponents}
                            columnDef={appGridColDef({
                                onPressDelete: handleDelete,
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
        }
    };

    return (
        <Fragment>
            <AppPageHeader
                title={t("admin.rooms.list:header.title")}
                customToolbar
            >
                <div className="d-flex pt-2 mb-5">
                    <AppListPageToolbar
                        createLink={"/admin/room/new"}
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    {false && (
                        <AppSwitchView
                            link={"/admin/rooms"}
                            activeLink={view || "grid"}
                        />
                    )}
                </div>
            </AppPageHeader>

            {renderView()}
            {totalItems > 9 ? (
                <div className="d-flex flex-row app-grid-action py-3">
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
