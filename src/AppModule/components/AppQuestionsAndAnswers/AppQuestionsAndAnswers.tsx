import React, { useState, FunctionComponent, useEffect } from "react";
import { Col } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import { AppQAThread } from "../AppQAThread";
import { errorToast } from "../../utils";
import { SessionCommentsAPI } from "../../apis";

import "./assets/scss/style.scss";

export interface QuestionAndAnswersProps {
    name?: string;
    conferenceNumber: number;
    session: number;
    container: number;
}
export const AppQuestionsAndAnswers: FunctionComponent<QuestionAndAnswersProps> = ({
    name,
    container,
    session,
}) => {
    const [data, setData] = useState<[]>([]);

    const getCurrentQestionsAndAnswersThread = () => {
        SessionCommentsAPI.getMessages(session, container).then((response) => {
            if (response) {
                setData(response["hydra:member"].reverse());
            }
        });
    };

    const newMessageSend = (message: string) => {
        const meesageObj = {
            message: `${message}`,
            status: "NEW",
            isReplyed: true,
            container: `api/containers/${container}`,
            session: `api/sessions/${session}`,
        };

        const messageToPost = JSON.stringify(meesageObj);

        SessionCommentsAPI.postComment<any, any>(messageToPost).then(
            ({ errorMessage, response }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                }
                if (response) {
                    getCurrentQestionsAndAnswersThread();
                }
            }
        );
    };

    const sendAnswerMessage = (message: string, aId: number) => {
        const meesageObj = {
            message: `${message}`,
            status: "NEW",
            parent: `/api/session_comments/${aId}`,
            isReplyed: true,
            container: `api/containers/${container}`,
            session: `api/sessions/${session}`,
        };

        const messageToPost = JSON.stringify(meesageObj);

        SessionCommentsAPI.postComment<any, any>(messageToPost).then(
            ({ errorMessage, response }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                }
                if (response) {
                    getCurrentQestionsAndAnswersThread();
                }
            }
        );
    };

    const patchMessage = (message: string, id: number) => {
        const meesageObj = {
            message: `${message}`,
            status: "NEW",
            isReplyed: true,
            container: `api/containers/${container}`,
            session: `api/sessions/${session}`,
        };

        const messageToPost = JSON.stringify(meesageObj);

        SessionCommentsAPI.update<any, any>(id, messageToPost).then(
            ({ errorMessage, response }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                }
                if (response) {
                    getCurrentQestionsAndAnswersThread();
                }
            }
        );
    };

    const deleteQuestion = (qId: number) => {
        SessionCommentsAPI.deleteById(qId).then(() => {
            getCurrentQestionsAndAnswersThread();
        });
    };

    const updateMessage = (message: string, qId: number) => {
        patchMessage(message, qId);
    };

    const handleScroll = () => {
        const { scrollY } = window;
        /* eslint-disable no-console */
        console.log(scrollY);
    };

    useEffect(() => {
        getCurrentQestionsAndAnswersThread();
    }, []);

    return (
        <Col className="session-details-question py-3 card">
            <Col className="session-details-question--text-box pb-3 px-0 mb-3">
                <h2>
                    <i className="fak fa-faq"></i>
                    {name}
                </h2>
                <div className="tabs-messages m-0 pt-1 pb-2">
                    <AppСhoseMethodMessage
                        activeTab="Text"
                        className="ptop-messages"
                        rows={2}
                        enterToPost
                        handleMessageSend={(message) => {
                            newMessageSend(message);
                        }}
                    />
                </div>
                <div
                    className="session-details-question--container"
                    onScroll={handleScroll}
                >
                    <AppQAThread
                        data={data}
                        deleteQuestion={(qId) => {
                            deleteQuestion(qId);
                        }}
                        updateMessage={updateMessage}
                        sendAnswer={(message, aId) => {
                            sendAnswerMessage(message, aId);
                        }}
                    />
                </div>
            </Col>
        </Col>
    );
};
