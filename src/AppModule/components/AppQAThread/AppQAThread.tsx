import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";

import { AppDetailsAction } from "../AppDetailsAction";

import "./assets/scss/style.scss";

export interface QAThreadProps {
    data: any;
}

export const AppQAThread: FC<QAThreadProps> = ({ data }): JSX.Element => {
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
                                    handleAnswerMessage={() => {
                                        // eslint-disable-next-line no-console
                                        // console.log(message, qid);
                                    }}
                                    isPTOP
                                    addComment
                                    showShareBtn
                                >
                                    {item.message}
                                </AppDetailsAction>
                            </>
                        ))}

                    <div className="question-wrapper--child">
                        {/* List of aswers */}
                        {/* <AppDetailsAction
                                handleCloseMessages={() => {}}
                                isPTOP
                                addComment
                            />
                            lorem ipsum lorem ipsumlorem ipsumlorem ipsum lorem
                            ipsum */}
                    </div>
                </div>
            </Col>
        </Row>
    );
};
