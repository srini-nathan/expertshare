import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";

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
        <Row className="m-0">
            <Col className="p-0">
                <div className="question-wrapper">
                    {data.length > 0 &&
                        data.map((item: any) => (
                            <>
                                <AppDetailsAction
                                    questionId={item.id}
                                    handleCloseMessages={() => {}}
                                    handleAnswerMessage={(message, qid) => {
                                        sendAnswer(message, qid);
                                    }}
                                    handleDeleteQuestion={(qId) => {
                                        deleteQuestion(qId);
                                    }}
                                    updateMessage={(message, iId) => {
                                        updateMessage(message, iId);
                                    }}
                                    isPTOP
                                    addComment
                                    showShareBtn
                                >
                                    {item.message}
                                    {item.children.length > 0 &&
                                        item.children.map((answer: any) => (
                                            <div className="question-wrapper--child">
                                                {/* List of aswers */}
                                                <AppDetailsAction
                                                    questionId={answer.id}
                                                    handleCloseMessages={() => {}}
                                                    isPTOP
                                                    handleDeleteQuestion={(
                                                        qId
                                                    ) => {
                                                        deleteQuestion(qId);
                                                    }}
                                                    updateMessage={(
                                                        message,
                                                        iId
                                                    ) => {
                                                        updateMessage(
                                                            message,
                                                            iId
                                                        );
                                                    }}
                                                    addComment
                                                />
                                                {answer.message}
                                            </div>
                                        ))}
                                </AppDetailsAction>
                            </>
                        ))}
                </div>
            </Col>
        </Row>
    );
};
