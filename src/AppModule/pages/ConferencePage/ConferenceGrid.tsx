import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { isString as _isString } from "lodash";
import { errorToast, successToast } from "../../utils";
import {
    AppPageHeader,
    AppConferenceCard,
    AppLoader,
    AppSwitchView,
    AppListPageToolbar,
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

    const fetchData = (params = {}) => {
        ConferenceApi.find<PConference>(
            1,
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
                setConferences(response.items);
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
    }, []);
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
                successToast("Successfully cloned");
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
                return (
                    <Row className="events-grid--container mt-4 mx-0">
                        {conferences.map((conference: PConference) => (
                            <AppConferenceCard
                                isGrantedControl={isGrantedControl}
                                handleDelete={(id: number) => {
                                    handleDelete(id);
                                }}
                                handleClone={(id: number) => {
                                    handleClone(id);
                                }}
                                conference={conference}
                            />
                        ))}
                    </Row>
                );
        }
    };

    if (loading) return <AppLoader />;

    return (
        <Fragment>
            <AppPageHeader title={"Envent"} customToolbar>
                <div className="d-flex pt-2 mb-5">
                    <AppListPageToolbar
                        createLink={"/conference/new"}
                        createLabel="Create New Event"
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    <AppSwitchView
                        link={"/conferences"}
                        activeLink={view || "grid"}
                    />
                </div>
            </AppPageHeader>
            {renderView()}
        </Fragment>
    );
};
