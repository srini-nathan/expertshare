import React from "react";
import { MeetingAddEditTabProps } from "./MeetingAddEditTabs";
import { MeetingAddEditTab2Duration } from "./MeetingAddEditTab2Duration";
import { MeetingAddEditTab2AvailabilityWindow } from "./MeetingAddEditTab2AvailabilityWindow";
import { MeetingAddEditTab2AdditionalSettings } from "./MeetingAddEditTab2AdditionalSettings";

export const MeetingAddEditTab2 = ({
    active,
    data,
    form,
}: MeetingAddEditTabProps) => {
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
                    <MeetingAddEditTab2Duration data={data} form={form} />
                    <MeetingAddEditTab2AvailabilityWindow
                        data={data}
                        form={form}
                    />
                    <MeetingAddEditTab2AdditionalSettings
                        data={data}
                        form={form}
                    />
                </div>
            </div>
        </div>
    );
};
