import React, { FC, Fragment } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, FormGroup, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
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
    AppFormLabel,
    AppFormRadioGroup,
    AppLoader,
    AppPageHeader,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import { getTypeOptions, getChartOptions } from "./live-voting-helper";
import { validation } from "../../../AppModule/utils";
import { LiveVoteQuestion } from "../../models/entities/LiveVoteQuestion";

export const LiveVotingAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const navigator = useNavigator(navigate);
    const { containerResourceId } = useAuthState();
    const { sessionId } = useParams();
    const { isLoading, isEditMode, data } = useDataAddEdit(
        new LiveVoteQuestion(containerResourceId, sessionId)
    );
    const { control, setValue, formState, handleSubmit } = useForm({
        mode: "all",
    });

    const onSubmit = async (formData: LiveVoteQuestion) => {
        return LanguageApi.createOrUpdate<Language>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<Language>(error, setError);
                } else if (errorMessage) {
                    errorToast(t(errorMessage));
                } else {
                    navigator("..").then(() => {
                        successToast(
                            isEditMode
                                ? t("admin.language.form:toast.success.edit")
                                : t("admin.language.form:toast.success.add")
                        );
                    });
                }
            }
        );
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
                        ? t("admin.liveVotes.form:header.addTitle")
                        : t("admin.liveVotes.form:header.editTitle")
                }
            />
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <AppCard>
                    <AppLanguageSwitcher />
                    <Row>
                        <FormGroup className={"col"}>
                            <AppFormLabel
                                required={true}
                                label={t("admin.liveVoting.form:label.type")}
                            />
                            <AppFormRadioGroup
                                name={"type"}
                                control={control}
                                setValue={setValue}
                                options={getTypeOptions(t)}
                            />
                        </FormGroup>
                    </Row>
                    <Row>
                        <AppFormInput
                            name={"name"}
                            label={t("admin.liveVoting.form:label.name")}
                            {...validation("name", formState, isEditMode)}
                            errorMessage={errors.name?.message}
                            defaultValue={data.name}
                            control={control}
                        />
                    </Row>
                    <Row>
                        <FormGroup className={"col"}>
                            <AppFormLabel
                                required={true}
                                label={t(
                                    "admin.liveVoting:form.chartType.label"
                                )}
                            />
                            <AppFormRadioGroup
                                name={"chartType"}
                                control={control}
                                setValue={setValue}
                                options={getChartOptions(t)}
                            />
                        </FormGroup>
                    </Row>
                </AppCard>
                <Row>
                    <AppFormActions
                        isEditMode={isEditMode}
                        navigation={navigator}
                        isLoading={formState.isSubmitting}
                    />
                </Row>
            </Form>
        </Fragment>
    );
};
