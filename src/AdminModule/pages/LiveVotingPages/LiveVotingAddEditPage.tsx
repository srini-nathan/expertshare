import React, { FC, Fragment } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    useAuthState,
    useDataAddEdit,
    useNavigator,
} from "../../../AppModule/hooks";
import {
    AppBreadcrumb,
    AppCard,
    AppFormActions,
    AppFormInput,
    AppFormRadioGroup,
    AppLoader,
    AppPageHeader,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import { getTypeOptions, getChartOptions } from "./live-voting-helper";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import { LiveVoteQuestion } from "../../models/entities/LiveVoteQuestion";
import { LiveVoteQuestionApi } from "../../apis";
import { UnprocessableEntityErrorResponse } from "../../../AppModule/models";
import { schema } from "./schema";

export const LiveVotingAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const { sessionId } = useParams();
    const {
        isLoading,
        isEditMode,
        data,
        id,
    } = useDataAddEdit<LiveVoteQuestion>(
        new LiveVoteQuestion(containerResourceId, sessionId)
    );
    const {
        control,
        formState,
        handleSubmit,
        setError,
    } = useForm<LiveVoteQuestion>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (formData: LiveVoteQuestion) => {
        return LiveVoteQuestionApi.createOrUpdate<LiveVoteQuestion>(
            id,
            formData
        ).then(({ error, errorMessage }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<LiveVoteQuestion>(error, setError);
            } else if (errorMessage) {
                errorToast(t(errorMessage));
            } else {
                navigator("..").then(() => {
                    successToast(
                        isEditMode
                            ? t("admin.liveVote.form:toast.success.edit")
                            : t("admin.liveVote.form:toast.success.add")
                    );
                });
            }
        });
    };

    if (isLoading) {
        return <AppLoader />;
    }

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("admin.liveVotes.list:header.backToSession")}
                linkUrl={".."}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.liveVote.form:header.addTitle")
                        : t("admin.liveVote.form:header.editTitle")
                }
            />
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <AppCard>
                    <AppLanguageSwitcher />
                    <Form.Row>
                        <AppFormRadioGroup
                            name={"type"}
                            defaultValue={data.type}
                            label={t("admin.liveVote.form:label.type")}
                            control={control}
                            required={true}
                            options={getTypeOptions(t)}
                            {...validation("type", formState, isEditMode)}
                            errorMessage={errors.type?.message}
                        />
                    </Form.Row>
                    <Form.Row>
                        <AppFormInput
                            name={"name"}
                            label={t("admin.liveVote.form:label.name")}
                            {...validation("name", formState, isEditMode)}
                            errorMessage={errors.name?.message}
                            defaultValue={data.name}
                            control={control}
                        />
                    </Form.Row>
                    <Form.Row>
                        <AppFormRadioGroup
                            name={"chartType"}
                            label={t("admin.liveVote.form:label.chartType")}
                            defaultValue={data.chartType}
                            control={control}
                            required={true}
                            options={getChartOptions(t)}
                            {...validation("chartType", formState, isEditMode)}
                            errorMessage={errors.chartType?.message}
                        />
                    </Form.Row>
                </AppCard>
                <Row>
                    <AppFormActions
                        navigation={navigator}
                        isEditMode={isEditMode}
                        isLoading={formState.isSubmitting}
                    />
                </Row>
            </Form>
        </Fragment>
    );
};
