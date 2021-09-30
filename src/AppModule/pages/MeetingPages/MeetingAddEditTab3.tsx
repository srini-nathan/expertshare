import React from "react";

export interface MeetingAddEditTab3Props {
    active: number;
}

export const MeetingAddEditTab3 = ({ active }: MeetingAddEditTab3Props) => {
    return (
        <div
            className={`inner-content--steps--container confirmation tab-pane fade ${
                active === 3 ? "show active" : ""
            }`}
            id="confirmation"
            role="tabpanel"
            aria-labelledby="confirmation-tab"
        >
            <div className="inner-box p-4">
                <div className="schedule-meeting--check-box d-flex mb-3">
                    <div className="custom-checkbox">
                        <input
                            className="d-none"
                            type="checkbox"
                            id="sendmeetingreminder"
                            name="sendmeetingreminder"
                            defaultChecked={true}
                        />
                        <label
                            className="position-relative mb-0"
                            htmlFor="sendmeetingreminder"
                        ></label>
                    </div>
                    <label className="wrap-label">
                        Send Meeting Reminder
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
                    </label>
                </div>
                <div className="schedule-meeting--drop-down mb-3">
                    <div className="row m-0 p-0">
                        <div className="schedule-meeting--drop-down--det col-12 px-0">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                    <h3>
                                        Choose Meeting Reminder Email Template
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
                                    Template 1
                                </a>

                                <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuLink"
                                    x-placement="bottom-start"
                                >
                                    <a className="dropdown-item" href="#">
                                        Template 2
                                    </a>
                                    <a className="dropdown-item" href="#">
                                        Template 3
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
