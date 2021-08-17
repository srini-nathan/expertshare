import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DevTool } from "@hookform/devtools";
import {
    useAuthState,
    useBuildAssetPath,
    useCRUDHelperFunctions,
    useDataAddEdit,
    useNavigator,
} from "../../../AppModule/hooks";
import {
    AppBreadcrumb,
    AppButton,
    AppCard,
    AppFormActions,
    AppFormInput,
    AppFormInputColorPicker,
    AppFormRadioGroup,
    AppFormTextArea,
    AppLoader,
    AppModal,
    AppPageHeader,
    AppUploader,
} from "../../../AppModule/components";
import { AppLanguageSwitcher } from "../../../AppModule/containers";
import { getTypeOptions, getChartOptions } from "./live-vote-helper";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import {
    LiveVoteQuestion,
    LiveVoteOption,
    SLiveVoteOptionTranslation,
    SLiveVoteQuestionTranslation,
} from "../../models";
import { LiveVoteOptionApi, LiveVoteQuestionApi, SessionApi } from "../../apis";
import {
    SimpleObject,
    UnprocessableEntityErrorResponse,
    Upload,
} from "../../../AppModule/models";
import { schema } from "./schema";
import { useGlobalData } from "../../../AppModule/contexts";

import { LiveVoteOptionTranslation } from "../../models/entities/LiveVoteOptionTranslation";
import { UploadAPI } from "../../../AppModule/apis";
import {
    VoteOptionFileInfo,
    VOTE_OPTION_POSTER_TYPE,
    VOTE_QUESTION_TYPE,
} from "../../../config";
import "./assets/scss/style.scss";
import { LiveVoteQuestionTranslatable } from "./LiveVoteQuestionTranslatable";

