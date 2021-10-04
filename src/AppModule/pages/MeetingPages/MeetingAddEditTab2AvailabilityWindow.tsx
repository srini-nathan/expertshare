import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Availability, Meeting } from "../../models/entities/Meeting";
import { MeetingAddEditTab2AvailabilityItem } from "./MeetingAddEditTab2AvailabilityItem";

interface MeetingAddEditTab2AvailabilityWindowProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
    availabilities: Availability[];
    isEditMode: boolean;
}

export const MeetingAddEditTab2AvailabilityWindow: FC<MeetingAddEditTab2AvailabilityWindowProps> = ({
    data,
    availabilities,
    form,
    isEditMode,
}): JSX.Element => {
    const { t } = useTranslation();
    return (
        <div className="col-12">
            <div className="schedule-meeting--title mb-3">
                <h2 className="mb-0">
                    {t("meeting.form:label.availabilityWindow")}
                </h2>
            </div>
            <div className="schedule-meeting--available-times-box card p-3 mb-3">
                <div className="row m-0 p-0">
                    <div className="schedule-meeting--available-times-box--det col-12 px-0">
                        <div className="row m-0 p-0">
                            <div className="schedule-meeting--available-times-box--det--name col-auto px-0">
                                <h3>
                                    {t("meeting.form:label.availableTimes")}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="schedule-meeting--available-times-box--content col-12 px-0">
                        {availabilities.map((availability) => {
                            return (
                                <MeetingAddEditTab2AvailabilityItem
                                    key={availability.id}
                                    data={data}
                                    form={form}
                                    isEditMode={isEditMode}
                                    availabilities={availabilities}
                                    availability={availability}
                                />
                            );
                        })}
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
