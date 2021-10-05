import React, { FC, Fragment, useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { find as _find } from "lodash";
import { addWeeks } from "date-fns";
import { Meeting } from "../../models/entities/Meeting";
import {
    AppDatePicker,
    AppFormInput,
    AppFormLabelTranslatable,
    AppFormRadioGroup,
    AppFormSelect,
    AppFormSwitch,
} from "../../components";
import { getTypeOptions, getIntervalOptions } from "./meeting-helper";
import { getDateTimeWithoutTimezone, validation } from "../../utils";
import { SimpleObject } from "../../models";
import { MEETING_TYPE } from "../../../config";

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
    const { formState, control, setValue, getValues } = form;
    const intervals = getIntervalOptions(t);
    const type = useWatch({
        control,
        name: "type",
        defaultValue: MEETING_TYPE.TYPE_SINGLE,
    });
    const repeatWeek = useWatch({
        control,
        name: "repeatWeek",
        defaultValue: 1,
    });

    useEffect(() => {
        const startDate = getValues("startDate");
        if (type === MEETING_TYPE.TYPE_SINGLE && startDate) {
            setValue("endDate", addWeeks(new Date(startDate), 1));
            setValue("repeatWeek", 1);
        } else if (type === MEETING_TYPE.TYPE_REPEAT_WEEKLY) {
            setValue("repeatWeek", 2);
        } else if (startDate) {
            setValue("endDate", addWeeks(new Date(startDate), 1));
            setValue("repeatWeek", 0);
        }
    }, [type]);

    useEffect(() => {
        if (type === MEETING_TYPE.TYPE_REPEAT_WEEKLY) {
            const startDate = getValues("startDate");
            setValue("endDate", addWeeks(new Date(startDate), repeatWeek));
        }
    }, [repeatWeek]);
    const { errors } = formState;
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
                            required={true}
                        />
                        <AppDatePicker
                            dateFormat={"d MMMM yyyy"}
                            required={true}
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
                                    ? getDateTimeWithoutTimezone(
                                          data.startDate as string
                                      )
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
                            required={true}
                        />
                        <AppDatePicker
                            dateFormat={"d MMMM yyyy"}
                            required={true}
                            disabled={type !== MEETING_TYPE.TYPE_REPEAT_CUSTOM}
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
                                    ? getDateTimeWithoutTimezone(
                                          data.endDate as string
                                      )
                                    : addWeeks(new Date(), 1)
                            }
                        />
                        <Form.Control.Feedback
                            className={
                                errors?.endDate?.message ? "d-block" : ""
                            }
                            type="invalid"
                        >
                            {errors?.endDate?.message}
                        </Form.Control.Feedback>
                    </Col>
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
                        disabled={type !== MEETING_TYPE.TYPE_REPEAT_WEEKLY}
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
                    <AppFormSwitch
                        name={"isBookOnce"}
                        label={t("meeting.form:label.isBookOnce")}
                        {...validation(
                            "isBookOnce",
                            formState,
                            isEditMode,
                            true
                        )}
                        defaultChecked={data.isBookOnce}
                        control={control}
                    />
                </Form.Row>
            </div>
        </Fragment>
    );
};
