import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Meeting } from "../../models/entities/Meeting";

interface MeetingAddEditTab2AvailabilityWindowProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
}

export const MeetingAddEditTab2AvailabilityWindow: FC<MeetingAddEditTab2AvailabilityWindowProps> = (): JSX.Element => {
    return (
        <div className="col-12 col-md-6">
            <div className="schedule-meeting--title mb-3">
                <h2 className="mb-0">Availability Window</h2>
            </div>
            <div className="schedule-meeting--available-times-box card p-3 mb-3">
                <div className="row m-0 p-0">
                    <div className="schedule-meeting--available-times-box--det col-12 px-0">
                        <div className="row m-0 p-0">
                            <div className="schedule-meeting--available-times-box--det--name col-auto px-0">
                                <h3>Available times</h3>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-meeting--available-times-box--content col-12 px-0">
                        <div className="available-time-item mb-1 px-3 py-2">
                            <div className="schedule-meeting--drop-down day mr-3 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Monday
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Thuseday
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Wednesday
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="schedule-meeting--drop-down py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                09:00 AM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    10:00 AM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    12:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="to-divider px-2 my-1"> to </span>
                            <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                14:00 PM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    16:00 PM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    18:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-secondary delete-btn my-1">
                                <i className="fak fa-trash-light"></i>
                            </button>
                        </div>
                        <div className="available-time-item mb-1 px-3 py-2">
                            <div className="schedule-meeting--drop-down day mr-3 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Friday
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Thuseday
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Wednesday
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="schedule-meeting--drop-down py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                09:00 AM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    10:00 AM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    12:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="to-divider px-2 my-1"> to </span>
                            <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                14:00 PM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    16:00 PM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    18:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-secondary delete-btn my-1">
                                <i className="fak fa-trash-light"></i>
                            </button>
                        </div>
                        <div className="available-time-item mb-1 px-3 py-2">
                            <div className="schedule-meeting--drop-down day mr-3 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Friday
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Thuseday
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Wednesday
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="schedule-meeting--drop-down py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                09:00 AM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    10:00 AM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    12:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="to-divider px-2 my-1"> to </span>
                            <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                14:00 PM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    16:00 PM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    18:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-secondary delete-btn my-1">
                                <i className="fak fa-trash-light"></i>
                            </button>
                        </div>
                        <div className="available-time-item mb-1 px-3 py-2">
                            <div className="schedule-meeting--drop-down day mr-3 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Wednesday
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Thuseday
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    Wednesday
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="schedule-meeting--drop-down py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                09:00 AM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    10:00 AM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    12:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="to-divider px-2 my-1"> to </span>
                            <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                                <div className="row m-0 p-0">
                                    <div className="schedule-meeting--drop-down--tx col-12 px-0">
                                        <div className="dropdown dropdown-field">
                                            <a
                                                className="dropdown-toggle"
                                                href="#"
                                                role="button"
                                                id="dropdownMenuLink"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                14:00 PM
                                            </a>

                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="dropdownMenuLink"
                                                x-placement="bottom-start"
                                            >
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    16:00 PM
                                                </a>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                >
                                                    18:00 PM
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-secondary delete-btn my-1">
                                <i className="fak fa-trash-light"></i>
                            </button>
                        </div>
                        <a className="btn btn-secondary add-duration-btn pl-4 pr-3 mt-3">
                            <i className="fak fa-plus-light"></i>
                            Another Day
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
