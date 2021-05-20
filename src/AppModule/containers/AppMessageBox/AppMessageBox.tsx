import React, { FC, useState } from "react";
import { Row, Form, Col, ListGroup } from "react-bootstrap";
import {
    AppTabs,
    AppTab,
    AppDetailsAction,
    AppMessageItem,
    AppChatList,
} from "../../components";
import "./assets/scss/style.scss";

// export getMessagesArrayMock should be removed

import { getMessagesArrayMock } from "../../../_mock_/mock-generator";

export interface AppMessageBoxProps {
    userChatID: (m: string) => void;
}

export const AppMessageBox: FC<AppMessageBoxProps> = () => {
    const messagesMockData = getMessagesArrayMock();

    // eslint-disable-next-line no-console
    console.log(messagesMockData.avatarUrl);

    const [, setSearch] = useState<string>("");
    const [activeTab, setActiveTab] = React.useState<string>("All Users");

    const handleQuickSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
    };

    const messageBoxSingle = () => {
        return (
            <Row className="row m-0 px-0 pt-1 pb-3">
                <Col className="chat-list col-auto p-0 w-100">
                    <AppChatList />
                </Col>
            </Row>
        );
    };

    const appMessageItems = (message: any) => {
        return (
            <AppMessageItem
                id={message.id}
                name={message.name}
                imageURL={message.imageURL}
                newMessages={message.lastMessage.newMessages}
                message={message.lastMessage.message}
                lastMessageTime={message.lastMessage.time}
                online={message.lastMessage.online}
                messageIdHandler={() => {}}
            />
        );
    };

    return (
        <React.Fragment>
            <div className="message-box">
                <div className="message-box--container">
                    <div className="message-box--single">
                        <AppDetailsAction
                            newMessagesCount={messagesMockData.mewMessages}
                            avatarImg={messagesMockData.avatarUrl}
                            isPTOP
                        />
                        {messageBoxSingle()}
                    </div>
                    <div className="message-box--index">
                        <AppDetailsAction
                            newMessagesCount={messagesMockData.mewMessages}
                            avatarImg={messagesMockData.avatarUrl}
                        />
                        <Row className="row m-0 px-3 pt-3 pb-1">
                            <Col className="search col-12 p-0">
                                <div className="search--container">
                                    <Form.Control
                                        onChange={handleQuickSearch}
                                        placeholder="Search ..."
                                        type={"search"}
                                    ></Form.Control>
                                    <i className="fak fa-search-light"></i>
                                </div>
                            </Col>
                        </Row>
                        <Row className="tabs row m-0 pt-1 pb-2">
                            <i
                                className="fak fa-user-friends-light"
                                style={
                                    activeTab === "All Users"
                                        ? { color: "#30B7A7" }
                                        : { color: "#444" }
                                }
                            ></i>
                            <i
                                className="fak fa-live"
                                style={
                                    activeTab !== "All Users"
                                        ? { color: "#30B7A7" }
                                        : { color: "#444" }
                                }
                            ></i>
                            {/* <Button className="filter" variant="link">
                                <i className="fak fa-filter-light"></i>
                            </Button> */}
                            <AppTabs
                                onSelect={setActiveTab}
                                activeKey={activeTab}
                            >
                                <AppTab eventKey="All Users" title="All Users">
                                    <div className="message mt-2">
                                        <Row className="m-0 p-0">
                                            <ListGroup defaultActiveKey="#link1">
                                                {messagesMockData.messages.map(
                                                    (message: any) =>
                                                        appMessageItems(message)
                                                )}
                                            </ListGroup>
                                        </Row>
                                    </div>
                                </AppTab>
                                <AppTab
                                    eventKey="Online Only"
                                    title="Online Only"
                                >
                                    <div className="message mt-2">
                                        <Row className="m-0 p-0">
                                            <ListGroup defaultActiveKey="#link1">
                                                {messagesMockData.messages.map(
                                                    (message: any) =>
                                                        appMessageItems(message)
                                                )}
                                            </ListGroup>
                                        </Row>
                                    </div>
                                </AppTab>
                            </AppTabs>
                        </Row>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
