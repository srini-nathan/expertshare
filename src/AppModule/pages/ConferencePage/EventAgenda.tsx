import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { isString as _isString } from "lodash";
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
} from "../../hooks";
import {
    errorToast,
    getDate,
    getTomorrowDate,
    successToast,
} from "../../utils";
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
    const [activeDate, setActiveDate] = useState<string>("");
    const [loading, isLoading] = useState<boolean>(true);
    const [loadingSession, isLoadingSession] = useState<boolean>(false);
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
    const [SessionCategories, setSessionCategories] = React.useState<
        SessionCategory[]
    >([]);
    const [sessions, setSessions] = React.useState<any[]>([]);
    const { containerId } = useAuthState();
    SwiperCore.use([Navigation]);
    const navigator = useNavigator(navigate);
    const isGrantedControl = useIsGranted(ROLE_OPERATOR);

    useEffect(() => {
        ConferenceApi.findById<Conference>(id).then(
            ({ response, isNotFound, errorMessage }) => {
                isLoading(false);
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Language not exist");
                } else if (response !== null) {
                    setData(response);

                    const dates = Object.keys(response.sessionDates);
                    if (dates.length > 0)
                        setActiveDate(response.sessionDates[dates[0]]);
                }
            }
        );
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
        SessionApi.getAgenda<Session>({
            "container.id": containerId,
            "conference.id": id,
            "start[after]": `${getDate(activeDate)} 00:00:00`,
            "end[strictly_before]": getTomorrowDate(activeDate),
            "sessionCategory.id": categoryFilter,
        }).then(({ error, response }) => {
            isLoadingSession(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
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
                setSessions(diffCat);
            }
        });
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
                successToast("Successfully cloned");
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
                successToast("Successfully deleted");
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
                successToast("Successfully updated");
                fetchSessions();
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
        /* eslint-disable no-console */
        console.log(cardSize, ids);
        /* eslint-enable no-console */
        SessionApi.changeCardSize<Session, { cardSize: string; ids: number[] }>(
            { cardSize, ids }
        ).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                fetchSessions();
            }
        });
    }

    useEffect(() => {
        if (activeDate !== "") {
            isLoadingSession(true);
            fetchSessions();
        }
    }, [activeDate, categoryFilter]);

    const getSize = (size: string) => {
        switch (size) {
            case "SMALL":
                return "col-3";
            case "MEDIUM":
                return "col-4";
            case "LARGE":
                return "col-6";
            case "XLARGE":
                return "col-12";
            default:
                return "col-3";
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
                                    className={`${getSize(item.cardSize)} p-0`}
                                >
                                    <AppSessionItem
                                        conference={id}
                                        session={item}
                                        handleDelete={handleDeleteSession}
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

    if (loading) return <AppLoader />;
    return (
        <Fragment>
            {data && (
                <AppEventAgendaHeeader
                    handleClone={handleClone}
                    handleDelete={handleDelete}
                    conference={data}
                    isGrantedControl={isGrantedControl}
                />
            )}
            <AppPageHeader title="Event Agenda" />
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
                >
                    {categoryFilter.length === 0 && (
                        <i className="fak fa-check-regular-bold pr-2"></i>
                    )}
                    All
                </AppButton>
                {SessionCategories.map((e) => {
                    return (
                        <AppButton
                            onClick={() => {
                                handleCategoryFilter(e.id);
                            }}
                            variant="secondary"
                            className="ml-1 category-btn"
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
            {loadingSession ? <AppLoader /> : renderSession()}
        </Fragment>
    );
};