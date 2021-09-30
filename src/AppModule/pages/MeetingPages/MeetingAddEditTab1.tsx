import React from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { find as _find } from "lodash";
import { MeetingAddEditTabProps } from "./MeetingAddEditTabs";
import { AppFormInput, AppFormSelect, AppFormTextArea } from "../../components";
import { validations } from "./schema";
import { validation } from "../../utils";
import { SimpleObject } from "../../models";
import { getProviderOptions } from "./meeting-helper";

export const MeetingAddEditTab1 = ({
    active,
    form,
    data,
    isEditMode,
}: MeetingAddEditTabProps) => {
    const { t } = useTranslation();
    const providers = getProviderOptions(t);
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
                                <AppFormSelect
                                    id={"provider"}
                                    name={"provider"}
                                    label={t("meeting.form:label.provider")}
                                    block={true}
                                    required={true}
                                    className="rm-container"
                                    {...validation(
                                        "provider",
                                        formState,
                                        isEditMode,
                                        true
                                    )}
                                    placeholder={"type"}
                                    defaultValue={data.provider}
                                    options={providers}
                                    control={control}
                                    transform={{
                                        output: (
                                            option: SimpleObject<string>
                                        ) => {
                                            return option?.value;
                                        },
                                        input: (value: string) => {
                                            return _find(providers, {
                                                value,
                                            });
                                        },
                                    }}
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
                            />
                        </Form.Row>
                    </div>
                </div>
            </div>
        </div>
    );
};
