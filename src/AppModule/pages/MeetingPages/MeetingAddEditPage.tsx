import React, { FC, Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "@reach/router";
import { Form, Row } from "react-bootstrap";
import {
    AppBreadcrumb,
    AppButton,
    AppFormActions,
    AppLoader,
    AppPageHeader,
} from "../../components";
import { MeetingAddEditTabs } from "./MeetingAddEditTabs";
import { MeetingAddEditTab1 } from "./MeetingAddEditTab1";
import { MeetingAddEditTab2 } from "./MeetingAddEditTab2";
import { useAuthState, useDataAddEdit, useNavigator } from "../../hooks";
import { Meeting, Duration, Availability } from "../../models/entities/Meeting";
import { schema } from "./schema";
import {
    errorToast,
    getRandomId,
    setViolations,
    successToast,
} from "../../utils";
import "./assets/scss/style.scss";
import { UnprocessableEntityErrorResponse } from "../../models";
import { MeetingApi } from "../../apis/MeetingApi";
import { MEETING_PROVIDER } from "../../../config";
import { storableTime } from "./meeting-helper";

export const MeetingAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const { clientResourceId, userResourceId } = useAuthState();
    const [active, setActive] = useState<number>(1);
    const {
        hookForm,
        isEditMode,
        data,
        id,
        setData,
        setIsLoading,
        isLoading,
    } = useDataAddEdit<Meeting>(
        new Meeting(clientResourceId, userResourceId),
        schema()
    );
    const { formState, handleSubmit, setError, trigger } = hookForm;
    const navigator = useNavigator(navigate);
    const [durations, setDurations] = useState<Duration[]>([]);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);

    useEffect(() => {
        if (isEditMode && id) {
            setIsLoading(true);
            MeetingApi.findById<Meeting>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(t(errorMessage));
                    } else if (isNotFound) {
                        errorToast(t("meeting.form:notfound.error.message"));
                    } else if (response !== null) {
                        setData(response);
                        trigger();
                    }
                    setIsLoading(false);
                }
            );
        }
    }, [id, isEditMode, trigger]);

    const onSubmit = async (formData) => {
        formData.provider = MEETING_PROVIDER.PROVIDER_MEET;
        const drs = formData.duration as Duration[];
        formData.duration = drs.map((dr) => {
            const { hours, minutes } = dr;
            const total = minutes + hours * 60;
            return `${total}`;
        });
        const avails = formData.availability as Availability[];
        formData.availability = avails.map((dr) => {
            const { day, start, end } = dr;
            return {
                day,
                start: storableTime(`${start}`),
                end: storableTime(`${end}`),
            };
        });

        return MeetingApi.createOrUpdate<Meeting>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Meeting>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode
                                ? t("meeting.form:updated.info.message")
                                : t("meeting.form:created.info.message")
                        );
                    });
                }
            }
        );
    };

    const addDuration = () => {
        setDurations([
            ...durations,
            {
                hours: 0,
                minutes: 45,
                id: getRandomId(),
            },
        ]);
    };

    const removeDuration = (durationId: number) => {
        setDurations(durations.filter((d) => d.id !== durationId));
    };

    const initDuration = () => {
        const rawObjects: Duration[] = data?.duration.map((dur) => {
            const d = parseInt(dur, 10);
            const hours = Math.floor(d / 60);
            const minutes = Math.floor(d % 60);

            return {
                hours,
                minutes,
                id: getRandomId(),
            };
        });
        setDurations(rawObjects);
    };

    const initAvailability = () => {
        const rawObjects: Availability[] = data?.availability.map(
            ({ day, start, end }) => {
                const timeStart = start.split(":").join("");
                const timeEnd = end.split(":").join("");

                return {
                    day,
                    start: timeStart,
                    end: timeEnd,
                    id: getRandomId(),
                };
            }
        );
        setAvailabilities(rawObjects);
    };

    const addAvailability = () => {
        setAvailabilities([
            ...availabilities,
            {
                day: 1,
                start: "0100",
                end: "1100",
                id: getRandomId(),
            },
        ]);
    };

    const removeAvailability = (availabilityId: number) => {
        setAvailabilities(
            availabilities.filter((d) => d.id !== availabilityId)
        );
    };

    useEffect(() => {
        initDuration();
        initAvailability();
    }, [data]);

    if (isLoading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("meeting.list:header.title")}
                linkUrl={"/meetings"}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("meeting.form:header.title.edit")
                        : t("meeting.form:header.title.add")
                }
            ></AppPageHeader>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="schedule-meeting--container mb-3">
                    <div className="inner-content card">
                        <MeetingAddEditTabs
                            defaultActiveTab={1}
                            onChangeTab={(tab) => {
                                setActive(tab);
                            }}
                        />
                        <div
                            className="inner-content--steps tab-content"
                            id="myTabContent"
                        >
                            <MeetingAddEditTab1
                                active={active}
                                form={hookForm}
                                data={data}
                                isEditMode={isEditMode}
                            />
                            <MeetingAddEditTab2
                                active={active}
                                form={hookForm}
                                data={data}
                                isEditMode={isEditMode}
                                addDuration={addDuration}
                                removeDuration={removeDuration}
                                durations={durations}
                                availabilities={availabilities}
                                addAvailability={addAvailability}
                                removeAvailability={removeAvailability}
                            />
                        </div>
                    </div>
                </div>
                <Row>
                    {active === 1 ? (
                        <div className="d-flex justify-content-end footer-action w-100 p-3">
                            <AppButton
                                type="button"
                                variant={"secondary"}
                                className="mr-4"
                                onClick={() => navigator("..").then()}
                            >
                                {t("common.button:cancel")}
                            </AppButton>
                            <AppButton
                                type="button"
                                onClick={() => {
                                    setActive(2);
                                }}
                            >
                                {t("common.button:next")}
                            </AppButton>
                        </div>
                    ) : (
                        <AppFormActions
                            isEditMode={isEditMode}
                            navigation={navigator}
                            backLink={".."}
                            isLoading={formState.isSubmitting}
                        />
                    )}
                </Row>
            </Form>
        </Fragment>
    );
};
