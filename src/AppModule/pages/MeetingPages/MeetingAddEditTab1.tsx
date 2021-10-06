import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MeetingAddEditTabProps } from "./MeetingAddEditTabs";
import { AppFormInput, AppFormSwitch, AppFormTextArea } from "../../components";
import { validations } from "./schema";
import { validation } from "../../utils";

export const MeetingAddEditTab1 = ({
    active,
    form,
    data,
    isEditMode,
}: MeetingAddEditTabProps) => {
    const { t } = useTranslation();
    const { control, formState } = form;
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
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={t("meeting.form:label.name")}
                                    maxCount={validations.name.max}
                                    block={true}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode,
                                        true
                                    )}
                                    defaultValue={data.name}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormInput
                                    name={"providerUrl"}
                                    label={t("meeting.form:label.providerUrl")}
                                    block={true}
                                    {...validation(
                                        "providerUrl",
                                        formState,
                                        isEditMode,
                                        true
                                    )}
                                    defaultValue={data.providerUrl}
                                    control={control}
                                />
                            </Form.Row>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <Form.Row>
                            <AppFormTextArea
                                name={"description"}
                                control={control}
                                block={true}
                                required={false}
                                label={t("meeting.form:label.description")}
                                defaultValue={data.description}
                            />
                        </Form.Row>
                    </div>
                    <div className="col-12 col-md-6">
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
            </div>
        </div>
    );
};
