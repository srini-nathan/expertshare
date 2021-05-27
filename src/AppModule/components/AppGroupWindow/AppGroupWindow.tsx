import React, { FC, useState } from "react";
import { Row, Form, Col, ListGroup } from "react-bootstrap";
import { AppDetailsAction } from "../AppDetailsAction";
import { AppMessageItem } from "../AppMessageItem";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";

export interface AppGroupWindowProps {
    show: boolean;
    handleCloseGroupWindow: () => void;
    data: any;
}

export interface AppMessageProps {
    message: any;
    userIdHandler: (id: string) => void;
}

export const AppGroupWindow: FC<AppGroupWindowProps> = ({
    show,
    handleCloseGroupWindow,
    data,
}): JSX.Element => {
    const [groupItems, setGroupItems] = useState<any>(data.messages);

    const addActiveId = (id: string) => {
        const index = groupItems.findIndex((x: any) => x.id === Number(id));
        // const item = groupItems.find((user: any) => user.id === Number(id));

        const newGroups = [...groupItems];
        newGroups[index].active = true;
        setGroupItems(newGroups);
    };

    // eslint-disable-next-line no-console
    console.log(groupItems);

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

    return (
        <React.Fragment>
            {show && (
                <div className="message-box--group">
                    <AppDetailsAction
                        handleCloseMessages={handleCloseGroupWindow}
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
                                <i className="fak fa-search-light"></i>
                            </div>
                        </Col>
                    </Row>
                    <div className="message mt-2">
                        <ListGroup>
                            {groupItems.map((message: any) => (
                                <AppMessageItems
                                    message={message}
                                    userIdHandler={(id) => {
                                        addActiveId(id);
                                    }}
                                />
                            ))}
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
                        <div className="group-users">
                            <span>Users</span>
                            {/* <span className="count">0/99</span> */}
                        </div>
                    </div>
                    <div className="group-buttons">
                        <AppButton className="btn-group-cancel" variant="light">
                            <i className="fas fa-times"></i>
                            <span>Cancel</span>
                        </AppButton>
                        <AppButton
                            className="btn btn-light btn-group-create"
                            variant="light"
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
