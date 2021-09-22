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
    AppSessionExtraLink,
    AppSponsors,
} from "../../components";
import { Session, User, PSession } from "../../../AdminModule/models";
import { LiveVoteQuestionApi, SessionApi } from "../../../AdminModule/apis";
import { errorToast, getDateWT, getTomorrowDate } from "../../utils";
import {
    useAuthState,
    useBuildAssetPath,
    useSessionSocketEvents,
} from "../../hooks";
import "./assets/scss/style.scss";
import { socket, EVENTS } from "../../socket";
import {
    AppAskSpeaker,
    AppLiveVote,
    AppSessionDetailOperatorPanel,
} from "../../containers";
import { LiveVoteQuestion } from "../../../AdminModule/models/entities/LiveVoteQuestion";
import { SessionCommentsAPI } from "../../apis";
import { ExhibitorLogoPosterFileInfo } from "../../../config";

const { ON_NEXT_SESSION, ON_LIVE_VOTE_REFRESH } = EVENTS;

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
        emitLeaveSession,
        emitJoinSession,
    } = useSessionSocketEvents();
    const getOtherSessions = (sessionId: number) => {
        const currentSess = sessionList.find((e: any) => e.id === sessionId);
        if (currentSess) {
            setNext(currentSess.next);
            setPrev(currentSess.prev);
        }
    };
    const [checkingLiveVote, setCheckingLiveVote] = useState<boolean>(false);
    const [vote, setVote] = useState<LiveVoteQuestion>();
    const exhibitorLogoBasePath = useBuildAssetPath(
        ExhibitorLogoPosterFileInfo
    );

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
            }).then(() => {});
        } else if (location) {
            navigate(`/reload`, {
                state: {
                    url: location.pathname,
                },
            }).then(() => {});
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

    useEffect(() => {
        if (id) {
            emitJoinSession(id);
        }
        return () => {
            if (id) {
                emitLeaveSession(id);
            }
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

    const fetchLiveVote = (setLoading = false) => {
        LiveVoteQuestionApi.getActiveQuestions<LiveVoteQuestion>(1, {
            "session.id": id,
        })
            .then(({ response }) => {
                if (response !== null) {
                    if (response.items && response.items[0]) {
                        setVote(response.items[0]);
                    } else {
                        setVote(undefined);
                    }
                }
            })
            .finally(() => {
                if (setLoading) {
                    setCheckingLiveVote(false);
                }
            });
    };

    useEffect(() => {
        if (id) {
            setCheckingLiveVote(true);
            fetchLiveVote(true);
        }
    }, [id, data]);

    useEffect(() => {
        socket.on(ON_LIVE_VOTE_REFRESH, () => {
            fetchLiveVote(false);
        });
        return () => {
            socket.off(ON_LIVE_VOTE_REFRESH);
        };
    }, []);

    if (loading || checkingLiveVote) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <Row className="m-0">
                <Col
                    className={
                        data.isCommentEnable || vote
                            ? "pl-0 pr-0 pr-lg-3 pr-xl-2 comment-enable"
                            : "px-0"
                    }
                    md={12}
                    sm={12}
                    lg={data.isCommentEnable || vote ? 8 : 12}
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
                        <AppSessionExtraLink session={data} />
                        <Row className="my-4 mx-0 px-2">
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
                    {data.exhibitors.length > 0 ? (
                        <AppCard className="session-det-sponsors px-4 py-3">
                            <h3 className="mb-3 mt-2">
                                <i className="fak fa-handshake-alt-light mr-1"></i>
                                {t("sessionDetails:label.sponsors")}
                            </h3>
                            <AppSponsors
                                data={(data.exhibitors as unknown) as string[]}
                                basePath={exhibitorLogoBasePath}
                                containerId={containerId}
                            />
                        </AppCard>
                    ) : null}
                    <AppSessionDetailOperatorPanel
                        conferenceId={conferenceId}
                        currentSessionId={id}
                        nextSessionId={next}
                        onClickSwitchNextSession={() => {
                            emitSwitchSessionNext(id);
                            switchTonextSession(next as number);
                        }}
                    />

                    {/* <AppSessionDetails session={data} /> */}
                    <AppSessionDescription session={data} />
                </Col>
                {(data.isCommentEnable || vote) && (
                    <Col md={12} sm={12} lg={4} className="pr-0 pl-0 pl-lg-3">
                        <AppLiveVote enable={true} data={vote} sessionId={id} />
                        <AppAskSpeaker enable={true} sessionId={id} />
                        {data.isCommentEnable ? (
                            <AppQuestionsAndAnswers
                                name={t(
                                    "sessionDetails:section.questionAndAnswers"
                                )}
                                parentId={id}
                                socketParentId={`session_${id}`}
                                container={containerId}
                                commentsAPI={SessionCommentsAPI}
                                mainElement="api/sessions"
                                parentElement="/api/session_comments"
                            />
                        ) : null}
                    </Col>
                )}
            </Row>
        </Fragment>
    );
};
