import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from "@hookform/devtools";
import {
    useAuthState,
    useDataAddEdit,
    useNavigator,
} from "../../../AppModule/hooks";
import {
    AppBreadcrumb,
    AppButton,
    AppCard,
    AppFormActions,
    AppFormInput,
    AppFormRadioGroup,
    AppFormTextArea,
    AppLoader,
    AppPageHeader,
    AppUploader,
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
import { LiveVoteQuestionApi, SessionApi } from "../../apis";
import {
    FileTypeInfo,
    UnprocessableEntityErrorResponse,
} from "../../../AppModule/models";
import { schema } from "./schema";
import { useGlobalData } from "../../../AppModule/contexts";
import { LiveVoteOption } from "../../models/entities/LiveVoteOption";

export const LiveVotingAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const navigator = useNavigator(navigate);
    const { defaultLanguage, languages } = useGlobalData();
    const { containerResourceId } = useAuthState();
    const { sessionId } = useParams();
    const sessionResourceId = SessionApi.toResourceUrl(sessionId);
    const [activeLocale, setActiveLocale] = useState<string>(
        defaultLanguage?.locale || "en"
    );
    const {
        isLoading,
        setIsLoading,
        isEditMode,
        data,
        setData,
        id,
    } = useDataAddEdit<LiveVoteQuestion>(
        new LiveVoteQuestion(containerResourceId, sessionResourceId)
    );
    const {
        control,
        formState,
        handleSubmit,
        setError,
        trigger,
        register,
    } = useForm<LiveVoteQuestion>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (formData: LiveVoteQuestion) => {
        return LiveVoteQuestionApi.createOrUpdate<LiveVoteQuestion>(id, {
            ...formData,
            container: containerResourceId,
            session: sessionResourceId,
        } as LiveVoteQuestion).then(({ error, errorMessage }) => {
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

    useEffect(() => {
        if (isEditMode && id !== null) {
            setIsLoading(true);
            LiveVoteQuestionApi.findById<LiveVoteQuestion>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast(
                            t("admin.language.form:toast.error.notfound")
                        );
                    } else if (response !== null) {
                        setData(response);
                        trigger();
                    }
                    setIsLoading(false);
                }
            );
        }
    }, [id]);

    const addNewOption = () => {
        setData({
            ...data,
            voteOptions: [...data.voteOptions, LiveVoteOption.createFrom()],
        } as LiveVoteQuestion);
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
                    <AppLanguageSwitcher
                        activeLocale={activeLocale}
                        onChange={(locale) => setActiveLocale(locale)}
                    />
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
                            md={6}
                            lg={6}
                            xl={6}
                        />
                    </Form.Row>
                    <>
                        {languages?.map(({ locale }, index) => {
                            if (locale !== activeLocale) {
                                return <></>;
                            }
                            return (
                                <Form.Row key={locale}>
                                    <input
                                        type="hidden"
                                        {...register(
                                            `translations.${index}.locale`
                                        )}
                                    />
                                    <AppFormInput
                                        name={`translations[${index}].title`}
                                        label={`${t(
                                            "admin.liveVote.form:label.title"
                                        )}(${activeLocale})`}
                                        {...validation(
                                            `translations[${index}].title`,
                                            formState,
                                            isEditMode
                                        )}
                                        defaultValue={
                                            data.translations[index]?.title
                                        }
                                        control={control}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                    />
                                </Form.Row>
                            );
                        })}
                    </>
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
                    <Col className="d-flex justify-content-between">
                        <h2>{t("admin.liveVote.form:header.option")}</h2>
                        <AppButton
                            variant={"secondary"}
                            onClick={() => {
                                addNewOption();
                            }}
                        >
                            + {t("admin.liveVote.form:button.addOption")}
                        </AppButton>
                    </Col>
                </Row>
                {data.voteOptions.map((option, oIndex) => {
                    const { id: oId } = option;
                    return (
                        <AppCard key={oId}>
                            <Row>
                                {languages?.map(({ locale }, lIndex) => {
                                    if (locale !== activeLocale) {
                                        return <></>;
                                    }
                                    return (
                                        <Col
                                            className={"p-0"}
                                            key={`${oId}${locale}`}
                                        >
                                            <input
                                                type="hidden"
                                                {...register(
                                                    `voteOptions.${oIndex}.translations.${lIndex}.locale`
                                                )}
                                            />
                                            <AppFormInput
                                                name={`voteOptions[${oIndex}].translations[${lIndex}].title`}
                                                label={`${t(
                                                    "admin.liveVote.form:label.optionTitle"
                                                )}(${activeLocale})`}
                                                {...validation(
                                                    `voteOptions[${oIndex}].translations[${lIndex}].title`,
                                                    formState,
                                                    isEditMode
                                                )}
                                                defaultValue={
                                                    data.voteOptions[oIndex]
                                                        ?.translations[lIndex]
                                                        ?.title
                                                }
                                                control={control}
                                                md={12}
                                                lg={12}
                                                xl={12}
                                            />
                                            <AppFormTextArea
                                                name={`voteOptions[${oIndex}].translations[${lIndex}].description`}
                                                label={`${t(
                                                    "admin.liveVote.form:label.optionDescription"
                                                )}(${activeLocale})`}
                                                {...validation(
                                                    `voteOptions[${oIndex}].translations[${lIndex}].description`,
                                                    formState,
                                                    isEditMode
                                                )}
                                                control={control}
                                                defaultValue={
                                                    data.voteOptions[oIndex]
                                                        ?.translations[lIndex]
                                                        ?.description
                                                }
                                                md={12}
                                                lg={12}
                                                xl={12}
                                            />
                                        </Col>
                                    );
                                })}
                                <Col className={"p-0"}>
                                    <AppUploader
                                        fileInfo={{} as FileTypeInfo}
                                        onFileSelect={() => {}}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                    );
                })}
                <Row>
                    <AppFormActions
                        navigation={navigator}
                        isEditMode={isEditMode}
                        isLoading={formState.isSubmitting}
                    />
                </Row>
            </Form>
            <DevTool control={control} />
        </Fragment>
    );
};
