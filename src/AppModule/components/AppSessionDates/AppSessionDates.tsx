import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "./assets/scss/style.scss";

export interface AppSessionDatesProps {
    sessionDates: { [key: string]: string };
    activeDate: string;
    setActiveDate: (value: string) => void;
}

export const AppSessionDates: FC<AppSessionDatesProps> = ({
    sessionDates,
    activeDate,
    setActiveDate,
}): JSX.Element => {
    const getDay = (date: string) => {
        const newDate = new Date(date);
        const options = {
            day: "2-digit",
        } as const;
        return newDate.toLocaleDateString("en-US", options);
    };

    const getDate2 = (date: string) => {
        const newDate = new Date(date);
        const options = {
            year: "numeric",
            month: "long",
            day: "2-digit",
        } as const;
        return newDate.toLocaleDateString("en-US", options);
    };
    const getDayName = (date: string) => {
        const newDate = new Date(date);

        const options = {
            weekday: "long",
        } as const;
        return newDate.toLocaleDateString("en-US", options);
    };

    return (
        <Col
            sm={12}
            className="event-detail-admin--days--container mt-1 mb-3 px-0"
        >
            <div className="inner-container day-carousel">
                <Swiper slidesPerView={"auto"}>
                    {sessionDates &&
                        Object.keys(sessionDates).map((key) => {
                            return (
                                <SwiperSlide
                                    className={`inner-container--item  mr-4 ${
                                        sessionDates[key] === activeDate &&
                                        "active"
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
                                                {getDay(sessionDates[key])}
                                            </span>
                                        </div>
                                        <div className="date-day">
                                            <span className="date-day--dofw">
                                                {getDayName(sessionDates[key])}
                                            </span>
                                            <span className="date-day--dofy">
                                                {getDate2(sessionDates[key])}
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
