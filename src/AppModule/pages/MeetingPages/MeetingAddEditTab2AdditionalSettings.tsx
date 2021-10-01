import React, { FC, Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { Meeting } from "../../models/entities/Meeting";

interface MeetingAddEditTab2AdditionalSettingsProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
}

export const MeetingAddEditTab2AdditionalSettings: FC<MeetingAddEditTab2AdditionalSettingsProps> = (): JSX.Element => {
    return (
        <Fragment>
            <div className="col-12">
                <a className="btn btn-secondary additional-setting-btn pl-4 pr-3 my-3">
                    <i className="fak fa-plus-light"></i>
                    Additional Settings
                </a>
                <div className="schedule-meeting--radio-box mb-3">
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="customr1"
                            name="customr"
                            value="customr1"
                        />
                        <label htmlFor="customr1">
                            <span>Single Meeting</span>
                        </label>
                    </div>
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="customr2"
                            name="customr"
                            value="customr2"
                        />
                        <label htmlFor="customr2">
                            <span>Over a period of rolling weeks</span>
                        </label>
                    </div>
                    <div className="radio-item">
                        <input
                            type="radio"
                            id="customr3"
                            name="customr"
                            value="customr3"
                            checked
                        />
                        <label htmlFor="customr3">
                            <span>Custom Range</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="schedule-meeting--text-box mb-3">
                    <div className="row m-0 p-0">
                        <div className="schedule-meeting--text-box--det col-12 px-0">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                    <h3>
                                        Start Date
                                        <span className="required">*</span>
                                        <a
                                            tabIndex={0}
                                            className="guide-icon"
                                            role="button"
                                            data-toggle="popover"
                                            data-trigger="focus"
                                            title=""
                                            data-content="Choose One"
                                            data-original-title="Choose One"
                                        >
                                            <span>𝒾</span>
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="schedule-meeting--text-box--tx col-12 px-0">
                            <input
                                type="text"
                                className="input-text w-100 px-2"
                                placeholder="Choose Start Date "
                            />
                            <a className="date-toggle" href="#">
                                <i
                                    className="fak fa-calendar-light"
                                    aria-hidden="true"
                                ></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="schedule-meeting--drop-down mb-3">
                    <div className="row m-0 p-0">
                        <div className="schedule-meeting--drop-down--det col-12 px-0">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                    <h3>
                                        Minimum Notice Period (Before which a
                                        meeting can be booked)
                                        <span className="required">*</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
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
                                    15 Minutes
                                </a>

                                <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuLink"
                                    x-placement="bottom-start"
                                >
                                    <a className="dropdown-item" href="#">
                                        30 Minutes
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        45 Minutes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="schedule-meeting--drop-down mb-3">
                    <div className="row m-0 p-0">
                        <div className="schedule-meeting--drop-down--det col-12 px-0">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                    <h3>
                                        Start Time Frequency
                                        <span className="required">*</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
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
                                    15 Minutes
                                </a>

                                <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuLink"
                                    x-placement="bottom-start"
                                >
                                    <a className="dropdown-item" href="#">
                                        30 Minutes
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        45 Minutes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="schedule-meeting--text-box mb-3">
                    <div className="row m-0 p-0">
                        <div className="schedule-meeting--text-box--det col-12 px-0">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                    <h3>
                                        End Date
                                        <span className="required">*</span>
                                        <a
                                            tabIndex={0}
                                            className="guide-icon"
                                            role="button"
                                            data-toggle="popover"
                                            data-trigger="focus"
                                            title=""
                                            data-content="Choose One"
                                            data-original-title="Choose One"
                                        >
                                            <span>𝒾</span>
                                        </a>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="schedule-meeting--text-box--tx col-12 px-0">
                            <input
                                type="text"
                                className="input-text w-100 px-2"
                                placeholder="Choose End Date "
                            />
                            <a className="date-toggle" href="#">
                                <i
                                    className="fak fa-calendar-light"
                                    aria-hidden="true"
                                ></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="schedule-meeting--drop-down mb-3">
                    <div className="row m-0 p-0">
                        <div className="schedule-meeting--drop-down--det col-12 px-0">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                    <h3>
                                        Buffer Time Period (Around which a
                                        meeting can't be booked)
                                        <span className="required">*</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
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
                                    15 Minutes
                                </a>

                                <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuLink"
                                    x-placement="bottom-start"
                                >
                                    <a className="dropdown-item" href="#">
                                        30 Minutes
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        45 Minutes
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
