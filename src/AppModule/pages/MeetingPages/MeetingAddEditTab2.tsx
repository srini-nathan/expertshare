import React from "react";
import { MeetingAddEditTabProps } from "./MeetingAddEditTabs";
import { MeetingAddEditTab2Duration } from "./MeetingAddEditTab2Duration";
import { MeetingAddEditTab2AvailabilityWindow } from "./MeetingAddEditTab2AvailabilityWindow";
import { MeetingAddEditTab2AdditionalSettings } from "./MeetingAddEditTab2AdditionalSettings";
import { Availability, Duration } from "../../models/entities/Meeting";

interface MeetingAddEditTab2Props extends MeetingAddEditTabProps {
    addDuration: () => void;
    removeDuration: (index: number) => void;
    durations: Duration[];
    availabilities: Availability[];
    addAvailability: () => void;
    removeAvailability: (index: number) => void;
}

export const MeetingAddEditTab2 = ({
    active,
    data,
    form,
    isEditMode,
    addDuration,
    removeDuration,
    durations,
    availabilities,
    addAvailability,
    removeAvailability,
}: MeetingAddEditTab2Props) => {
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
                    <MeetingAddEditTab2Duration
                        data={data}
                        form={form}
                        isEditMode={isEditMode}
                        addDuration={addDuration}
                        removeDuration={removeDuration}
                        durations={durations}
                    />
                    <MeetingAddEditTab2AvailabilityWindow
                        data={data}
                        form={form}
                        isEditMode={isEditMode}
                        availabilities={availabilities}
                        addAvailability={addAvailability}
                        removeAvailability={removeAvailability}
                    />
                    <MeetingAddEditTab2AdditionalSettings
                        data={data}
                        form={form}
                        isEditMode={isEditMode}
                    />
                </div>
            </div>
        </div>
    );
};
