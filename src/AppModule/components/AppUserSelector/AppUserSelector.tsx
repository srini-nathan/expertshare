import React, { FC } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { User } from "../../../AdminModule/models";
import { AppUserListItem } from "../AppUserListItem";

export interface AppUserSelectorProps {
    show: boolean;
    handleClose: (show: boolean) => void;
    handleSelectedUsers: (users: User[]) => void;
    users: User[];
    selectedUsers: User[];
    totalItem?: number;
    loadMore?: (value?: string) => void;
}

interface UserBangeProps {
    id: number;
    name: string;
    handleRemoveId: (id: number) => void;
}

export const AppUserSelector: FC<AppUserSelectorProps> = ({
    show,
    handleClose,
    users,
    handleSelectedUsers,
    selectedUsers = [],
    loadMore,
}): JSX.Element => {
    const addActiveId = (id: number) => {
        const item = users.find((user: User) => user.id === id);

        handleSelectedUsers([...(selectedUsers as User[]), item as User]);
    };

    const getActive = (id: number): boolean => {
        const item = selectedUsers.find((user: User) => user.id === Number(id));

        if (item) return true;
        return false;
    };
    const UserBadge: FC<UserBangeProps> = ({ id, name, handleRemoveId }) => {
        const removeId = (event: any) => {
            handleRemoveId(event.currentTarget.id);
        };

        return (
            <div className="badge">
                {name}
                <button
                    aria-label="Close"
                    type="button"
                    className="badge--close"
                    id={`${id}`}
                    onClick={removeId}
                >
                    <i className="fak fa-times-light" aria-hidden="true"></i>
                </button>
            </div>
        );
    };

    const removeUser = (id: number) => {
        const newUsers = selectedUsers.filter((item) => {
            return item.id !== Number(id);
        });
        handleSelectedUsers(newUsers);
    };

    // const cleanUsers = () => {
    //     const newGroups = [...groupItems];
    //     newGroups.forEach((item) => {
    //         delete item.active;
    //     });
    //     setGroupItems(newGroups);
    //     setNewGroupUsers([]);
    //     handleClose();
    // };

    // const cancelGroupWindow = () => {
    //     cleanUsers();
    // };

    return (
        <React.Fragment>
            {show && (
                <div className="edit-users--popup">
                    <div className="edit-users--popup--container w-100">
                        <div className="header p-3">
                            <div className="row m-0 p-0">
                                <div className="header--title col-auto pl-0">
                                    <h2 className="mb-0">
                                        <i className="fak fa-create-group mr-2"></i>
                                        Select Users
                                    </h2>
                                </div>
                                <div className="header--close col-auto mr-0 ml-auto pr-0">
                                    <AppButton
                                        onClick={() => {
                                            handleClose(false);
                                        }}
                                        variant="secondary"
                                    >
                                        <i className="fak fa-times-light"></i>
                                    </AppButton>
                                </div>
                                <div className="header--search col-12 px-0 pt-3">
                                    <div className="search-input-box left-icon">
                                        <Form.Control
                                            onChange={(e: any) => {
                                                if (loadMore)
                                                    loadMore(e.target.value);
                                            }}
                                            placeholder="Search ..."
                                            type={"name"}
                                        ></Form.Control>
                                        <i
                                            className="fak fa-search-light"
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="content"
                            onScroll={(e: any) => {
                                const {
                                    scrollTop,
                                    offsetHeight,
                                    scrollHeight,
                                } = e.target;
                                const height = scrollHeight - offsetHeight;
                                if (loadMore) {
                                    if (scrollTop === height) {
                                        loadMore();
                                    }
                                }
                            }}
                        >
                            <Row className="m-0 content--inner">
                                {users.map((user: User) => {
                                    return (
                                        <div className="content--inner--item">
                                            <Row className="m-0">
                                                <div className="detail  col-auto">
                                                    <AppUserListItem
                                                        user={user}
                                                    />
                                                </div>
                                                <div className="add col-auto mr-0 ml-auto">
                                                    <AppButton
                                                        disabled={getActive(
                                                            user.id
                                                        )}
                                                        onClick={() =>
                                                            addActiveId(user.id)
                                                        }
                                                        className={`more ${
                                                            getActive(
                                                                user.id
                                                            ) && "green-btn"
                                                        }`}
                                                        variant="light"
                                                    >
                                                        <i className="fal fa-plus-circle btn-icon"></i>
                                                    </AppButton>
                                                </div>
                                            </Row>
                                        </div>
                                    );
                                    return <></>;
                                })}
                            </Row>
                        </div>
                    </div>
                    <div className="select-box py-3 px-1">
                        <div className="select-box--header">
                            <div className="row m-0 p-0">
                                <div className="title col-6">
                                    <h4 className="mb-0">Users</h4>
                                </div>
                                {/* <span className="count">0/99</span> */}
                            </div>
                            <div className="select-box--content px-2">
                                <div className="row m-0 p-0">
                                    {selectedUsers.length > 0 &&
                                        selectedUsers.map((item: User) => {
                                            return (
                                                <UserBadge
                                                    id={item.id}
                                                    name={`${item.firstName} ${item.lastName}`}
                                                    handleRemoveId={removeUser}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="confirm-box p-3">
                        <Row>
                            <Col md={6}>
                                <AppButton
                                    className="btn-block"
                                    variant="secondary"
                                    onClick={() => {
                                        handleClose(false);
                                    }}
                                >
                                    <i className="fas  mr-2 fa-times"></i>
                                    <span>Close</span>
                                </AppButton>
                            </Col>
                            <Col md={6}>
                                <AppButton
                                    variant="secondary"
                                    className="btn-block"
                                    onClick={() => {
                                        handleClose(false);
                                    }}
                                >
                                    <i className="fak mr-2 fa-check-regular-bold"></i>
                                    <span>Confirm</span>
                                </AppButton>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};
