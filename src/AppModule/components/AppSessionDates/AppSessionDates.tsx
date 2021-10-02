import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "./assets/scss/style.scss";
import { useGlobalData } from "../../contexts";
import { humanReadableDate, getDateOnly } from "../../utils";

export interface AppSessionDatesProps {
    sessionDates: { [key: string]: { start: string; end: string } };
    activeDate: { start: string; end: string };
    setActiveDate: (value: any) => void;
}

export const AppSessionDates: FC<AppSessionDatesProps> = ({
    sessionDates,
    activeDate,
    setActiveDate,
}): JSX.Element => {
    const { container } = useGlobalData();

    const getTotalSlide = () => {
        return Object.keys(sessionDates).length;
    };

    return (
        <Col
            sm={12}
            className="event-detail-admin--days--container mt-1 mb-3 px-0"
        >
            <div className="inner-container day-carousel">
                <Swiper slidesPerView={"auto"} initialSlide={getTotalSlide()}>
                    {sessionDates &&
                        Object.keys(sessionDates).map((key) => {
                            return (
                                <SwiperSlide
                                    className={`inner-container--item  mr-4 ${
                                        sessionDates[key].start ===
                                            activeDate.start && "active"
                                    }`}
                                    key={key}
                                >
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveDate(sessionDates[key]);
                                        }}
                                    >
                                        <div className="num-day">
                                            <span>
                                                {humanReadableDate(
                                                    getDateOnly(
                                                        sessionDates[key].start
                                                    ),
                                                    "dd"
                                                )}
                                            </span>
                                        </div>
                                        <div className="date-day">
                                            <span className="date-day--dofw">
                                                {humanReadableDate(
                                                    getDateOnly(
                                                        sessionDates[key].start
                                                    ),
                                                    "EEEE"
                                                )}
                                            </span>
                                            <span className="date-day--dofy">
                                                {humanReadableDate(
                                                    getDateOnly(
                                                        sessionDates[key].start
                                                    ),
                                                    container &&
                                                        container.configuration &&
                                                        (container.configuration as any)
                                                            .longDate
                                                        ? (container.configuration as any)
                                                              .longDate
                                                        : "MMMM , yyyy"
                                                )}
                                            </span>
                                        </div>
                                    </a>
                                </SwiperSlide>
                            );
                        })}
                </Swiper>
            </div>
        </Col>
    );
};
