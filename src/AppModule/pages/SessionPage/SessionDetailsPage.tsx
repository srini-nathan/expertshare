import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams, navigate } from "@reach/router";
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
    AppButton,
} from "../../components";
import { Session, User, PSession } from "../../../AdminModule/models";
import { SessionApi } from "../../../AdminModule/apis";
import { errorToast, getDateWT, getTomorrowDate } from "../../utils";
import {
    useAuthState,
    useIsGranted,
    useSessionSocketEvents,
} from "../../hooks";
import "./assets/scss/style.scss";
import { socket, EVENTS } from "../../socket";
import { CONSTANTS } from "../../../config";
import { AppLiveVote } from "../../containers";

const { ON_NEXT_SESSION } = EVENTS;
const { Role } = CONSTANTS;

const {
    ROLE: { ROLE_OPERATOR },
} = Role;

export const SessionDetailsPage: FC<RouteComponentProps> = ({
    location,
}): JSX.Element => {
    const { state } = location as any;
    let sessionList: any = [];
    if (state) sessionList = (state as any).sessionList;
    const { t } = useTranslation();
    const { id, conferenceId } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const [next, setNext] = useState<number | null>(null);
    const [prev, setPrev] = useState<number | null>(null);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<Session>(new Session(containerResourceId));
    const {
        emitSwitchSessionNext,
        emitJoinNextSession,
        emitLeaveNextSession,
    } = useSessionSocketEvents();
    const getOtherSessions = (sessionId: number) => {
        const currentSess = sessionList.find((e: any) => e.id === sessionId);
        if (currentSess) {
            setNext(currentSess.next);
            setPrev(currentSess.prev);
        }
    };
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);
    const [widgetBar] = useState<boolean>(true);

    useEffect(() => {
        isLoading(true);
        SessionApi.getSession<Session[]>({
            id,
        }).then(({ response, isNotFound, errorMessage }) => {
            if (errorMessage) {
                errorToast(errorMessage);
            } else if (isNotFound) {
                errorToast("Session not exist");
            } else if (response !== null) {
                if (response.items[0]) {
                    const res: Session = (response.items as PSession[])[0] as Session;

                    if (sessionList) {
                        getOtherSessions(res.id);
                    }

                    setData(res);
                }
            }
            isLoading(false);
        });
    }, [id]);

    const switchTonextSession = (nextSession: number) => {
        if (nextSession) {
            navigate(`/event/${conferenceId}/session/${nextSession}`, {
                state: { sessionList },
            });
        } else if (location) {
            navigate(`/reload`, {
                state: {
                    url: location.pathname,
                },
            });
        }
    };

    socket.once(ON_NEXT_SESSION, (sessionId: string) => {
        if (parseInt(sessionId, 10) === data.id && next)
            switchTonextSession(next as number);
    });
    useEffect(() => {
        if (id) emitJoinNextSession(id);
        return () => {
            emitLeaveNextSession(id);
        };
    }, [id]);

    const getAgenda = (isLive = false) => {
        let params: { [key: string]: any } = {};

        if (isLive) {
            params = {
                "container.id": containerId,
                "conference.id": conferenceId,
            };
        } else {
            params = {
                "container.id": containerId,
                "conference.id": conferenceId,
                "start[after]": `${getDateWT(data.start)} 00:00:00`,
                "start[strictly_before]": getTomorrowDate(
                    getDateWT(data.start)
                ),
            };
        }

        SessionApi.getAgenda<Session>({
            ...params,
        }).then(({ response }) => {
            if (response !== null) {
                if (isLive) {
                    let foundLive = false;
                    response.items.forEach((e: Session) => {
                        if (e.isLive) {
                            switchTonextSession(e.id);
                            foundLive = true;
                        }
                    });
                    if (!foundLive) {
                        errorToast(t("sessionDetails:message.noLiveSession"));
                    }
                } else {
                    const diffCat: any[] = [];
                    let currentCat: Session[] = [];
                    response.items.forEach((e: Session, i: number) => {
                        if (response.items.length - 1 === i) {
                            currentCat.push(e);
                            diffCat.push(currentCat);
                            currentCat = [];
                        } else if (e.start === response.items[i + 1].start)
                            currentCat.push(e);
                        else {
                            currentCat.push(e);
                            diffCat.push(currentCat);
                            currentCat = [];
                        }
                    });

                    const sessionItems: any[] = [];
                    diffCat.forEach((e, i) => {
                        e.forEach((k: any) => {
                            const sessionState = {
                                id: k.id,
                                prev: null,
                                next: null,
                            };
                            if (i !== 0) {
                                if (diffCat[i - 1][0])
                                    sessionState.prev = diffCat[i - 1][0].id;
                            }
                            if (i < diffCat.length - 1) {
                                if (diffCat[i + 1][0])
                                    sessionState.next = diffCat[i + 1][0].id;
                            }

                            sessionItems.push(sessionState);
                        });
                    });
                    sessionList = sessionItems;
                    getOtherSessions(data.id);
                }
            }
        });
    };

    useEffect(() => {
        if (data.start && (!sessionList || sessionList.length === 0)) {
            getAgenda();
        }
    }, [loading]);

    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <Row className="m-0">
                <Col
                    className={widgetBar ? "pl-0 comment-enable" : "px-0"}
                    md={12}
                    sm={12}
                    lg={widgetBar ? 8 : 12}
                >
                    <AppCard className="p-0">
                        <AppSessionHeader
                            next={next}
                            prev={prev}
                            session={data}
                            conferenceId={conferenceId}
                            sessionList={sessionList}
                            getAgenda={() => {
                                getAgenda(true);
                            }}
                        />
                        <AppSessionTags session={data} />

                        <Row className="my-5 mx-0 px-2">
                            {data.speakers.length > 0 ? (
                                <Col
                                    lg={data.moderators.length > 0 ? 8 : 12}
                                    md={12}
                                    className={`create-session--speakers ${
                                        data.moderators.length > 0
                                            ? "divider-right"
                                            : ""
                                    } `}
                                >
                                    <AppSessionUsers
                                        xl={6}
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        selectedUsers={data.speakers as User[]}
                                        title={t(
                                            "sessionDetails:label.speakers"
                                        )}
                                        icon="speakers"
                                    />
                                </Col>
                            ) : null}
                            {data.moderators.length > 0 ? (
                                <Col
                                    md={12}
                                    lg={data.speakers.length > 0 ? 4 : 12}
                                    className="create-session--speakers"
                                >
                                    <AppSessionUsers
                                        xl={12}
                                        md={12}
                                        lg={12}
                                        sm={12}
                                        selectedUsers={
                                            data.moderators as User[]
                                        }
                                        title={t(
                                            "sessionDetails:label.moderators"
                                        )}
                                        icon="moderators"
                                    />
                                </Col>
                            ) : null}
                        </Row>
                    </AppCard>

                    {isGrantedControl && next && (
                        <AppCard
                            title={t("sessionDetails:section.operatorActions")}
                        >
                            <Row className="my-5 mx-0 px-2">
                                <Col className="p-0" sm={12} md={6} lg={3}>
                                    {next && (
                                        <AppButton
                                            onClick={() => {
                                                emitSwitchSessionNext(id);
                                                switchTonextSession(
                                                    next as number
                                                );
                                            }}
                                            variant="secondary"
                                        >
                                            {t(
                                                "sessionDetails:label.switchToNextSession"
                                            )}
                                        </AppButton>
                                    )}
                                </Col>
                            </Row>
                        </AppCard>
                    )}

                    {/* <AppSessionDetails session={data} /> */}
                    <AppSessionDescription session={data} />
                </Col>
                {widgetBar && (
                    <Col md={12} sm={12} lg={4} className="pr-0">
                        <AppLiveVote loading={false} />
                        {data.isCommentEnable ? (
                            <AppQuestionsAndAnswers
                                name={t(
                                    "sessionDetails:section.questionAndAnswers"
                                )}
                                conferenceNumber={conferenceId}
                                session={id}
                                container={containerId}
                            />
                        ) : null}
                    </Col>
                )}
            </Row>
        </Fragment>
    );
};
