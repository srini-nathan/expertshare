import React, { FC, Fragment, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { appGridColDef } from "./app-grid-col-def";
import {
    AppPageHeader,
    AppSwitchView,
    AppListPageToolbar,
    AppLoader,
} from "../../components";
import "./assets/scss/style.scss";
import { AttendeeCard } from "../../components/AttendeeCard";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { AppGrid } from "../../containers/AppGrid";
import { appGridConfig } from "../../config";
import { UserApi } from "../../../AdminModule/apis";
import { User } from "../../models/entities/User";
import { SimpleObject } from "../../models";
import { checkAndParseResponse, errorToast } from "../../utils";

export const AttendeeOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const { view } = useParams();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, isLoading] = useState<boolean>(true);
    const [attendees, setAttendees] = useState<User[]>([]);
    const fetchData = () => {
        isLoading(true);
        UserApi.getAttendeeList<User>().then(({ response, error }) => {
            isLoading(false);

            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                const parsedData: SimpleObject<any> = checkAndParseResponse(
                    response
                );
                // setAttendees(response.items);
                setAttendees(parsedData["hydra:member"]);
            }
        });
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <AppLoader />;

    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            name: {
                filter: search,
            },
        });
    }
    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                UserApi.getAttendeeList<User>(pageNo, {}).then(
                    ({ response, error }) => {
                        isLoading(false);
                        if (error !== null) {
                            if (_isString(error)) {
                                errorToast(error);
                            }
                        } else if (response !== null) {
                            const parsedData: SimpleObject<any> = checkAndParseResponse(
                                response
                            );
                            // setAttendees(response.items);
                            // eslint-disable-next-line no-console
                            console.log(
                                "response attendee list ",
                                response,
                                parsedData["hydra:member"]
                            );
                            setAttendees(parsedData["hydra:member"]);
                            setTotal(parsedData["hydra:member"].length);
                            params.successCallback(
                                parsedData["hydra:member"],
                                parsedData["hydra:member"].length
                            );
                        }
                    }
                );
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
                    <Col className="p-0">
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
                    </Row>
                );
        }
    };

    return (
        <Fragment>
            <AppPageHeader title={"Attendees"} customToolbar>
                <div className="d-flex pt-2 mb-5">
                    <AppListPageToolbar
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    <AppSwitchView
                        link={"/attendees"}
                        activeLink={view || "grid"}
                    />
                </div>
            </AppPageHeader>
            {renderView()}
        </Fragment>
    );
};
