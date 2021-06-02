import React, { FunctionComponent, useEffect } from "react";
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
                    // eslint-disable-next-line no-console
                    console.log(response);
                }
            }
        );
    };

    useEffect(() => {
        SessionCommentsAPI.getMessages().then((response) => {
            // eslint-disable-next-line no-console
            console.log(response);
        });
    }, []);

    const mockDataMessages = [
        {
            "@id": "/api/session_comments/1",
            "@type": "SessionComment",
            id: 1,
            message: "Your message here...",
            status: "NEW",
            isReplyed: false,
            user: {
                "@id": "/api/users/4",
                "@type": "User",
                id: 4,
                firstName: null,
                lastName: null,
                imageName: null,
            },
            children: [],
            container: "/api/containers/3",
            session: "/api/sessions/1",
        },
        {
            "@id": "/api/session_comments/2",
            "@type": "SessionComment",
            id: 2,
            message: "hello world",
            status: "NEW",
            isReplyed: false,
            user: {
                "@id": "/api/users/4",
                "@type": "User",
                id: 4,
                firstName: null,
                lastName: null,
                imageName: null,
            },
            children: [],
            container: "/api/containers/3",
            session: "/api/sessions/1",
        },
        {
            "@id": "/api/session_comments/3",
            "@type": "SessionComment",
            id: 3,
            message: "asfsfasf👍",
            status: "NEW",
            isReplyed: false,
            user: {
                "@id": "/api/users/1",
                "@type": "User",
                id: 1,
                firstName: null,
                lastName: null,
                imageName: null,
            },
            children: [],
            container: "/api/containers/3",
            session: "/api/sessions/1",
        },
        {
            "@id": "/api/session_comments/4",
            "@type": "SessionComment",
            id: 4,
            message: "afafsf",
            status: "NEW",
            isReplyed: false,
            user: {
                "@id": "/api/users/1",
                "@type": "User",
                id: 1,
                firstName: null,
                lastName: null,
                imageName: null,
            },
            children: [],
            container: "/api/containers/3",
            session: "/api/sessions/1",
        },
    ];

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
                    <AppQAThread data={mockDataMessages} />
                </div>
            </Col>
        </Row>
    );
};
