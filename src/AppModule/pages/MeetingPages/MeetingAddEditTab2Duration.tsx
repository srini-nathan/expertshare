import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Duration, Meeting } from "../../models/entities/Meeting";
import { MeetingAddEditTab2DurationItem } from "./MeetingAddEditTab2DurationItem";
import { AppButton } from "../../components";

interface MeetingAddEditDurationProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
    isEditMode: boolean;
    addDuration: () => void;
    removeDuration: (index: number) => void;
    durations: Duration[];
}

export const MeetingAddEditTab2Duration: FC<MeetingAddEditDurationProps> = ({
    data,
    isEditMode,
    form,
    addDuration,
    removeDuration,
    durations,
}): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div className="col-12 mb-3">
            <div className="schedule-meeting--duration-time-box card p-3 mb-3">
                <div className="row m-0 p-0">
                    <div className="schedule-meeting--duration-time-box--det col-12 px-0">
                        <div className="row m-0 p-0">
                            <div className="schedule-meeting--duration-time-box--det--name col-auto px-0">
                                <h3>
                                    {t("meeting.form:label.duration")}
                                    <span className="required">*</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-meeting--duration-time-box--content col-12 px-0">
                        {durations.map((duration, index) => {
                            return (
                                <MeetingAddEditTab2DurationItem
                                    key={duration.id}
                                    index={index}
                                    data={data}
                                    form={form}
                                    isEditMode={isEditMode}
                                    removeDuration={removeDuration}
                                    duration={duration}
                                    durations={durations}
                                />
                            );
                        })}
                        <AppButton
                            variant={"secondary"}
                            className="add-duration-btn pl-4 pr-3"
                            onClick={addDuration}
                            disabled={durations.length >= 3}
                        >
                            <i className="fak fa-plus-light"></i>
                            {t("meeting.form:button.anotherDuration")}
                        </AppButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
