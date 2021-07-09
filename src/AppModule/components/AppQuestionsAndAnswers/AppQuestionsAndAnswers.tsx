import React, { useState, FunctionComponent, useEffect } from "react";
import { Col } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import { AppQAThread } from "../AppQAThread";
import { errorToast } from "../../utils";
import { SessionCommentsAPI } from "../../apis";

import {
    useAuthState,
    useIsGranted,
    useSessionSocketEvents,
} from "../../hooks";
import { socket, EVENTS } from "../../socket";

import "./assets/scss/style.scss";

const { ON_NEW_SESSION_QA, ON_DELETE_SESSION_QA, ON_EDIT_SESSION_QA } = EVENTS;

export interface QuestionAndAnswersProps {
    name?: string;
    conferenceNumber: number;
    session: number;
    container: number;
}

function createCore() {
    let stateContainer: any[] = [];

    const addNewQa = (newState: any, setter: any) => {
        stateContainer = [newState, ...stateContainer];
        setter(stateContainer);
    };

    const createState = (newState: any, setter: any) => {
        stateContainer = newState;
        setter(stateContainer);
    };

    const addNewChildQa = (newState: any, setter: any, index: number) => {
        stateContainer = [
            ...stateContainer.splice(0, index - 1),
            {
                ...stateContainer[index],
                children: [
                    ...stateContainer[index].children,
                    {
                        ...newState,
                    },
                ],
            },
            ...stateContainer.splice(index + 1),
        ];
        setter(stateContainer);
    };

    const deleteQa = (id: any, setter: any) => {
        stateContainer = stateContainer.filter((e) => e.id !== id);
        setter(stateContainer);
    };

    const editQa = (newState: any, setter: any) => {
        stateContainer = stateContainer.map((e) => {
            if (e.id === newState.id) {
                return newState;
            }
            const checkChildren = e;
            checkChildren.children = e.children.map((c: any) => {
                if (c.id === newState.id) {
                    return newState;
                }
                return c;
            });
            return checkChildren;
        });
        setter(stateContainer);
    };

    return {
        getState: () => stateContainer,
        addNewQa,
        addNewChildQa,
        createState,
        deleteQa,
        editQa,
    };
}
const core = createCore();
export const AppQuestionsAndAnswers: FunctionComponent<QuestionAndAnswersProps> = ({
    name,
    container,
    session,
}) => {
    const [data, setData] = useState<any[]>(core.getState());
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
    const isGranted = useIsGranted("ROLE_USER");

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
                        const p = core
                            .getState()
                            .find((e: any) => e.id === parent);
                        const index = core.getState().indexOf(p);

                        if (index !== -1) {
                            core.addNewChildQa(payload, setData, index);
                        }
                    } else {
                        core.addNewQa(payload, setData);
                    }
                }
            }
        );

        socket.on(ON_DELETE_SESSION_QA, (qaId: number) => {
            if (qaId) {
                const p = core.getState().find((e: any) => e.id === qaId);
                if (p) {
                    core.deleteQa(qaId, setData);
                }
            }
        });

        socket.on(
            ON_EDIT_SESSION_QA,
            (sessionId: number, u: any, parent: any, payload: any) => {
                if (sessionId === session && u) {
                    core.editQa(payload, setData);
                }
            }
        );
    }, []);

    const getCurrentQestionsAndAnswersThread = (pageNo = 1) => {
        SessionCommentsAPI.getMessages(session, container, pageNo).then(
            (response) => {
                if (response) {
                    if (pageNo === 1) {
                        setPage(1);
                        core.createState(response["hydra:member"], setData);
                    } else {
                        const newData = data;
                        response["hydra:member"].forEach((e: any) => {
                            const item = data.find((d: any) => d.id === e.id);
                            if (!item) {
                                newData.push(e);
                            }
                        });
                        core.createState(newData, setData);
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
                {isGranted ? (
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
                ) : null}
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
