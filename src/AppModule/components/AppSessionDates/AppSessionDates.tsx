import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { format } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import "./assets/scss/style.scss";
import { useGlobalData } from "../../contexts";

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
    const { container } = useGlobalData();

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
                                                {format(
                                                    new Date(sessionDates[key]),
                                                    "dd"
                                                )}
                                            </span>
                                        </div>
                                        <div className="date-day">
                                            <span className="date-day--dofw">
                                                {format(
                                                    new Date(sessionDates[key]),
                                                    "EEEE"
                                                )}
                                            </span>
                                            <span className="date-day--dofy">
                                                {format(
                                                    new Date(sessionDates[key]),
                                                    container &&
                                                        container.configuration &&
                                                        (container.configuration as any)
                                                            .longDate
                                                        ? (container.configuration as any)
                                                              .longDate
                                                        : "MMMM dd, yyyy"
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
