import React from "react";

export interface MeetingAddEditTab1Props {
    active: number;
}

export const MeetingAddEditTab1 = ({ active }: MeetingAddEditTab1Props) => {
    return (
        <div
            className={`inner-content--steps--container overview tab-pane fade ${
                active === 1 ? "show active" : ""
            }`}
            id="overview"
            role="tabpanel"
            aria-labelledby="overview-tab"
        >
            <div className="inner-box p-4">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="schedule-meeting--text-box mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                            <h3>Meeting Link</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule-meeting--text-box--tx meeting-link col-12 px-0">
                                    <input
                                        type="text"
                                        readOnly
                                        disabled
                                        className="input-text w-100 px-2 mr-2"
                                        placeholder="https://app.expertshare.live/meetings/mahesh.manseta/"
                                    />
                                    <button className="btn btn-secondary clipboard-btn">
                                        <i className="fak fa-clone-light"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="schedule-meeting--text-box mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                            <h3>
                                                Meeting Name
                                                <span className="required">
                                                    *
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="schedule-meeting--text-box--det--count col-auto px-0 mr-0 ml-auto">
                                            <span> 0/80 </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                    <input
                                        type="text"
                                        className="input-text w-100 px-2"
                                        placeholder="Type here meeting name"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="schedule-meeting--text-box mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                            <h3>
                                                Internal Name
                                                <span className="required">
                                                    *
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="schedule-meeting--text-box--det--count col-auto px-0 mr-0 ml-auto">
                                            <span> 0/80 </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                    <input
                                        type="text"
                                        className="input-text w-100 px-2"
                                        placeholder="Type here internal name for your meeting"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="schedule-meeting--text-box mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--text-box--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                            <h3>
                                                Meeting Title (for Calendar)
                                                <span className="required">
                                                    *
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="schedule-meeting--text-box--det--count col-auto px-0 mr-0 ml-auto">
                                            <span> 0/80 </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule-meeting--text-box--tx col-12 px-0">
                                    <input
                                        type="text"
                                        className="input-text w-100 px-2"
                                        placeholder="Type title which will be shown as meeting title in calendar"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="schedule-meeting--drop-down mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--drop-down--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--drop-down--det--name col-auto px-0">
                                            <h3>
                                                Location
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
                                            Expertshare
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
                                                SR Media
                                            </a>
                                            <a
                                                className="dropdown-item"
                                                href="#"
                                            >
                                                Trendyol
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="schedule-meeting--description mb-3">
                            <div className="row m-0 p-0">
                                <div className="schedule-meeting--description--det col-12 px-0">
                                    <div className="row m-0 p-0">
                                        <div className="schedule-meeting--description--det--name col-auto px-0">
                                            <h3>
                                                Description
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
                                                    data-content="Choose Description"
                                                    data-original-title="Description"
                                                >
                                                    <span>𝒾</span>
                                                </a>
                                            </h3>
                                        </div>
                                        <div className="schedule-meeting--description--det--count col-auto px-0 mr-0 ml-auto">
                                            <span> 0/120 </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule-meeting--description--tx col-12 px-0">
                                    <textarea
                                        className="input-txarea w-100 px-2 pt-2"
                                        placeholder="Please Enter..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
