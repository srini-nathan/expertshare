import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { find as _find } from "lodash";
import { Availability, Meeting } from "../../models/entities/Meeting";
import { AppButton, AppFormSelect } from "../../components";
import { validation } from "../../utils";
import { SimpleObject } from "../../models";
import { getDays, getTime } from "./meeting-helper";

interface MeetingAddEditTab2AvailabilityItemProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
    availabilities: Availability[];
    availability: Availability;
    isEditMode: boolean;
    removeAvailability: (index: number) => void;
    index: number;
}

export const MeetingAddEditTab2AvailabilityItem: FC<MeetingAddEditTab2AvailabilityItemProps> = ({
    availability,
    form,
    isEditMode,
    removeAvailability,
    availabilities,
    index,
}): JSX.Element => {
    const { t } = useTranslation();
    const { control, formState } = form;
    const days = getDays(t);
    const time = getTime(30);
    const dayKey = `availability[${index}].day`;
    const startKey = `availability[${index}].start`;
    const endKey = `availability[${index}].end`;
    return (
        <div className="available-time-item mb-1 px-3 py-2">
            <div className="schedule-meeting--drop-down day mr-3 py-1">
                <Form.Row>
                    <AppFormSelect
                        id={dayKey}
                        name={dayKey}
                        block={true}
                        label={t("")}
                        className="rm-container"
                        {...validation(dayKey, formState, isEditMode, true)}
                        placeholder={""}
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
                <Form.Row>
                    <AppFormSelect
                        id={startKey}
                        name={startKey}
                        block={true}
                        label={""}
                        className="rm-container"
                        {...validation(startKey, formState, isEditMode, true)}
                        placeholder={""}
                        defaultValue={availability.start}
                        options={time}
                        control={control}
                        transform={{
                            output: (option: SimpleObject<string>) => {
                                return option?.value;
                            },
                            input: (value: string) => {
                                return _find(time, {
                                    value,
                                });
                            },
                        }}
                    />
                </Form.Row>
            </div>
            <span className="to-divider px-2 my-1">
                {t("meeting.form:label.to")}
            </span>
            <div className="schedule-meeting--drop-down last-time mr-2 py-1">
                <Form.Row>
                    <AppFormSelect
                        id={endKey}
                        name={endKey}
                        block={true}
                        label={""}
                        className="rm-container"
                        {...validation(endKey, formState, isEditMode, true)}
                        placeholder={""}
                        defaultValue={availability.end}
                        options={time}
                        control={control}
                        transform={{
                            output: (option: SimpleObject<string>) => {
                                return option?.value;
                            },
                            input: (value: string) => {
                                return _find(time, {
                                    value,
                                });
                            },
                        }}
                    />
                </Form.Row>
            </div>
            <AppButton
                variant={"secondary"}
                className="delete-btn"
                onClick={() => removeAvailability(availability.id)}
                disabled={availabilities.length === 1}
            >
                <i className="fak fa-trash-light"></i>
            </AppButton>
        </div>
    );
};
