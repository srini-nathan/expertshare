import React, { FunctionComponent, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import DefaultAvatar from "./assets/images/default-avatar.png";
import GreateGroup from "./assets/images/greate-group.svg";
import "./assets/scss/style.scss";

export interface AppDetailsActionProps {
    defaultAvatar?: string;
    newMessagesCount?: number;
    avatarImg?: string;
    isPTOP?: boolean;
    group?: boolean;
    addComment?: boolean;
    handleHidePTOPMessages?: () => void;
    handleCloseMessages: () => void;
    handleLike?: () => void;
    handleAnswerMessage?: (message: string, questionId: number) => void;
    showShareBtn?: boolean;
    children?: JSX.Element[] | JSX.Element;
    questionId?: number;
}
export const AppDetailsAction: FunctionComponent<AppDetailsActionProps> = ({
    defaultAvatar = DefaultAvatar,
    newMessagesCount = 0,
    avatarImg,
    isPTOP,
    handleHidePTOPMessages,
    handleCloseMessages,
    group,
    addComment = false,
    handleLike,
    handleAnswerMessage,
    showShareBtn,
    children,
    questionId,
}) => {
    const [rotateBtn, setRotateBtn] = useState(false);
    const [openMessageArea, setOpenMessageArea] = useState<boolean>(false);

    const qId = questionId;

    const handleCloseWindow = () => {
        if (!isPTOP) {
            handleCloseMessages();
        }
    };

    const handleHideWindow = () => {
        if (!isPTOP) {
            if (handleHidePTOPMessages) {
                handleHidePTOPMessages();
            }
            setRotateBtn(!rotateBtn);
        }
    };

    const handleAnswer = () => {
        setOpenMessageArea(!openMessageArea);
    };

    const answerMessage = (message: string) => {
        // eslint-disable-next-line no-console
        console.log(qId);
        if (handleAnswerMessage && qId) {
            handleAnswerMessage(message, qId);
        }
        setOpenMessageArea(false);
    };

    return (
        <>
            <Row className="m-0 px-3 pt-3 pb-2 first-row">
                <Col className="details col-auto p-0">
                    <div className="details--content">
                        <i
                            className={`details--content--profile ${
                                group && "no-after"
                            }`}
                            style={{
                                backgroundImage: `url(${
                                    group
                                        ? GreateGroup
                                        : avatarImg || defaultAvatar
                                })`,
                            }}
                        ></i>
                        {!isPTOP ? (
                            <h2 className="details--content--title">
                                {group ? "Create Group" : "Messages"}
                                {newMessagesCount > 0 && (
                                    <span className="details--content--title--count">
                                        {newMessagesCount}
                                    </span>
                                )}
                            </h2>
                        ) : (
                            <div className="name pl-2">
                                <div className="name--sender">
                                    <h3>Jane Cooper</h3>
                                </div>
                                <div className="name--comment">
                                    <span>Product Development @Snapchat</span>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
                <Col className="action col-auto p-0 mr-0 ml-auto">
                    {!addComment && (
                        <Row className="row m-0 p-0">
                            <Col
                                className="btn-collapse col-auto p-0"
                                id="btn-collapse-index"
                            >
                                <Button
                                    variant="link"
                                    onClick={
                                        group
                                            ? handleCloseWindow
                                            : handleHideWindow
                                    }
                                >
                                    <i
                                        className={`fas fa-chevron-down ${
                                            rotateBtn ? "rotate" : ""
                                        }`}
                                    ></i>
                                </Button>
                            </Col>

                            {!group && (
                                <Col
                                    className="btn-close col-auto px-1 p-0 pl-2"
                                    id="btn-close-index"
                                >
                                    <Button
                                        variant="link"
                                        onClick={handleCloseWindow}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    )}

                    {addComment && (
                        <Row className="row m-0 p-0">
                            <Col
                                className="btn-collapse col-auto p-0"
                                id="btn-collapse-index"
                            >
                                <Button variant="link" onClick={handleLike}>
                                    <i className="far fa-heart"></i>
                                </Button>
                            </Col>

                            {showShareBtn && (
                                <Col
                                    className="btn-close col-auto px-1 p-0 pl-2"
                                    id="btn-close-index"
                                >
                                    <Button
                                        variant="link"
                                        onClick={handleAnswer}
                                    >
                                        <i
                                            className={`fal fa-share ${
                                                openMessageArea && "active"
                                            }`}
                                        ></i>
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    )}
                </Col>
            </Row>
            {addComment && (
                <>
                    <div className="question-wrapper--question">{children}</div>
                    <div className="tabs-messages m-0 pt-1 pb-2">
                        {openMessageArea && (
                            <AppСhoseMethodMessage
                                activeTab="Text"
                                className="ptop-messages"
                                rows={2}
                                enterToPost
                                handleMessageSend={answerMessage}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
};
