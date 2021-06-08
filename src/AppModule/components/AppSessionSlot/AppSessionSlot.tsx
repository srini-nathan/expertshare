import React, { FC } from "react";
import { Link } from "@reach/router";
import "./assets/scss/style.scss";
import { Session } from "../../../AdminModule/models";
import { AppFormDropdown } from "../AppFormDropdown";
import { CONSTANTS } from "../../../config";

const { Session: SESSION } = CONSTANTS;
const { CARDSIZE } = SESSION;
const cardSizeOptions = Object.entries(CARDSIZE).map(([, value]) => ({
    value,
    label: value,
}));
export interface AppSessionSlotProps {
    name?: string;
    conferenceId: number;
    sessions: Session[];
    isGrantedControl: boolean;
    buttonName: string;
    handleChangeCard: (size: string, sessions: number[]) => void;
}

export const AppSessionSlot: FC<AppSessionSlotProps> = ({
    children,
    conferenceId,
    sessions,
    isGrantedControl,
    handleChangeCard,
    buttonName,
}): JSX.Element => {
    return (
        <div className="event-detail-admin--workshop larg-size larg-carousel col-12 my-4 px-0">
            <div className="event-detail-admin--workshop--container p-3">
                <div className="event-detail-admin--workshop--container--header mt-2 mb-3">
                    <div className="row m-0 p-0">
                        <div className="event-detail-admin--workshop--container--header--left col-auto px-0">
                            <div className="event-detail-admin--workshop--container--header--left--content">
                                <a
                                    href="#"
                                    className={`btn btn-secondary arrow-left-btn ${buttonName}_left`}
                                >
                                    <i className="fak fa-chevron-left"></i>
                                </a>
                            </div>
                        </div>
                        <div className="event-detail-admin--workshop--container--header--right col-auto px-0 mr-0 ml-auto">
                            {isGrantedControl && (
                                <>
                                    <div className="size-dropdown   mr-3">
                                        <AppFormDropdown
                                            id={"cardSize"}
                                            name={"cardSize"}
                                            onChange={(e: any) => {
                                                const ids: number[] = sessions.map(
                                                    (session) => {
                                                        return session.id;
                                                    }
                                                );
                                                handleChangeCard(e.value, ids);
                                            }}
                                            defaultValue={""}
                                            placeholder={"Card Size"}
                                            className="cardsize-dropdown"
                                            options={cardSizeOptions}
                                        />
                                    </div>
                                    <Link
                                        to={`/sessions/${conferenceId}/new`}
                                        className="btn-session btn btn-secondary mr-3"
                                    >
                                        + Session
                                    </Link>
                                </>
                            )}
                            <a
                                href="#"
                                className={`btn btn-secondary btn-arrow ${buttonName}_right`}
                            >
                                <i className="fak fa-chevron-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="event-detail-admin--workshop--container--content">
                    <div className="d-flex">{children}</div>
                </div>
            </div>
        </div>
    );
};
