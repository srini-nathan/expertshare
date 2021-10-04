import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { find as _find } from "lodash";
import { Availability, Meeting } from "../../models/entities/Meeting";
import { AppFormSelect } from "../../components";
import { validation } from "../../utils";
import { SimpleObject } from "../../models";
import { getDays } from "./meeting-helper";

interface MeetingAddEditTab2AvailabilityItemProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
    availabilities: Availability[];
    availability: Availability;
    isEditMode: boolean;
}

export const MeetingAddEditTab2AvailabilityItem: FC<MeetingAddEditTab2AvailabilityItemProps> = ({
    availability,
    form,
    isEditMode,
}): JSX.Element => {
    const { t } = useTranslation();
    const { control, formState } = form;
    const days = getDays(t);
    return (
        <div className="available-time-item mb-1 px-3 py-2">
            <div className="schedule-meeting--drop-down day mr-3 py-1">
                <Form.Row>
                    <AppFormSelect
                        id={"noticePeriod"}
                        name={"noticePeriod"}
                        md={6}
                        xl={6}
                        sm={12}
                        label={t("meeting.form:label.noticePeriod")}
                        className="rm-container"
                        {...validation(
                            "noticePeriod",
                            formState,
                            isEditMode,
                            true
                        )}
                        placeholder={"noticePeriod"}
                        defaultValue={`${availability.day}`}
                        options={days}
                        control={control}
                        transform={{
                            output: (option: SimpleObject<string>) => {
                                return option?.value;
                            },
                            input: (value: string) => {
                                return _find(days, {
                                    value,
                                });
                            },
                        }}
                    />
                </Form.Row>
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
                                <a className="dropdown-item" href="#">
                                    10:00 AM
                                </a>
                                <a className="dropdown-item" href="#">
                                    12:00 PM
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span className="to-divider px-2 my-1">
                {t("meeting.form:label.to")}
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
                                <a className="dropdown-item" href="#">
                                    16:00 PM
                                </a>
                                <a className="dropdown-item" href="#">
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
    );
};
