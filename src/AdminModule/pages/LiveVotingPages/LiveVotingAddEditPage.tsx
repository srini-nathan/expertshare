import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    useAuthState,
    useBuildAssetPath,
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
import {
    LiveVoteQuestion,
    SLiveVoteQuestionTranslation,
} from "../../models/entities/LiveVoteQuestion";
import { LiveVoteQuestionApi, SessionApi } from "../../apis";
import {
    SimpleObject,
    UnprocessableEntityErrorResponse,
    Upload,
} from "../../../AppModule/models";
import { schema } from "./schema";
import { useGlobalData } from "../../../AppModule/contexts";
import {
    LiveVoteOption,
    SLiveVoteOptionTranslation,
} from "../../models/entities/LiveVoteOption";
import { LiveVoteOptionTranslation } from "../../models/entities/LiveVoteOptionTranslation";
import { LiveVoteQuestionTranslation } from "../../models/entities/LiveVoteQuestionTranslation";
import { UploadAPI } from "../../../AppModule/apis";
import { VoteOptionFileInfo, VOTE_OPTION_MEDIA_TYPE } from "../../../config";

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
        setValue,
    } = useForm<LiveVoteQuestion>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const voteOptionMediaPath = useBuildAssetPath(VoteOptionFileInfo);

    const submitForm = async (formData: LiveVoteQuestion) => {
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
    let files: SimpleObject<File> = {};

    const onSubmit = async (formData: LiveVoteQuestion) => {
        const ids = Object.keys(files);
        // eslint-disable-next-line no-console
        console.log(files, "files");
        if (ids.length > 0) {
            await Promise.all(
                ids.map(async (optionId) => {
                    const file: File = files[optionId];
                    const voteOption = formData.voteOptions.find(
                        (option) => option.id === parseInt(optionId, 10)
                    );
                    const fd = new FormData();
                    fd.set("file", file, file.name);
                    fd.set("container", containerResourceId);
                    fd.set("fileType", VOTE_OPTION_MEDIA_TYPE);
                    await UploadAPI.createResource<Upload, FormData>(fd).then(
                        ({ errorMessage, response }) => {
                            if (errorMessage) {
                                errorToast(errorMessage);
                            }
                            if (voteOption && response && response.fileName) {
                                voteOption.imageName = response.fileName;
                            }
                        }
                    );
                })
            );
        }
        await submitForm(formData);
    };

    useEffect(() => {
        if (isEditMode && id !== null) {
            setIsLoading(true);
            LiveVoteQuestionApi.findById<LiveVoteQuestion>(id, {
                "groups[]": "translations",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast(t("admin.language.form:toast.error.notfound"));
                } else if (response !== null) {
                    setData(response);
                    trigger();
                }
                setIsLoading(false);
            });
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
                    <>{}</>
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
                            const trans = data.translations as SLiveVoteQuestionTranslation;
                            const transData =
                                trans?.[locale] ??
                                LiveVoteQuestionTranslation.createFrom(locale);

                            setValue(
                                `translations[${index}].locale` as keyof LiveVoteQuestion,
                                locale
                            );

                            if (locale !== activeLocale) {
                                setValue(
                                    `translations[${index}].title` as keyof LiveVoteQuestion,
                                    transData.title
                                );
                                return <></>;
                            }

                            return (
                                <Form.Row key={locale}>
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
                                        defaultValue={transData?.title}
                                        control={control}
                                        lg={6}
                                        md={6}
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
                    const { id: oId, imageName } = option;
                    return (
                        <AppCard key={oId}>
                            <Row>
                                {languages?.map(({ locale }, lIndex) => {
                                    const trans = data.voteOptions?.[oIndex]
                                        ?.translations as SLiveVoteOptionTranslation;
                                    const transData =
                                        trans?.[locale] ??
                                        LiveVoteOptionTranslation.createFrom(
                                            locale
                                        );
                                    setValue(
                                        `voteOptions[${oIndex}].translations[${lIndex}].locale` as keyof LiveVoteQuestion,
                                        locale
                                    );

                                    if (locale !== activeLocale) {
                                        setValue(
                                            `voteOptions[${oIndex}].translations[${lIndex}].title` as keyof LiveVoteQuestion,
                                            transData.title
                                        );
                                        setValue(
                                            `voteOptions[${oIndex}].translations[${lIndex}].description` as keyof LiveVoteQuestion,
                                            transData.description
                                        );
                                        return <></>;
                                    }

                                    return (
                                        <Col
                                            className={"p-0"}
                                            key={`${oId}${locale}`}
                                        >
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
                                                defaultValue={transData?.title}
                                                control={control}
                                                lg={12}
                                                md={12}
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
                                                    transData?.description
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
                                        withCropper
                                        fileInfo={VoteOptionFileInfo}
                                        imagePath={
                                            imageName
                                                ? `${voteOptionMediaPath}/${imageName}`
                                                : ""
                                        }
                                        accept="image/*"
                                        onFileSelect={(selectedFiles) => {
                                            if (selectedFiles.length > 0) {
                                                files = {
                                                    ...files,
                                                    [oId]: selectedFiles[0],
                                                };
                                            }
                                        }}
                                        onDelete={() => {
                                            option.imageName = "";
                                        }}
                                    />
                                </Col>
                            </Row>
                        </AppCard>
                    );
                })}
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
