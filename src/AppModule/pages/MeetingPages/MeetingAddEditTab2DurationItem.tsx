import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Duration, Meeting } from "../../models/entities/Meeting";
import { validation } from "../../utils";
import { AppButton, AppFormInput } from "../../components";

interface MeetingAddEditTab2DurationItemProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
    index: number;
    isEditMode: boolean;
    removeDuration: (index: number) => void;
    duration: Duration;
    durations: Duration[];
}

export const MeetingAddEditTab2DurationItem: FC<MeetingAddEditTab2DurationItemProps> = ({
    form,
    index,
    isEditMode,
    removeDuration,
    duration,
    durations,
}): JSX.Element => {
    const { t } = useTranslation();
    const { formState, control } = form;
    const hoursKey = `duration[${index}].hours`;
    const minutesKey = `duration[${index}].minutes`;
    return (
        <div className="duration-item mb-3 p-3">
            <div className="schedule-meeting--text-box mr-2">
                <div className="row m-0 p-0">
                    <div className="schedule-meeting--text-box--det col-12 px-0">
                        <div className="row m-0 p-0">
                            <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                <h3>{t("common.date:short.hours")}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-meeting--text-box--tx col-12 px-0">
                        <AppFormInput
                            name={hoursKey}
                            label={``}
                            {...validation(
                                hoursKey,
                                formState,
                                isEditMode,
                                true
                            )}
                            defaultValue={`${duration.hours}`}
                            control={control}
                            lg={12}
                            md={12}
                            xl={12}
                        />
                    </div>
                </div>
            </div>
            <div className="schedule-meeting--text-box mr-2">
                <div className="row m-0 p-0">
                    <div className="schedule-meeting--text-box--det col-12 px-0">
                        <div className="row m-0 p-0">
                            <div className="schedule-meeting--text-box--det--name col-auto px-0">
                                <h3>{t("common.date:short.minutes")}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-meeting--text-box--tx col-12 px-0">
                        <AppFormInput
                            name={minutesKey}
                            label={``}
                            {...validation(
                                minutesKey,
                                formState,
                                isEditMode,
                                true
                            )}
                            defaultValue={`${duration.minutes}`}
                            control={control}
                            lg={12}
                            md={12}
                            xl={12}
                        />
                    </div>
                </div>
            </div>
            <AppButton
                variant={"secondary"}
                className="delete-btn"
                onClick={() => removeDuration(duration.id)}
                disabled={durations.length === 1}
            >
                <i className="fak fa-trash-light"></i>
            </AppButton>
        </div>
    );
};
