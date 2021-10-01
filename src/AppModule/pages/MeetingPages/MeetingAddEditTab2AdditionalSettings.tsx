import React, { FC, Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import { Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { find as _find } from "lodash";
import { Meeting } from "../../models/entities/Meeting";
import {
    AppDatePicker,
    AppFormInput,
    AppFormLabelTranslatable,
    AppFormRadioGroup,
    AppFormSelect,
} from "../../components";
import { getTypeOptions, getIntervalOptions } from "./meeting-helper";
import { getDateTimeWithoutTimezone, validation } from "../../utils";
import { SimpleObject } from "../../models";

interface MeetingAddEditTab2AdditionalSettingsProps {
    data: Meeting;
    form: UseFormReturn<Meeting>;
    isEditMode: boolean;
}

export const MeetingAddEditTab2AdditionalSettings: FC<MeetingAddEditTab2AdditionalSettingsProps> = ({
    data,
    form,
    isEditMode,
}): JSX.Element => {
    const { t } = useTranslation();
    const { formState, control } = form;
    const intervals = getIntervalOptions(t);
    return (
        <Fragment>
            <div className="col-12 my-2">
                <Form.Row>
                    <AppFormRadioGroup
                        name={"type"}
                        defaultValue={data.type}
                        label={t("meeting.form:label.type")}
                        control={control}
                        required={true}
                        block={true}
                        options={getTypeOptions(t)}
                        {...validation("type", formState, isEditMode, true)}
                    />
                </Form.Row>
            </div>
            <div className="col-12 my-2">
                <Form.Row>
                    <Col
                        md={12}
                        lg={6}
                        className="react-datepicker-container mb-2"
                    >
                        <AppFormLabelTranslatable
                            label={"meeting.form:label.startDate"}
                            required={false}
                        />
                        <AppDatePicker
                            dateFormat={"d MMMM yyyy"}
                            {...validation(
                                "startDate",
                                formState,
                                isEditMode,
                                true
                            )}
                            name={"startDate"}
                            control={control}
                            defaultValue={
                                data.startDate
                                    ? getDateTimeWithoutTimezone(data.startDate)
                                    : new Date()
                            }
                        />
                    </Col>
                    <Col
                        md={12}
                        lg={6}
                        className="react-datepicker-container mb-2"
                    >
                        <AppFormLabelTranslatable
                            label={"meeting.form:label.endDate"}
                            required={false}
                        />
                        <AppDatePicker
                            dateFormat={"d MMMM yyyy"}
                            {...validation(
                                "endDate",
                                formState,
                                isEditMode,
                                true
                            )}
                            name={"endDate"}
                            control={control}
                            defaultValue={
                                data.endDate
                                    ? getDateTimeWithoutTimezone(data.endDate)
                                    : new Date()
                            }
                        />
                    </Col>
                </Form.Row>
            </div>
            <div className="col-12">
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
                        defaultValue={`${data.noticePeriod}`}
                        options={intervals}
                        control={control}
                        transform={{
                            output: (option: SimpleObject<string>) => {
                                return option?.value;
                            },
                            input: (value: string) => {
                                return _find(intervals, {
                                    value,
                                });
                            },
                        }}
                    />
                    <AppFormSelect
                        id={"bufferPeriod"}
                        name={"bufferPeriod"}
                        md={6}
                        xl={6}
                        sm={12}
                        label={t("meeting.form:label.bufferPeriod")}
                        className="rm-container"
                        {...validation(
                            "bufferPeriod",
                            formState,
                            isEditMode,
                            true
                        )}
                        placeholder={"bufferPeriod"}
                        defaultValue={`${data.bufferPeriod}`}
                        options={intervals}
                        control={control}
                        transform={{
                            output: (option: SimpleObject<string>) => {
                                return option?.value;
                            },
                            input: (value: string) => {
                                return _find(intervals, {
                                    value,
                                });
                            },
                        }}
                    />
                </Form.Row>
            </div>
            <div className="col-12">
                <Form.Row>
                    <AppFormInput
                        name={"repeatWeek"}
                        type={"number"}
                        label={t("meeting.form:label.repeatWeek")}
                        md={6}
                        xl={6}
                        sm={12}
                        {...validation(
                            "repeatWeek",
                            formState,
                            isEditMode,
                            true
                        )}
                        defaultValue={`${data.repeatWeek}`}
                        control={control}
                    />
                </Form.Row>
            </div>
        </Fragment>
    );
};
