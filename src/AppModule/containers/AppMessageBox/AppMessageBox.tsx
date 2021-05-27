import React, { FC, useState } from "react";
import { Row, Form, Col } from "react-bootstrap";
import {
    AppDetailsAction,
    AppChatList,
    AppGroupWindow,
} from "../../components";
import { Messages } from "./messages";
import { PTOPMessages } from "./ptopmessages";
import "./assets/scss/style.scss";

// export getMessagesArrayMock should be removed
import { getMessagesArrayMock } from "../../../_mock_/mock-generator";

export interface AppMessageBoxProps {
    userChatID: (m: string) => void;
    initialMessagesWrapper?: boolean;
    initialMessagesBlock?: boolean;
}

export const AppMessageBox: FC<AppMessageBoxProps> = ({
    initialMessagesWrapper = true,
    initialMessagesBlock = true,
}) => {
    const messagesMockData = getMessagesArrayMock();
    const [showMessagesWrapper, setShowMessagesWrapper] = useState(
        initialMessagesWrapper
    );

    const [showMessagesBlock, setsShowMessagesBlock] = useState(
        initialMessagesBlock
    );

    // eslint-disable-next-line no-console
    console.log(showMessagesBlock);

    const [, setSearch] = useState<string>("");
    const [showCreateGroup, setShowGreateGroup] = useState(false);

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
                                handleHidePTOPMessages={() => {}}
                                isPTOP
                                handleCloseMessages={() => {}}
                            />
                            {messageBoxSingle()}
                            <PTOPMessages activeTab="Text"></PTOPMessages>
                        </div>
                    </div>

                    <AppGroupWindow
                        data={messagesMockData}
                        show={showCreateGroup}
                        handleCloseGroupWindow={() => {
                            setShowGreateGroup(false);
                        }}
                    />

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
                            handleHidePTOPMessages={() => {
                                setsShowMessagesBlock(!showMessagesBlock);
                            }}
                            handleCloseMessages={() => {
                                setShowMessagesWrapper(false);
                            }}
                        />
                        <div
                            className={`message-box--block${
                                showMessagesBlock ? "--show" : ""
                            }`}
                        >
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
                                <Messages
                                    activeTab="Chat"
                                    data={messagesMockData}
                                    handleGroupClicked={() =>
                                        setShowGreateGroup(true)
                                    }
                                />
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
