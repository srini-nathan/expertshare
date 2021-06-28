import React, { FC } from "react";

import { AppDetailsAction } from "../AppDetailsAction";

import "./assets/scss/style.scss";

export interface QAThreadProps {
    data: any;
    deleteQuestion: (qId: number) => void;
    sendAnswer: (message: string, aId: number) => void;
    updateMessage: (message: string, qId: number) => void;
}

export const AppQAThread: FC<QAThreadProps> = ({
    data,
    deleteQuestion,
    sendAnswer,
    updateMessage,
}): JSX.Element => {
    return (
        <>
            {data.length > 0 &&
                data.map((item: any, index: number) => (
                    <>
                        <AppDetailsAction
                            key={index}
                            questionId={item.id}
                            userObj={item.user}
                            handleAnswerMessage={(message, qid) => {
                                sendAnswer(message, qid);
                            }}
                            handleDeleteQuestion={(qId) => {
                                deleteQuestion(qId);
                            }}
                            updateMessage={(message, iId) => {
                                updateMessage(message, iId);
                            }}
                            addComment
                            showShareBtn
                            commentMessage={item.message}
                            createdAt={item.createdAt}
                        >
                            <p className="base-text pb-3">{item.message}</p>
                            {item.children &&
                                item.children.length > 0 &&
                                item.children.map((answer: any, i: number) => (
                                    <AppDetailsAction
                                        key={i}
                                        questionId={answer.id}
                                        userObj={answer.user}
                                        isChild
                                        handleDeleteQuestion={(qId) => {
                                            deleteQuestion(qId);
                                        }}
                                        updateMessage={(message, iId) => {
                                            updateMessage(message, iId);
                                        }}
                                        commentMessage={answer.message}
                                        addComment
                                        createdAt={answer.createdAt}
                                    >
                                        <p className="base-text pb-3">
                                            {answer.message}
                                        </p>
                                    </AppDetailsAction>
                                ))}
                        </AppDetailsAction>
                    </>
                ))}
        </>
    );
};
