import React, { useState, FunctionComponent, useEffect } from "react";
import { Col } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import { AppQAThread } from "../AppQAThread";
import { errorToast } from "../../utils";
import { SessionCommentsAPI } from "../../apis";

import { useAuthState, useSessionSocketEvents } from "../../hooks";
import { socket, EVENTS } from "../../socket";

import "./assets/scss/style.scss";

const { ON_NEW_SESSION_QA, ON_DELETE_SESSION_QA, ON_EDIT_SESSION_QA } = EVENTS;

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
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [, setTotalItems] = useState<number>(1);
    const {
        emitPostNewSessionQa,
        emitJoinSessionQa,
        emitLeaveSessionQa,
        emitDeleteSessionQa,
        emitEditSessionQa,
    } = useSessionSocketEvents();
    const { user } = useAuthState();

    useEffect(() => {
        if (session) emitJoinSessionQa(session);

        return () => {
            emitLeaveSessionQa(session);
        };
    }, [session]);

    useEffect(() => {
        socket.on(
            ON_NEW_SESSION_QA,
            (sessionId: number, u: any, parent: any, payload: any) => {
                if (sessionId === session && u) {
                    if (parent) {
                        const p = data.find((e: any) => e.id === parent);
                        const index = data.indexOf(p);
                        if (index !== -1) {
                            setData([
                                ...data.splice(0, index - 1),
                                {
                                    ...data[index],
                                    children: [
                                        {
                                            ...payload,
                                        },
                                        ...data[index].children,
                                    ],
                                },
                                ...data.splice(index + 1),
                            ]);
                        }
                    } else {
                        setData([
                            {
                                ...payload,
                            },
                            ...data,
                        ]);
                    }
                }
            }
        );

        socket.on(ON_DELETE_SESSION_QA, (qaId: number) => {
            if (qaId) {
                const p = data.find((e: any) => e.id === qaId);
                if (p) {
                    const newData = data.filter((e) => e.id !== p.id);
                    setData(newData);
                }
            }
        });

        socket.on(
            ON_EDIT_SESSION_QA,
            (sessionId: number, u: any, parent: any, payload: any) => {
                if (sessionId === session && u) {
                    const newData = data.map((e) => {
                        if (e.id === payload.id) {
                            return payload;
                        }
                        const checkChildren = e;
                        checkChildren.children = e.children.map((c: any) => {
                            if (c.id === payload.id) {
                                return payload;
                            }
                            return c;
                        });
                        return checkChildren;
                    });
                    setData(newData);
                }
            }
        );
    }, [data]);

    const getCurrentQestionsAndAnswersThread = (pageNo = 1) => {
        SessionCommentsAPI.getMessages(session, container, pageNo).then(
            (response) => {
                if (response) {
                    if (pageNo === 1) {
                        setPage(1);
                        setData(response["hydra:member"]);
                    } else {
                        const newData = data;
                        response["hydra:member"].forEach((e: any) => {
                            const item = data.find((d: any) => d.id === e.id);
                            if (!item) {
                                newData.push(e);
                            }
                        });

                        setData(newData);
                    }
                    setTotalItems(response["hydra:totalItems"] as number);
                }
            }
        );
    };
    useEffect(() => {
        getCurrentQestionsAndAnswersThread(page);
    }, [page]);
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
                    emitPostNewSessionQa(session, user, response, null);
                    getCurrentQestionsAndAnswersThread(1);
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
                    emitPostNewSessionQa(
                        session,
                        user,
                        {
                            ...response,
                            parent: `${aId}`,
                        },
                        aId
                    );

                    getCurrentQestionsAndAnswersThread(1);
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
                    emitEditSessionQa(session, user, response, null);
                    getCurrentQestionsAndAnswersThread(1);
                }
            }
        );
    };

    const deleteQuestion = (qId: number) => {
        SessionCommentsAPI.deleteById(qId).then(() => {
            emitDeleteSessionQa(session, qId);
            getCurrentQestionsAndAnswersThread(1);
        });
    };

    const updateMessage = (message: string, qId: number) => {
        patchMessage(message, qId);
    };

    const handleScroll = (e: any) => {
        const { scrollTop, offsetHeight, scrollHeight } = e.target;
        const height = scrollHeight - offsetHeight;
        if (scrollTop === height) {
            setPage(page + 1);
        }
    };

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