export const LiveVoteAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const navigator = useNavigator(navigate);
    const { defaultLanguage, languages } = useGlobalData();
    const { containerResourceId } = useAuthState();
    const { sessionId = null, conferenceId = null } = useParams();
    const sessionResourceId = SessionApi.toResourceUrl(sessionId);
    const [showDelete, setShowDelete] = useState<number>(0);
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
        register,
        watch,
    } = useForm<LiveVoteQuestion>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const voteOptionMediaPath = useBuildAssetPath(VoteOptionFileInfo);
    const { handleDeleteById } = useCRUDHelperFunctions(LiveVoteOptionApi);
    const { findById } = useCRUDHelperFunctions(LiveVoteQuestionApi);
    const backLink =
        conferenceId && sessionId
            ? `/event/${conferenceId}/session/${sessionId}`
            : "/admin/live-votes";

    const submitForm = async (formData: LiveVoteQuestion) => {
        return LiveVoteQuestionApi.createOrUpdate<LiveVoteQuestion>(id, {
            ...formData,
            container: containerResourceId,
            session: sessionId || data.session,
        } as LiveVoteQuestion).then(({ error, errorMessage }) => {
            if (error instanceof UnprocessableEntityErrorResponse) {
                setViolations<LiveVoteQuestion>(error, setError);
            } else if (errorMessage) {
                errorToast(t(errorMessage));
            } else {
                navigator(backLink).then(() => {
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
        if (ids.length > 0) {
            await Promise.all(
                ids.map(async (key) => {
                    const file: File = files[key];
                    const optionIndex = parseInt(key, 10);
                    const fd = new FormData();
                    fd.set("file", file, file.name);
                    fd.set("container", containerResourceId);
                    fd.set("fileType", VOTE_OPTION_POSTER_TYPE);
                    await UploadAPI.createResource<Upload, FormData>(fd).then(
                        ({ errorMessage, response }) => {
                            if (errorMessage) {
                                errorToast(errorMessage);
                            }
                            if (
                                response &&
                                response.fileName &&
                                formData.voteOptions[optionIndex]
                            ) {
                                // eslint-disable-next-line no-console
                                console.table(response);
                                formData.voteOptions[optionIndex].imageName =
                                    response.fileName;
                                // eslint-disable-next-line no-console
                                console.table(
                                    formData.voteOptions[optionIndex]
                                );
                            }
                        }
                    );
                })
            );
        }
        await submitForm(formData);
    };
    const type = watch("type");
    useEffect(() => {
        if (isEditMode && id !== null) {
            setIsLoading(true);
            findById<LiveVoteQuestion>(
                id,
                {
                    "groups[]": "translations",
                },
                {
                    error: "admin.liveVote.form:toast.error.notfound",
                    onSuccess: (response) => {
                        setData(response);
                        trigger();
                    },
                    onCleanup: () => {
                        setIsLoading(false);
                    },
                }
            );
        }
    }, [id]);

    const newlyAddedIds: number[] = [];
    const addNewOption = () => {
        const newOption = LiveVoteOption.createFrom();
        newlyAddedIds.push(newOption.id);
        setData({
            ...data,
            voteOptions: [...data.voteOptions, newOption],
        } as LiveVoteQuestion);
    };

    const handleDelete = (optionId: number) => {
        if (newlyAddedIds.indexOf(optionId) === -1) {
            handleDeleteById(optionId, {
                onCleanup: () => {
                    setShowDelete(0);
                },
                success: "admin.liveVote.form:delete.toast.success",
            });
        } else {
            setShowDelete(0);
            successToast(t("admin.liveVote.form:delete.toast.success"));
        }
        setData({
            ...data,
            voteOptions: data.voteOptions.filter((opt) => opt.id !== optionId),
        } as LiveVoteQuestion);
    };

    if (isLoading) {
        return <AppLoader />;
    }

    return (
        <div className={"live-vote-add-edit-page"}>
            <AppBreadcrumb
                linkText={
                    conferenceId && sessionId
                        ? t("admin.liveVotes.list:header.backToSession")
                        : t("admin.liveVote.list:header.title")
                }
                linkUrl={backLink}
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
                            {...validation("type", formState, isEditMode, true)}
                        />
                    </Form.Row>
                    <Form.Row>
                        <AppFormInput
                            name={"name"}
                            label={t("admin.liveVote.form:label.name")}
                            {...validation("name", formState, isEditMode, true)}
                            defaultValue={data.name}
                            control={control}
                            lg={6}
                            md={6}
                            xl={6}
                        />
                    </Form.Row>
                    <LiveVoteQuestionTranslatable
                        languages={languages}
                        control={control}
                        setValue={setValue}
                        activeLocale={activeLocale}
                        formState={formState}
                        register={register}
                        isEditMode={isEditMode}
                        translations={
                            data.translations as SLiveVoteQuestionTranslation
                        }
                    />
                    <Form.Row>
                        <AppFormRadioGroup
                            name={"chartType"}
                            label={t("admin.liveVote.form:label.chartType")}
                            defaultValue={data.chartType}
                            control={control}
                            required={true}
                            options={getChartOptions(t)}
                            {...validation(
                                "chartType",
                                formState,
                                isEditMode,
                                true
                            )}
                        />
                    </Form.Row>
                </AppCard>
                {type !== VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_TEXT && (
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
                        <AppModal
                            show={showDelete > 0}
                            handleClose={() => {
                                setShowDelete(0);
                            }}
                            handleDelete={() => {
                                handleDelete(showDelete);
                            }}
                            bodyContent={t(
                                "admin.liveVote.form:delete.confirm.message"
                            )}
                            title={t(
                                "admin.liveVote.form:delete.confirm.title"
                            )}
                        />
                    </Row>
                )}
                {type !== VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_TEXT &&
                    data.voteOptions.map((option, oIndex) => {
                        const { id: oId, imageName, val, color } = option;
                        const imageKey = `voteOptions[${oIndex}].imageName` as keyof LiveVoteQuestion;
                        if (imageName) {
                            setValue(imageKey, imageName);
                        }
                        return (
                            <AppCard
                                key={oId}
                                className={"mt-2 p-4 vote-option-card"}
                            >
                                <Row>
                                    <Col className="pb-4">
                                        <Link
                                            to={"#"}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowDelete(oId);
                                            }}
                                        >
                                            <i className="action fak fa-trash-light" />
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className={"p-0"}>
                                        <>
                                            {languages?.map(
                                                ({ locale }, lIndex) => {
                                                    const trans = data
                                                        .voteOptions?.[oIndex]
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

                                                    if (
                                                        locale !== activeLocale
                                                    ) {
                                                        const titleKey = `voteOptions[${oIndex}].translations[${lIndex}].title` as keyof LiveVoteQuestion;
                                                        const desc = `voteOptions[${oIndex}].translations[${lIndex}].description` as keyof LiveVoteQuestion;
                                                        return (
                                                            <div
                                                                key={`${oId}${locale}`}
                                                            >
                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        titleKey
                                                                    )}
                                                                    defaultValue={
                                                                        transData?.title
                                                                    }
                                                                />
                                                                <input
                                                                    type="hidden"
                                                                    {...register(
                                                                        desc
                                                                    )}
                                                                    defaultValue={
                                                                        transData?.description
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div
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
                                                                    isEditMode,
                                                                    true
                                                                )}
                                                                defaultValue={
                                                                    transData?.title
                                                                }
                                                                control={
                                                                    control
                                                                }
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
                                                                    isEditMode,
                                                                    true
                                                                )}
                                                                control={
                                                                    control
                                                                }
                                                                defaultValue={
                                                                    transData?.description
                                                                }
                                                                md={12}
                                                                lg={12}
                                                                xl={12}
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </>
                                        <AppFormInput
                                            name={`voteOptions[${oIndex}].val`}
                                            label={t(
                                                "admin.liveVote.form:label.optionValue"
                                            )}
                                            {...validation(
                                                `voteOptions[${oIndex}].val`,
                                                formState,
                                                isEditMode,
                                                true
                                            )}
                                            defaultValue={val}
                                            control={control}
                                            lg={12}
                                            md={12}
                                            xl={12}
                                        />
                                        <AppFormInputColorPicker
                                            label={t(
                                                "admin.liveVote.form:label.optionColor"
                                            )}
                                            {...register(
                                                `voteOptions[${oIndex}].color` as keyof LiveVoteQuestion
                                            )}
                                            xl={12}
                                            lg={12}
                                            {...validation(
                                                `voteOptions[${oIndex}].color`,
                                                formState,
                                                isEditMode,
                                                true
                                            )}
                                            defaultValue={color || "#FFF"}
                                            control={control}
                                            setValue={setValue}
                                        />
                                    </Col>
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
                                                        [oIndex]:
                                                            selectedFiles[0],
                                                    };
                                                }
                                            }}
                                            onDelete={() => {
                                                setValue(imageKey, "");
                                                option.imageName = "";
                                            }}
                                            confirmation={{
                                                title: t(
                                                    "admin.liveVote.form:deleteImage.confirm.title"
                                                ),
                                                bodyContent: t(
                                                    "admin.liveVote.form:deleteImage.confirm.message"
                                                ),
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
                        backLink={backLink}
                    />
                </Row>
            </Form>
            <DevTool control={control} />
        </div>
    );
};
