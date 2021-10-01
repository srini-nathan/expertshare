import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Meeting } from "../../models/entities/Meeting";

interface MeetingAddEditDurationProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
}

export const MeetingAddEditTab2Duration: FC<MeetingAddEditDurationProps> = (): JSX.Element => {
    return (
        <div className="col-12 mb-3">
            <div className="schedule-meeting--duration-time-box card p-3 mb-3">
                <div className="row m-0 p-0">
                    <div className="schedule-meeting--duration-time-box--det col-12 px-0">
                        <div className="row m-0 p-0">
                            <div className="schedule-meeting--duration-time-box--det--name col-auto px-0">
                                <h3>
                                    Duration
                                    <span className="required">*</span>
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
    );
};
