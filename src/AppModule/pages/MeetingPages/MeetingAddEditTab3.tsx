import React from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { MeetingAddEditTabProps } from "./MeetingAddEditTabs";
import { validation } from "../../utils";
import { AppFormSwitch } from "../../components";

export const MeetingAddEditTab3 = ({
    active,
    form,
    data,
    isEditMode,
}: MeetingAddEditTabProps) => {
    const { t } = useTranslation();
    const { control, formState } = form;
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
                <Form.Row>
                    <AppFormSwitch
                        name={"isSendReminder"}
                        label={t("meeting.form:label.isSendReminder")}
                        {...validation(
                            "isSendReminder",
                            formState,
                            isEditMode,
                            true
                        )}
                        defaultChecked={data.isSendReminder}
                        control={control}
                    />
                </Form.Row>
            </div>
        </div>
    );
};
