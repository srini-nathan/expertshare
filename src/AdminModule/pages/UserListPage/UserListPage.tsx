import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row, Modal } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
    AppFormTextArea,
} from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import {
    errorToast,
    successToast,
    isGranted,
    showLoader,
    hideLoader,
} from "../../../AppModule/utils";
import "./assets/scss/list.scss";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import {
    useAuthState,
    useRoles,
    useDownloadFile,
} from "../../../AppModule/hooks";
import { CONSTANTS } from "../../../config";
import { ChatMessageApi } from "../../../AppModule/apis";

const { Role } = CONSTANTS;

const {
    ROLE: { ROLE_SUPER_ADMIN, ROLE_ADMIN },
} = Role;
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
    const [show, isShow] = useState<boolean>(false);
    const [inviteList, setInviteList] = useState<string>("");
    const [userInviteErrorMessage, setErrorMessage] = useState<string>("");
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [updateLink] = useDownloadFile();
    const { t } = useTranslation();
    const { control, setValue } = useForm<{ [key: string]: string }>();
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
    async function handleExport() {
        showLoader(t("admin.users.list:exportingusers"));
        UserApi.exportUsers().then((response) => {
            hideLoader();
            updateLink({
                name: `users.csv`,
                type: "file/csv",
                file: response,
            });
        });
    }
    async function handleExportChat() {
        showLoader(t("admin.users.list:exportingchatmessages"));
        ChatMessageApi.export().then((response) => {
            hideLoader();
            updateLink({
                name: `messages.json`,
                type: "application/json",
                file: JSON.stringify(response),
            });
        });
    }
    async function handleInvite() {
        if (inviteList.length > 0) {
            showLoader(t("admin.users.list:invitingusers"));
            const formData = new FormData();
            formData.append("users", inviteList);
            UserApi.inviteUsers(formData).then(({ error, response }) => {
                isShow(false);
                hideLoader();
                setInviteList("");
                setValue("userlist", "");
                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    successToast("Invited!");
                }
            });
        } else {
            setErrorMessage("This field should not be empty!");
        }
    }
    async function handleImport() {
        if (fileInputRef && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    async function uploadFile(e: any) {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        showLoader(t("admin.users.list:importingusers"));
        UserApi.importUsers(formData).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                successToast("Imported!");
            }
            hideLoader();
        });
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
            user_search: {
                filter: search,
            },
        });
    }

    const renderModal = () => {
        return (
            <Modal show={show} backdrop="static" keyboard={false}>
                <Modal.Header
                    onHide={() => {
                        isShow(false);
                    }}
                    closeButton
                >
                    <Modal.Title>
                        {t("admin.users.list:inviteUser")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-left px-2">
                        <h5>{t("admin.users.list:inviteUserTitle")}</h5>
                        <span>
                            {t("admin.users.list:inviteUserDescription")}
                        </span>
                        <AppFormTextArea
                            md={12}
                            className="p-0 mt-2"
                            lg={12}
                            xl={12}
                            onChange={(e: any) => {
                                setInviteList(e.target.value);
                                setErrorMessage("");
                            }}
                            name={"userlist"}
                            placeholder=""
                            required={false}
                            errorMessage={userInviteErrorMessage}
                            control={control}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <AppButton
                        variant="secondary"
                        onClick={() => {
                            isShow(false);
                            setInviteList("");
                        }}
                    >
                        {t("common.button:cancel")}
                    </AppButton>
                    <AppButton variant="primary" onClick={handleInvite}>
                        {t("common.button:invite")}
                    </AppButton>
                </Modal.Footer>
            </Modal>
        );
    };
    return (
        <Fragment>
            {renderModal()}
            <AppPageHeader title={"Users"} customToolbar>
                <div className="d-block mb-3 mb-md-5">
                    <div className="d-block d-sm-flex pt-2 justify-content-end user-header-width">
                        <AppButton
                            className="mr-2 p-3 user-filter"
                            variant="secondary"
                        >
                            <AppIcon className="mr-2" name="Filter" />
                            {t("common.button:filter")}
                        </AppButton>
                        <AppListPageToolbar
                            createLink={"/admin/users/new"}
                            createLabel="Create"
                            onQuickFilterChange={handleFilter}
                            cancelTokenSources={cancelTokenSourcesRef.current}
                        />
                    </div>
                    <div className="d-flex impexp-options justify-content-end">
                        <AppButton
                            onClick={() => {
                                isShow(true);
                            }}
                            className="ml-2 mb-2 p-3 user-inv"
                            variant="secondary"
                        >
                            <AppIcon className="mr-2" name="Email" />
                            {t("common.button:invite")}
                        </AppButton>
                        {isGranted(role, ROLE_ADMIN) && (
                            <>
                                <AppButton
                                    onClick={() => {
                                        handleExport();
                                    }}
                                    className="mb-2 ml-2 p-3 user-ex"
                                    variant="secondary"
                                >
                                    <AppIcon className="mr-2" name="Upload" />
                                    {t("common.button:export")}
                                </AppButton>
                            </>
                        )}

                        {!isGranted(role, ROLE_SUPER_ADMIN) &&
                            isGranted(role, ROLE_ADMIN) && (
                                <>
                                    <AppButton
                                        onClick={() => {
                                            handleImport();
                                        }}
                                        className="p-3 user-imp mb-2 ml-2"
                                        variant="secondary"
                                    >
                                        <AppIcon
                                            className="mr-2"
                                            name="Download"
                                        />
                                        {t("common.button:import")}
                                    </AppButton>
                                </>
                            )}

                        {!isGranted(role, ROLE_SUPER_ADMIN) &&
                            isGranted(role, ROLE_ADMIN) && (
                                <>
                                    <AppButton
                                        onClick={() => {
                                            handleExportChat();
                                        }}
                                        className="p-3 chat-ex ml-2 mb-2"
                                        variant="secondary"
                                    >
                                        <AppIcon
                                            className="mr-2"
                                            name="Upload"
                                        />
                                        {t("common.button:exportChat")}
                                    </AppButton>
                                </>
                            )}
                    </div>
                </div>
            </AppPageHeader>

            <input
                ref={fileInputRef}
                onChange={uploadFile}
                id="select-file"
                type="file"
                accept=".csv"
                hidden={true}
            />
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
                                onChange={() => {
                                    handlleRoleChangeGroup();
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
