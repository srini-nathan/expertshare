import React, { FC, Fragment, useEffect, useState, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { isString as _isString } from "lodash";
import { useTranslation } from "react-i18next";
import { Row } from "react-bootstrap";
import SwiperCore, { Navigation } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    AppButton,
    AppSessionItem,
    AppSessionSlot,
    AppEventAgendaHeeader,
    AppLoader,
    AppSessionDates,
    AppPageHeader,
    AppModal,
} from "../../components";
import "./assets/scss/evenetAgenda.scss";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import {
    Conference,
    SessionCategory,
    Session,
} from "../../../AdminModule/models";
import {
    ConferenceApi,
    SessionCategoryApi,
    SessionApi,
} from "../../../AdminModule/apis";
import {
    useAuthState,
    useParamId,
    useNavigator,
    useIsGranted,
    useEventAgendaHelper,
} from "../../hooks";
import { errorToast, successToast } from "../../utils";
import { CONSTANTS } from "../../../config";

const { Role: ROLE } = CONSTANTS;

const {
    ROLE: { ROLE_OPERATOR },
} = ROLE;

export const EventAgenda: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id } = useParamId();
    const [data, setData] = useState<Conference>();
    const [activeDate, setActiveDate] = useState<{
        start: string;
        end: string;
    }>({
        start: "",
        end: "",
    });
    const [loading, isLoading] = useState<boolean>(true);
    const [loadingSession, isLoadingSession] = useState<boolean>(false);
    const [sessionList, setSessionList] = useState<any[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
    const [SessionCategories, setSessionCategories] = React.useState<
        SessionCategory[]
    >([]);
    const [sessions, setSessions] = React.useState<any[]>([]);
    const { containerId } = useAuthState();
    SwiperCore.use([Navigation]);
    const navigator = useNavigator(navigate);
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);
    const { t } = useTranslation();

    const [showDelete, setDeleteShow] = useState(0);
    const [showClone, setCloneShow] = useState(0);
    const [showDeleteSession, setDeleteShowSession] = useState(0);
    const { selectActiveDate } = useEventAgendaHelper();
    const bottomBoundaryRef = useRef<HTMLDivElement>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [requestOnGoing, setRequestOnGoing] = useState<boolean>(false);

    const fetchEvent = () => {
        ConferenceApi.findById<Conference>(id).then(
            ({ response, isNotFound, errorMessage }) => {
                isLoading(false);
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Event not exist");
                } else if (response !== null) {
                    setData(response);

                    const dates = Object.keys(response.sessionDates);
                    const key = selectActiveDate(dates, "yyyyMMdd");
                    if (dates.length > 0 && key !== null) {
                        setActiveDate(response.sessionDates[key]);
                    }
                }
            }
        );
    };
    useEffect(() => {
        fetchEvent();
    }, []);

    useEffect(() => {
        SessionCategoryApi.find<SessionCategory>(1, {
            "container.id": containerId,
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setSessionCategories(response.items);
            }
        });
    }, []);
    const fetchSessions = () => {
        if (activeDate && page !== 0) {
            setRequestOnGoing(true);
            setLoadingMore(true);
            SessionApi.getAgenda<Session>({
                "container.id": containerId,
                "conference.id": id,
                "start[after]": activeDate?.start,
                "start[strictly_before]": activeDate?.end,
                "sessionCategory.id": categoryFilter,
                page,
            })
                .then(({ error, response }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        }
                    } else if (response !== null) {
                        const diffCat: any[] = [];
                        let currentCat: Session[] = [];
                        // eslint-disable-next-line no-console
                        console.log(response.items.length === 30, "response.i");
                        setHasMore(response.items.length === 30);
                        response.items.forEach((e: Session, i: number) => {
                            if (response.items.length - 1 === i) {
                                currentCat.push(e);
                                diffCat.push(currentCat);
                                currentCat = [];
                            } else if (
                                e.start === response.items[i + 1].start
                            ) {
                                currentCat.push(e);
                            } else {
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
                                        sessionState.prev =
                                            diffCat[i - 1][0].id;
                                }
                                if (i < diffCat.length - 1) {
                                    if (diffCat[i + 1][0])
                                        sessionState.next =
                                            diffCat[i + 1][0].id;
                                }

                                sessionItems.push(sessionState);
                            });
                        });
                        if (page === 1) {
                            setSessions(diffCat);
                            setSessionList(sessionItems);
                        } else {
                            setSessionList([...sessionList, ...sessionItems]);
                            setSessions([...sessions, ...diffCat]);
                        }
                    }
                })
                .finally(() => {
                    isLoadingSession(false);
                    setRequestOnGoing(false);
                    setLoadingMore(false);
                });
        }
    };
    async function handleClone() {
        ConferenceApi.clone<
            Conference,
            {
                cloneId: number;
            }
        >(data?.id as number).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("event.agenda:clone.info.message"));
                navigator("/event").then(() => {});
            }
        });
    }
    async function handleDelete() {
        ConferenceApi.deleteById(data?.id as number).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("event.agenda:delete.info.message"));
                navigator("/event").then(() => {});
            }
        });
    }

    async function handleDeleteSession(sessionId: number) {
        SessionApi.deleteById(sessionId).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("event.agenda:update.info.message"));
                fetchEvent();
                setPage(1);
            }
        });
    }

    async function handleCategoryFilter(categoryId: number) {
        const index = categoryFilter.indexOf(categoryId);
        if (index !== -1) {
            setCategoryFilter([
                ...categoryFilter.splice(0, index),
                ...categoryFilter.splice(index + 1),
            ]);
        } else {
            setCategoryFilter([...categoryFilter, categoryId]);
        }
    }
    async function handleChangeSize(cardSize: string, ids: number[]) {
        SessionApi.changeCardSize<Session, { cardSize: string; ids: number[] }>(
            { cardSize, ids }
        ).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("event.agenda:sizeChange.info.message"));
                setPage(1);
            }
        });
    }

    useEffect(() => {
        if (activeDate && activeDate.start !== "") {
            isLoadingSession(true);
            setLoadingMore(false);
            setRequestOnGoing(false);
            setHasMore(true);
            setPage(1);
        }
    }, [activeDate, categoryFilter]);

    const getSize = (size: string) => {
        switch (size) {
            case "SMALL":
                return "col-lg-3 col-md-6 col-sm-12 ";
            case "MEDIUM":
                return "col-lg-4 col-md-6 col-sm-12";
            case "LARGE":
                return "col-lg-6 col-md-12 col-sm-12";
            case "XLARGE":
                return "col-lg-12 col-md-12 col-sm-12";
            default:
                return "col-lg-4 col-md-6 col-sm-12";
        }
    };

    const renderSession = () => {
        return sessions.map((e, i) => {
            const butonName = `key_${i}`;
            return (
                <AppSessionSlot
                    isGrantedControl={isGrantedControl}
                    key={i}
                    buttonName={butonName}
                    handleChangeCard={handleChangeSize}
                    sessions={e}
                    conferenceId={id}
                >
                    <Swiper
                        id={`${i}`}
                        slidesPerView={"auto"}
                        observer={true}
                        observeParents={true}
                        watchSlidesProgress={true}
                        watchSlidesVisibility={true}
                        navigation={{
                            prevEl: `.${butonName}_left`,
                            nextEl: `.${butonName}_right`,
                        }}
                    >
                        {e.map((item: Session) => {
                            return (
                                <SwiperSlide
                                    className={`${getSize(
                                        item.cardSize
                                    )} p-0 mx-3`}
                                >
                                    <AppSessionItem
                                        conference={id}
                                        sessionList={sessionList}
                                        session={item}
                                        handleDelete={setDeleteShowSession}
                                        isGrantedControl={isGrantedControl}
                                    />
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </AppSessionSlot>
            );
        });
    };

    const isBottom = (el: HTMLDivElement) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    };

    const trackScrolling = () => {
        if (bottomBoundaryRef.current) {
            if (isBottom(bottomBoundaryRef.current)) {
                // eslint-disable-next-line no-console
                console.log(hasMore, !requestOnGoing, "isBottom");
                if (hasMore && !requestOnGoing) {
                    // eslint-disable-next-line no-console
                    console.log(page + 1, "hasMore");
                    setPage(page + 1);
                }
            }
        }
    };

    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log("page changed", page);
        fetchSessions();
    }, [page]);

    useEffect(() => {
        document.addEventListener("scroll", trackScrolling);
        return () => {
            document.removeEventListener("scroll", trackScrolling);
        };
    }, []);

    if (loading) return <AppLoader />;
    return (
        <Fragment>
            <AppModal
                show={showDelete > 0}
                title={t("event.list:delete.confirm.title")}
                handleClose={() => {
                    setDeleteShow(0);
                }}
                handleDelete={() => {
                    setDeleteShow(0);
                    handleDelete().then();
                }}
                bodyContent={t("event.list:delete.confirm.message")}
            />
            <AppModal
                show={showClone > 0}
                title={t("event.list:clone.confirm.title")}
                handleClose={() => {
                    setCloneShow(0);
                }}
                handleDelete={() => {
                    setCloneShow(0);
                    handleClone().then();
                }}
                bodyContent={t("event.list:clone.confirm.message")}
            />
            <AppModal
                show={showDeleteSession > 0}
                title={t("event.agenda:session.delete.confirm.title")}
                handleClose={() => {
                    setDeleteShowSession(0);
                }}
                handleDelete={() => {
                    setDeleteShowSession(0);
                    handleDeleteSession(showDeleteSession).then();
                }}
                bodyContent={t("event.agenda:session.delete.confirm.message")}
            />
            {data && (
                <AppEventAgendaHeeader
                    handleClone={() => {
                        setCloneShow(1);
                    }}
                    handleDelete={() => {
                        setDeleteShow(1);
                    }}
                    conference={data}
                    isGrantedControl={isGrantedControl}
                />
            )}
            <AppPageHeader title={t("event.agenda:header.title")} />
            {data?.sessionDates && (
                <AppSessionDates
                    activeDate={activeDate}
                    setActiveDate={setActiveDate}
                    sessionDates={data?.sessionDates}
                />
            )}

            <Row className="m-0">
                <AppButton
                    onClick={() => {
                        setCategoryFilter([]);
                    }}
                    variant="secondary"
                    className="mr-2 mb-2"
                >
                    {categoryFilter.length === 0 && (
                        <i className="fak fa-check-regular-bold pr-2"></i>
                    )}
                    {t("event.agenda:label.all")}
                </AppButton>
                {SessionCategories.map((e) => {
                    return (
                        <AppButton
                            onClick={() => {
                                handleCategoryFilter(e.id);
                            }}
                            variant="secondary"
                            className="mr-2 mb-2 category-btn"
                        >
                            <span
                                style={{
                                    backgroundColor: `${e.color}  `,
                                    color: `${e.textColor}  `,
                                }}
                            >
                                {categoryFilter.indexOf(e.id) !== -1 && (
                                    <i className="fak fa-check-regular-bold pr-2"></i>
                                )}

                                {e.name}
                            </span>
                        </AppButton>
                    );
                })}
            </Row>
            {loadingSession ? (
                <AppLoader />
            ) : (
                <>
                    {renderSession()}
                    {loadingMore ? (
                        <p
                            style={{
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            Loading...
                        </p>
                    ) : null}
                    <div
                        id="page-bottom-boundary"
                        ref={bottomBoundaryRef}
                        style={{ height: "10px" }}
                    ></div>
                </>
            )}
        </Fragment>
    );
};
