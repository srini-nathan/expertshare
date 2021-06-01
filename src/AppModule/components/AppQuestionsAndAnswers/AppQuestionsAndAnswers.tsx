import React, { FunctionComponent } from "react";
import { Row, Col } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";

import "./assets/scss/style.scss";

export interface QuestionAndAnswersProps {
    name?: string;
}
export const AppQuestionsAndAnswers: FunctionComponent<QuestionAndAnswersProps> = ({
    name,
}) => {
    return (
        <Row className="questions-and-answers-wrapper">
            <Col
                md={{ offset: 8 }}
                className="questions-and-answers-wrapper--column"
            >
                <Row>
                    <Col className="questions-and-answers-wrapper--title">
                        <h4>{name}</h4>
                    </Col>
                </Row>
                <div className="tabs-messages m-0 pt-1 pb-2">
                    <AppСhoseMethodMessage
                        activeTab="Text"
                        className="ptop-messages"
                        rows={2}
                        enterToPost
                    />
                </div>
            </Col>
        </Row>
    );
};
