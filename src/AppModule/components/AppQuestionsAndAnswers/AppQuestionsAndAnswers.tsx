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
            if (response["hydra:member"].length > 0) {
                setData(response["hydra:member"].reverse());
            }
        });
    };

    const newMessageSend = (message: string) => {
        const meesageObj = {
            message: `${message}`,
            status: "NEW",
            isReplyed: false,
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
                    <AppQAThread data={data} />
                </div>
            </Col>
        </Row>
    );
};
