import React, { FC, useState } from "react";
import { Row, Form, Col, ListGroup } from "react-bootstrap";
import { AppDetailsAction } from "../AppDetailsAction";
import { AppMessageItem } from "../AppMessageItem";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";

export interface AppGroupWindowProps {
    show: boolean;
    handleCloseGroupWindow: () => void;
    handleNewGroup: (group: []) => void;
    data: any;
}

export interface AppMessageProps {
    message: any;
    userIdHandler: (id: string) => void;
}

export interface UserBangeProps {
    id: string;
    name: string;
    handleRemoveId: (id: string) => void;
}

export const AppGroupWindow: FC<AppGroupWindowProps> = ({
    show,
    handleCloseGroupWindow,
    handleNewGroup,
    data,
}): JSX.Element => {
    const [groupItems, setGroupItems] = useState<any>(data.messages);
    const [newGroupUsers, setNewGroupUsers] = useState<any>([]);

    const addActiveId = (id: string) => {
        const item = groupItems.find((user: any) => user.id === Number(id));
        setNewGroupUsers([...newGroupUsers, item]);

        const index = groupItems.findIndex((x: any) => x.id === Number(id));
        const newGroups = [...groupItems];
        newGroups[index].active = true;
        setGroupItems(newGroups);
    };

    const AppMessageItems: FC<AppMessageProps> = ({
        message,
        userIdHandler,
    }: any) => {
        const handleUserId = (id: string) => {
            userIdHandler(id);
        };

        return (
            <AppMessageItem
                id={message.id}
                name={message.name}
                imageURL={message.imageURL}
                newMessages={message.lastMessage.newMessages}
                message={message.lastMessage.message}
                lastMessageTime={message.lastMessage.time}
                online={message.lastMessage.online}
                messageIdHandler={(id) => {
                    handleUserId(id);
                }}
                group
                active={message.active}
            />
        );
    };

    const UserBadge: FC<UserBangeProps> = ({ id, name, handleRemoveId }) => {
        const removeId = (event: any) => {
            handleRemoveId(event.currentTarget.id);
        };

        return (
            <div className="badge badge-green">
                {name}
                <button
                    aria-label="Close"
                    type="button"
                    className="badge-green--close"
                    id={id}
                    onClick={removeId}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        );
    };

    const removeUser = (id: string) => {
        const gr = [...newGroupUsers].filter((item) => {
            return item.id !== Number(id);
        });
        setNewGroupUsers(gr);

        const index = groupItems.findIndex((x: any) => x.id === Number(id));
        const newGroups = [...groupItems];
        delete newGroups[index].active;
        setGroupItems(newGroups);
    };

    const cleanUsers = () => {
        const newGroups = [...groupItems];
        newGroups.forEach((item) => {
            delete item.active;
        });
        setGroupItems(newGroups);
        setNewGroupUsers([]);
        handleCloseGroupWindow();
    };

    const cancelGroupWindow = () => {
        cleanUsers();
    };

    const handleCreateNewGroup = () => {
        handleNewGroup(newGroupUsers);
        cleanUsers();
    };

    return (
        <React.Fragment>
            {show && (
                <div className="message-box--group">
                    <AppDetailsAction
                        handleCloseMessages={cancelGroupWindow}
                        group
                    />
                    <Row className="row m-0 px-3 pt-3 pb-1">
                        <Col className="search col-12 p-0">
                            <div className="search--container">
                                <Form.Control
                                    onChange={() => {}}
                                    placeholder="Search..."
                                    type={"search"}
                                ></Form.Control>
                                <i className="fas fa-search"></i>
                            </div>
                        </Col>
                    </Row>
                    <div className="message mt-2">
                        <ListGroup>
                            {groupItems.map((message: any, i: number) => {
                                return (
                                    <AppMessageItems
                                        key={i}
                                        message={message}
                                        userIdHandler={(id) => {
                                            addActiveId(id);
                                        }}
                                    />
                                );
                            })}
                        </ListGroup>
                    </div>
                    <div className="create-group">
                        <div className="group--container">
                            <Form.Control
                                onChange={() => {}}
                                placeholder="Enter Group Name"
                                type={"name"}
                            ></Form.Control>
                        </div>
                        <div className="group">
                            <div className="group-users">
                                <span>Users</span>
                                {/* <span className="count">0/99</span> */}
                            </div>

                            {newGroupUsers.length > 0 &&
                                newGroupUsers.map((item: any) => {
                                    return (
                                        <UserBadge
                                            id={item.id}
                                            name={item.name}
                                            handleRemoveId={removeUser}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                    <div className="group-buttons">
                        <AppButton
                            className="btn-group-cancel"
                            variant="light"
                            onClick={cancelGroupWindow}
                        >
                            <i className="fas fa-times"></i>
                            <span>Cancel</span>
                        </AppButton>
                        <AppButton
                            className="btn btn-light btn-group-create"
                            variant="light"
                            disabled={newGroupUsers.length === 0}
                            onClick={handleCreateNewGroup}
                        >
                            <i className="fas fa-check"></i>
                            <span>Create</span>
                        </AppButton>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};
