import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Canceler } from "axios";
import { Col } from "react-bootstrap";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { isString as _isString } from "lodash";
import { errorToast, successToast } from "../../../AppModule/utils";
import {
    AppPageHeader,
    AppSwitchView,
    AppListPageToolbar,
    AppGridPagination,
    AppFormDropdown,
    AppBreadcrumb,
} from "../../../AppModule/components";
import { AFrameRoomApi, AFramePanelApi } from "../../apis";
import { useAuthState, useIsGranted } from "../../../AppModule/hooks";
import { PAFrameRoom, PAFramePanel } from "../../models";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import {
    appGridColDefForRooms,
    appGridColDefForPanels,
} from "./app-grid-col-def";
import {
    appGridFrameworkComponentsForPanels,
    appGridFrameworkComponentsForRooms,
} from "./app-grid-framework-components";
import { appGridConfig } from "../../../AppModule/config";
import { CONSTANTS } from "../../../config";
import "./assets/scss/style.scss";
import {
    defaultPageSize,
    pageSizeOptions,
} from "../../../AppModule/containers/AppGrid/app-grid-helpers";

const {
    Role: ROLE,
    AFramePanel: {
        TYPE: { TYPE_DOOR, TYPE_SCREEN, TYPE_BILLBOARD, TYPE_PROJECTOR },
    },
} = CONSTANTS;

const pageTitle = {
    [TYPE_DOOR]: "Door",
    [TYPE_SCREEN]: "Screen",
    [TYPE_BILLBOARD]: "Bill Board",
    [TYPE_PROJECTOR]: "Projector",
};

const {
    ROLE: { ROLE_OPERATOR },
} = ROLE;
export const AFramePanelGrid: FC<RouteComponentProps> = (): JSX.Element => {
    const { containerId } = useAuthState();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { view, roomId, panelType } = useParams();
    const appGridApi = useRef<GridApi>();
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);
    const [pageSize, setPageSize] = useState<number>(30);
    const [active, setActive] = useState<number>(1);

    const fetchData = (params = {}) => {
        AFrameRoomApi.find<PAFrameRoom>(
            active,
            {
                "container.id": containerId,
                type: panelType,
                "aFrameRoom.id": `/api/a_frame_rooms/${roomId}`,
                ...params,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        ).then(({ response, error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
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

    async function handleDeleteRoom(id: number) {
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
    async function handleDeletePanel(id: number) {
        AFramePanelApi.deleteById(id).then(({ error }) => {
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
    function getDataSourceForAFramePanels(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                AFramePanelApi.find<PAFramePanel>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "container.id": containerId,
                        type: panelType,
                        "aFrameRoom.id": `/api/a_frame_rooms/${roomId}`,
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
    function getDataSourceForAFrameRooms(): IServerSideDatasource {
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
        if (roomId && panelType) {
            return (
                <Col className="p-0">
                    <AppGrid
                        frameworkComponents={
                            appGridFrameworkComponentsForPanels
                        }
                        columnDef={appGridColDefForPanels({
                            onPressDelete: handleDeletePanel,
                            isGrantedControl,
                        })}
                        dataSource={getDataSourceForAFramePanels()}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi.current = event.api;
                        }}
                    />
                </Col>
            );
        }

        return (
            <Col className="p-0">
                <AppGrid
                    frameworkComponents={appGridFrameworkComponentsForRooms}
                    columnDef={appGridColDefForRooms({
                        onPressDelete: handleDeleteRoom,
                        isGrantedControl,
                    })}
                    dataSource={getDataSourceForAFrameRooms()}
                    totalItems={totalItems}
                    onReady={(event) => {
                        appGridApi.current = event.api;
                    }}
                />
            </Col>
        );
    };

    return (
        <Fragment>
            {panelType && (
                <AppBreadcrumb linkText={"Rooms"} linkUrl={"/admin/rooms"} />
            )}
            <AppPageHeader
                title={panelType ? pageTitle[panelType] : "Rooms"}
                customToolbar
            >
                <div className="d-flex pt-2 mb-5">
                    {panelType ? (
                        <AppListPageToolbar
                            createLink={`/admin/room/${roomId}/${panelType}/new`}
                            createLabel={`Create ${pageTitle[panelType]}`}
                            onQuickFilterChange={handleFilter}
                            cancelTokenSources={cancelTokenSourcesRef.current}
                        />
                    ) : (
                        <AppListPageToolbar
                            createLink={"room/new"}
                            createLabel={`Create New Room`}
                            onQuickFilterChange={handleFilter}
                            cancelTokenSources={cancelTokenSourcesRef.current}
                        />
                    )}
                    {false && (
                        <AppSwitchView
                            link={"/admin/rooms"}
                            activeLink={view || "grid"}
                        />
                    )}
                </div>
            </AppPageHeader>

            {renderView()}
            <div className="d-flex flex-row app-grid-action py-3">
                <AppGridPagination
                    className="mr-3"
                    itemsPerPage={pageSize}
                    totalItems={totalItems}
                    active={active}
                    onClick={setActive}
                />
                {totalItems > 0 ? (
                    <div className="pagination-container">
                        <AppFormDropdown
                            id={"pageSize"}
                            defaultValue={defaultPageSize()}
                            options={pageSizeOptions()}
                            onChange={(e: any) => setPageSize(e.value)}
                            menuPlacement={"top"}
                        />
                    </div>
                ) : null}
            </div>
        </Fragment>
    );
};
