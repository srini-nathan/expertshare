import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Form, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isString as _isString } from "lodash";
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
    SLiveVoteQuestionTranslation,
} from "../../models/entities/LiveVoteQuestion";
import { LiveVoteOptionApi, LiveVoteQuestionApi, SessionApi } from "../../apis";
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
import { VoteOptionFileInfo, VOTE_OPTION_POSTER_TYPE } from "../../../config";
import "./assets/scss/style.scss";

export const LiveVoteAddEditPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const navigator = useNavigator(navigate);
    const { defaultLanguage, languages } = useGlobalData();
    const { containerResourceId } = useAuthState();
    const { sessionId } = useParams();
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
        getValues,
        register,
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
                    fd.set("fileType", VOTE_OPTION_POSTER_TYPE);
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
                    errorToast(t("admin.liveVote.form:toast.error.notfound"));
                } else if (response !== null) {
                    setData(response);
                    trigger();
                }
                setIsLoading(false);
            });
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
            LiveVoteOptionApi.deleteById(optionId)
                .then(({ error }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(t(error));
                        }
                    } else {
                        successToast(
                            t("admin.liveVote.form:delete.toast.success")
                        );
                    }
                })
                .finally(() => {
                    setShowDelete(0);
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
                                const titleKey = `translations[${index}].title` as keyof LiveVoteQuestion;
                                setValue(
                                    titleKey,
                                    getValues(titleKey) || transData.title
                                );
                                return null;
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
                                            isEditMode,
                                            true
                                        )}
                                        control={control}
                                        defaultValue={transData?.title}
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
                            {...validation(
                                "chartType",
                                formState,
                                isEditMode,
                                true
                            )}
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
                    const { id: oId, imageName, val, color } = option;
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

                                                if (locale !== activeLocale) {
                                                    const titleKey = `voteOptions[${oIndex}].translations[${lIndex}].title` as keyof LiveVoteQuestion;
                                                    const desc = `voteOptions[${oIndex}].translations[${lIndex}].description` as keyof LiveVoteQuestion;
                                                    setValue(
                                                        titleKey,
                                                        getValues(titleKey) ||
                                                            transData.title
                                                    );
                                                    setValue(
                                                        desc,
                                                        getValues(desc) ||
                                                            transData.description
                                                    );
                                                    return null;
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
                                                                isEditMode,
                                                                true
                                                            )}
                                                            control={control}
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
                    title={t("admin.liveVote.form:delete.confirm.title")}
                />
                <Row>
                    <AppFormActions
                        isEditMode={isEditMode}
                        navigation={navigator}
                        isLoading={formState.isSubmitting}
                    />
                </Row>
            </Form>
        </div>
    );
};
