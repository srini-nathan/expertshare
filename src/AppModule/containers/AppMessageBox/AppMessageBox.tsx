import React, { FC, useState } from "react";
import { Row, Form, Col } from "react-bootstrap";
import { AppDetailsAction, AppChatList } from "../../components";
import { Messages } from "./messages";
import { PTOPMessages } from "./ptopmessages";
import "./assets/scss/style.scss";

// export getMessagesArrayMock should be removed
import { getMessagesArrayMock } from "../../../_mock_/mock-generator";

export interface AppMessageBoxProps {
    userChatID: (m: string) => void;
    showMessages?: boolean;
}

export const AppMessageBox: FC<AppMessageBoxProps> = ({
    showMessages = true,
}) => {
    const messagesMockData = getMessagesArrayMock();
    const [showMessagesWrapper, setShowMessagesWrapper] = useState(
        showMessages
    );

    // eslint-disable-next-line no-console
    console.log(messagesMockData.avatarUrl);

    const [, setSearch] = useState<string>("");

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

    return (
        <React.Fragment>
            <div className="message-box">
                <div className="message-box--container">
                    <div className="message-box--single">
                        <div className="tabs m-0 pt-1 pb-2">
                            <AppDetailsAction
                                newMessagesCount={messagesMockData.mewMessages}
                                avatarImg={messagesMockData.avatarUrl}
                                isPTOP
                                handleCloseMessages={() => {}}
                            />
                            {messageBoxSingle()}
                            <PTOPMessages activeTab="Text"></PTOPMessages>
                        </div>
                    </div>
                    <div
                        className="message-box--index"
                        style={
                            showMessagesWrapper
                                ? { display: "block" }
                                : { display: "none" }
                        }
                    >
                        <AppDetailsAction
                            newMessagesCount={messagesMockData.mewMessages}
                            avatarImg={messagesMockData.avatarUrl}
                            handleCloseMessages={() => {
                                setShowMessagesWrapper(false);
                            }}
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
                            {/* <i
                                className="fak fa-user-friends-light"
                                style={
                                    activeTab === "Chat"
                                        ? { color: "#30B7A7" }
                                        : { color: "#444" }
                                }
                            ></i>
                            <i
                                className="fak fa-live"
                                style={
                                    activeTab !== "Chat"
                                        ? { color: "#30B7A7" }
                                        : { color: "#444" }
                                }
                            ></i> */}
                            {/* <Button className="filter" variant="link">
                                <i className="fak fa-filter-light"></i>
                            </Button> */}

                            <Messages
                                activeTab="Chat"
                                data={messagesMockData}
                            />
                        </Row>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
