import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import {
    AppLoader,
    AppCard,
    AppSessionHeader,
    // AppSessionDetails,
    AppSessionDescription,
    AppSessionUsers,
    AppQuestionsAndAnswers,
    AppSessionTags,
} from "../../components";
import { Session, User, PSession } from "../../../AdminModule/models";
import { SessionApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";
import { useAuthState } from "../../hooks";
import "./assets/scss/style.scss";

export const SessionDetailsPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { id, confereneceId } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<Session>(new Session(containerResourceId));

    useEffect(() => {
        SessionApi.getSession<Session[]>({
            id,
        }).then(({ response, isNotFound, errorMessage }) => {
            isLoading(false);
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast("Session not exist");
            } else if (response !== null) {
                if (response.items[0]) {
                    const res: Session = (response.items as PSession[])[0] as Session;
                    setData(res);
                }
            }
        });
    }, [id]);

    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <Row className="m-0">
                <Col
                    className={
                        data.isCommentEnable ? "pl-0 comment-enable" : "px-0"
                    }
                    md={12}
                    sm={12}
                    lg={data.isCommentEnable ? 8 : 12}
                >
                    <AppCard className="p-0">
                        <AppSessionHeader session={data} />
                        <AppSessionTags session={data} />

                        <Row className="my-5 mx-0 px-2">
                            <Col
                                md={12}
                                lg={8}
                                className="create-session--speakers divider-right"
                            >
                                <AppSessionUsers
                                    xl={6}
                                    lg={6}
                                    md={12}
                                    sm={12}
                                    selectedUsers={data.speakers as User[]}
                                    title={t("sessionDetails:label.speakers")}
                                    icon="speakers"
                                />
                            </Col>
                            <Col
                                md={12}
                                lg={4}
                                className="create-session--speakers"
                            >
                                <AppSessionUsers
                                    xl={12}
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    selectedUsers={data.moderators as User[]}
                                    title={t("sessionDetails:label.moderators")}
                                    icon="moderators"
                                />
                            </Col>
                        </Row>
                    </AppCard>
                    {/* <AppSessionDetails session={data} /> */}
                    <AppSessionDescription session={data} />
                </Col>
                {data.isCommentEnable && (
                    <Col md={12} sm={12} lg={4} className="pr-0">
                        <AppQuestionsAndAnswers
                            name={t(
                                "sessionDetails:section.questionAndAnswers"
                            )}
                            conferenceNumber={confereneceId}
                            session={id}
                            container={containerId}
                        />
                    </Col>
                )}
            </Row>
        </Fragment>
    );
};
