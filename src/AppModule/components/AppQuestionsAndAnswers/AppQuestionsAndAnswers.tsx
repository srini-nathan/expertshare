import React, { useState, FunctionComponent, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
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

    // eslint-disable-next-line no-console
    console.log(data);

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
                    // eslint-disable-next-line no-console
                    console.log(response);
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

    useEffect(() => {
        getCurrentQestionsAndAnswersThread();
    }, []);

    return (
        <Row className="questions-and-answers-wrapper">
            <Col
                md={{ offset: 8 }}
                className="questions-and-answers-wrapper--column"
            >
                <Row>
                    <Col className="questions-and-answers-wrapper--title">
                        <h4>
                            <i className="far fa-comments-alt"></i> {name}
                        </h4>
                    </Col>
                </Row>
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
                <div className="questions-and-answers-wrapper--thread">
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
        </Row>
    );
};
