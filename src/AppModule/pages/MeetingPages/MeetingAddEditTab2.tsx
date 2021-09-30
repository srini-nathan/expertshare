import React from "react";

export interface MeetingAddEditTab2Props {
    active: number;
}

export const MeetingAddEditTab2 = ({ active }: MeetingAddEditTab2Props) => {
    return (
        <div
            className={`inner-content--steps--container scheduling tab-pane fade ${
                active === 2 ? "show active" : ""
            }`}
            id="scheduling"
            role="tabpanel"
            aria-labelledby="scheduling-tab"
        >
            <div className="inner-box p-4">
                <div className="row">
                    <div className="col-12 mb-3">
                        <div className="schedule-meeting--duration-time-box card p-3 mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--duration-time-box--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--duration-time-box--det--name col-auto px-0">
                                            <h3>
                                                Duration
                                                <span className="required">
                                                    *
                                                </span>
                                                <a
                                                    tabIndex={0}
                                                    className="guide-icon"
                                                    role="button"
                                                    data-toggle="popover"
                                                    data-trigger="focus"
                                                    title=""
                                                    data-content="Choose Duration"
                                                    data-original-title="Choose Duration"
                                                >
                                                    <span>𝒾</span>
                                                </a>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule-meeting--duration-time-box--content col-12 px-0">
                                    <div className="duration-item mb-3 p-3">
                                        <div className="schedule-meeting--text-box mr-2">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>Hrs</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="number"
                                                        className="input-text w-100 px-2"
                                                        value="1"
                                                        placeholder="Choose hour"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--text-box mr-2">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>Min</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="number"
                                                        className="input-text w-100 px-2"
                                                        value="45"
                                                        placeholder="Choose Minute"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary delete-btn">
                                            <i className="fak fa-trash-light"></i>
                                        </button>
                                    </div>
                                    <div className="duration-item mb-3 p-3">
                                        <div className="schedule-meeting--text-box mr-2">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>Hrs</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="number"
                                                        className="input-text w-100 px-2"
                                                        value="1"
                                                        placeholder="Choose hour"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="schedule-meeting--text-box mr-2">
                                            <div className="row m-0 p-0">
                                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                                            <h3>Min</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                                    <input
                                                        type="number"
                                                        className="input-text w-100 px-2"
                                                        value="45"
                                                        placeholder="Choose Minute"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-secondary delete-btn">
                                            <i className="fak fa-trash-light"></i>
                                        </button>
                                    </div>
                                    <a className="btn btn-secondary add-duration-btn pl-4 pr-3">
                                        <i className="fak fa-plus-light"></i>
                                        Another Duration
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                        <span className="to-divider px-2 my-1">
                                            {" "}
                                            to{" "}
                                        </span>
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
                                        <span className="to-divider px-2 my-1">
                                            {" "}
                                            to{" "}
                                        </span>
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
                                        <span className="to-divider px-2 my-1">
                                            {" "}
                                            to{" "}
                                        </span>
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
                                        <span className="to-divider px-2 my-1">
                                            {" "}
                                            to{" "}
                                        </span>
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
                                                <span className="required">
                                                    *
                                                </span>
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
                                                Minimum Notice Period (Before
                                                which a meeting can be booked)
                                                <span className="required">
                                                    *
                                                </span>
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
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                30 Minutes
                                            </a>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
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
                                                <span className="required">
                                                    *
                                                </span>
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
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                30 Minutes
                                            </a>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
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
                                                <span className="required">
                                                    *
                                                </span>
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
                                                Buffer Time Period (Around which
                                                a meeting can't be booked)
                                                <span className="required">
                                                    *
                                                </span>
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
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                30 Minutes
                                            </a>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                45 Minutes
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
