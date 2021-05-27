import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { isString as _isString } from "lodash";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { UserApi } from "../../apis";
import { User } from "../../models";
import {
    AppPageHeader,
    AppListPageToolbar,
    AppButton,
    AppIcon,
} from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import { errorToast, successToast } from "../../../AppModule/utils";
import "./assets/scss/list.scss";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { useAuthState, useRoles } from "../../../AppModule/hooks";

type UpdateRoleForm = {
    role: string;
};

function createCore() {
    let stateContainer: number[] = [];
    let userList: User[] = [];

    const handleState = (newState: number, setter: any) => {
        const state = stateContainer;
        const index = state.indexOf(newState);
        if (index !== -1) {
            stateContainer = [
                ...state.slice(0, index),
                ...state.slice(index + 1),
            ];
        } else {
            stateContainer = [...state, newState];
        }
        setter(stateContainer);
    };
    const getUserList = () => {
        return userList;
    };

    const clearList = (setter: any) => {
        stateContainer = [];
        setter(stateContainer);
    };
    const handleUserList = (users: User[]) => {
        userList = users;
    };

    return {
        getState: () => stateContainer,
        handleState,
        getUserList,
        handleUserList,
        clearList,
    };
}
const core = createCore();
export const UserListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const [selectedUsers, setSelectedUsers] = useState<number[]>(
        core.getState()
    );
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { state } = React.useContext(AuthContext);
    const { containerId } = state as AuthState;
    const { role } = useAuthState();
    const { filterRoles } = useRoles();
    const FilterRoute = filterRoles(role);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                UserApi.find<User>(
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
                        core.handleUserList(response.items);
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

    async function handleDelete(id: number) {
        UserApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }
    async function handleCheckboxHeader() {
        if (core.getUserList().length !== core.getState().length)
            core.clearList(setSelectedUsers);
        core.getUserList().forEach((e) => {
            core.handleState(e.id, setSelectedUsers);
        });
    }

    function handleCheckbox(id: number) {
        core.handleState(id, setSelectedUsers);
    }
    async function handleRoleChange(id: number, newRole: string) {
        UserApi.createOrUpdate<UpdateRoleForm>(id, { role: newRole }).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    errorToast(errorMessage);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    successToast("User role updated.");
                }
            }
        );
    }

    async function handlleRoleChangeGroup() {
        // UserApi.createOrUpdate<UpdateRoleForm>(id, { role }).then(
        //     ({ error, errorMessage }) => {
        //         if (error instanceof UnprocessableEntityErrorResponse) {
        //             errorToast(errorMessage);
        //         } else if (errorMessage) {
        //             errorToast(errorMessage);
        //         } else {
        //             successToast("User role updated.");
        //         }
        //     }
        // );
    }

    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            firstName: {
                filter: search,
            },
        });
    }

    return (
        <Fragment>
            <AppPageHeader title={"Users"} customToolbar>
                <div className="d-flex pt-2 mb-5">
                    <AppButton className="mr-2 p-3" variant="secondary">
                        <AppIcon className="mr-2" name="Filter" />
                        Filter
                    </AppButton>
                    <AppListPageToolbar
                        createLink={"/admin/users/new"}
                        createLabel="Create"
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    <AppButton className="mx-2 p-3" variant="secondary">
                        <AppIcon className="mr-2" name="Email" />
                        Invite
                    </AppButton>
                    <AppButton className="mr-2 p-3" variant="secondary">
                        <AppIcon className="mr-2" name="Upload" />
                        Export
                    </AppButton>
                    <AppButton className="mr-2 p-3" variant="secondary">
                        <AppIcon className="mr-2" name="Download" />
                        Batch Import
                    </AppButton>
                    <AppButton className="mr-2 p-3" variant="secondary">
                        <AppIcon className="mr-2" name="Settings" />
                        Columns
                    </AppButton>
                </div>
            </AppPageHeader>
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
                            onCheckHeaderCheckbox: handleCheckboxHeader,
                            onCheckCheckbox: handleCheckbox,
                            onSelectChange: handleRoleChange,
                            selectedUserList: selectedUsers,
                        })}
                        dataSource={getDataSource()}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi.current = event.api;
                        }}
                    />

                    {selectedUsers.length > 0 && (
                        <div className="bulk-menu d-flex p-4">
                            <span className="my-auto">
                                {selectedUsers.length} users selected
                            </span>
                            <select
                                onChange={(e: any) => {
                                    handlleRoleChangeGroup(e.target.value);
                                }}
                                className="ml-3 list-deopdown"
                            >
                                <option value="0">Set Role</option>
                                {FilterRoute.map((e: any) => {
                                    return (
                                        <option value={e["@id"]}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                            </select>

                            <AppButton className="ml-4 p-3" variant="secondary">
                                <AppIcon name="delete" />
                            </AppButton>
                            <AppButton
                                className="ml-3  p-3"
                                variant="secondary"
                            >
                                <AppIcon name="Email" />
                            </AppButton>

                            <AppButton className="ml-3 p-3" variant="secondary">
                                <AppIcon name="Settings" />
                            </AppButton>
                            <AppButton className="ml-3 p-3" variant="secondary">
                                <AppIcon className="mr-2" name="Download" />
                                Download
                            </AppButton>
                        </div>
                    )}
                </Col>
            </Row>
        </Fragment>
    );
};
