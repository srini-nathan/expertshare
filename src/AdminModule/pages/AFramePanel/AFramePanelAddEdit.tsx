import React, { FC, Fragment, useState, useEffect, useRef } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Canceler } from "axios";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { find as _find, isString as _isString } from "lodash";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppFormActions,
    AppCard,
    AppUploader,
    AppFormSwitch,
    AppFormInput,
    AppLoader,
    AppFormSelect,
    AppFormInputColorPicker,
    AppFormFile,
    AppFormRichTextArea,
    AppButton,
    AppFormLabel,
} from "../../../AppModule/components";
import {
    Upload,
    PrimitiveObject,
    UnprocessableEntityErrorResponse,
    FileTypeInfo,
} from "../../../AppModule/models";
import { AFramePanel, PAFramePanel, PAFrameRoom, Language } from "../../models";
import {
    AFramePanelApi,
    ContainerApi,
    AFrameRoomApi,
    LanguageApi,
} from "../../apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../../AppModule/utils";
import {
    useParamId,
    useNavigator,
    useAuthState,
    useBuildAssetPath,
} from "../../../AppModule/hooks";
import { schema, validations } from "./schema";
import { CONSTANTS } from "../../../config";
import { UploadAPI } from "../../../AppModule/apis";

interface TranslationsType {
    locale: string;
    textValue: string;
    content: string;
    image: string;
}

const {
    Upload: UPLOAD,
    AFramePanel: { REMOTE, TARGETTYPE, TARGETACTION, TYPE },
} = CONSTANTS;

const {
    FILETYPE: { FILETYPE_AFRAMEPANEL_MEDIA },
    FILETYPEINFO: { FILETYPEINFO_AFRAMEPANEL_MEDIA },
} = UPLOAD;

const remoteAnimationTypeOptions: PrimitiveObject[] = Object.entries(
    REMOTE
).map(([, value]) => ({
    value,
    label: value,
}));

const targetTypeOptions: PrimitiveObject[] = Object.entries(TARGETTYPE).map(
    ([, value]) => ({
        value,
        label: value,
    })
);

const targetActionOptions: PrimitiveObject[] = Object.entries(TARGETACTION).map(
    ([, value]) => ({
        value,
        label: value,
    })
);

const typeOptions: PrimitiveObject[] = Object.entries(TYPE).map(
    ([, value]) => ({
        value,
        label: value,
    })
);

const {
    height,
    width,
    depth,
    padding,
    opacity,
    pX,
    pY,
    pZ,
    rX,
    rY,
    rZ,
    sX,
    sY,
    sZ,
    remotePosX,
    remotePosY,
    remotePosZ,
    remoteScaX,
    remoteScaY,
    remoteScaZ,
    remoteRotX,
    remoteRotY,
    remoteRotZ,
    remoteAnimationSpeed,
    textValue,
    textWidth,
    textPosX,
    textPosY,
    textPosZ,
    textScaX,
    textScaY,
    textScaZ,
    textRotX,
    textRotY,
    textRotZ,
    targetUrl,
    content,
} = validations;

export const AFramePanelAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const { roomId, panelType } = useParams();

    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<PAFramePanel>(
        new AFramePanel(containerResourceId)
    );
    const [filesToUpload, setFilesToUpload] = useState<{
        [key: string]: File[] | null;
    }>({});
    const aframepanelImagePath = useBuildAssetPath(
        FILETYPEINFO_AFRAMEPANEL_MEDIA as FileTypeInfo
    );

    const [loading, setLoading] = useState<boolean>(isEditMode);
    const [loadingForRooms, setLoadingForRooms] = useState<boolean>(true);
    const { t } = useTranslation();
    const [targetIdOptions, setTargetIdOptions] = useState<PrimitiveObject[]>(
        []
    );

    const [languages, setLanguages] = useState<Language[]>([]);
    const [loadingLanguages, setLoadingLanguages] = useState<boolean>(true);
    const [defaultLanguage, setDefaultLanguage] = useState<string>("");
    const [translations, setTranslations] = useState<TranslationsType[]>([]);
    const [active, setActive] = React.useState<string>(defaultLanguage);

    const [
        transitionVideoFileName,
        setTransitionVideoFileName,
    ] = useState<string>("");

    const [sourceVideoFileName, setSourceVideoFileName] = useState<string>("");

    const {
        handleSubmit,
        setError,
        trigger,
        formState,
        control,
        setValue,
    } = useForm<AFramePanel>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const checkTranslation = () => {
        // return !translations.some(
        //     (translation) =>
        //         !translation.content &&
        //         !translation.textValue &&
        //         !translation.image
        // );
        return true;
    };

    const fileUpload = (fieldName: string, files: File[]) => {
        if (files && files.length > 0) {
            const fd = new FormData();
            fd.set("file", files[0], files[0].name);
            fd.set("fileType", FILETYPE_AFRAMEPANEL_MEDIA);

            UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ errorMessage, response }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    }

                    if (response && response.fileName) {
                        successToast("Image uploaded");
                        if (fieldName === "transitionVideo") {
                            setTransitionVideoFileName(response.fileName);
                        }
                        if (fieldName === "source") {
                            setSourceVideoFileName(response.fileName);
                        }
                    }
                }
            );
        }
    };

    const onFileSelect = (fieldName: string) => (selectedFiles: File[]) => {
        if (fieldName === "transitionVideo" || fieldName === "source") {
            fileUpload(fieldName, selectedFiles);
        }
        setFilesToUpload({ ...filesToUpload, [fieldName]: selectedFiles });
    };

    const getPanelType = () => {
        // eslint-disable-next-line no-console
        console.log(panelType);
        switch (panelType) {
            case "screen":
                return "iframe";
            case "door":
                return "room";
            default:
                return panelType;
        }
    };

    const getValue = (name: string): any => {
        const translationItem = translations.filter((e) => e.locale === active);

        if (translationItem.length > 0) {
            if (name === "textValue") {
                return translationItem[0].textValue;
            }
            if (name === "content") {
                return translationItem[0].content;
            }
            if (name === "image") {
                return translationItem[0].image;
            }
        }

        return "";
    };

    const submitForm = async (formData: AFramePanel) => {
        if (checkTranslation()) {
            setFilesToUpload({});
            formData.container = ContainerApi.toResourceUrl(containerId);
            formData.aFrameRoom = `/api/a_frame_rooms/${roomId}`;
            formData.type = panelType;
            formData.targetType = getPanelType();
            formData.transitionVideo = transitionVideoFileName;

            return AFramePanelApi.createOrUpdate<AFramePanel>(
                id,
                formData
            ).then(({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<AFramePanel>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("/admin/rooms").then(() => {
                        successToast(
                            isEditMode ? "Panels updated" : "Panels created"
                        );
                    });
                }
            });
        }
        return Promise.reject();
    };

    const onTranslatedFieldChange = (field: any, value: any) => {
        const newTranslations = translations.map(
            (translationItem: TranslationsType) => {
                if (translationItem.locale === active) {
                    return {
                        ...translationItem,
                        [field]: value,
                    };
                }
                return translationItem;
            }
        );

        setTranslations(newTranslations);
    };

    const onSubmit = async (formData: AFramePanel) => {
        formData.translations = translations;
        Promise.all(
            [...translations, { fieldName: "remoteImage" }].map((item: any) => {
                if (item.locale && typeof item.image === "string") {
                    return true;
                }

                const files = item.locale
                    ? item.image
                    : filesToUpload[item.fieldName];

                if (files && files.length > 0) {
                    const fd = new FormData();
                    fd.set("file", files[0], files[0].name);
                    fd.set("fileType", FILETYPE_AFRAMEPANEL_MEDIA);

                    return UploadAPI.createResource<Upload, FormData>(fd).then(
                        ({ errorMessage, response }) => {
                            if (errorMessage) {
                                errorToast(errorMessage);
                            }

                            if (response && response.fileName) {
                                successToast("Image uploaded");

                                if (item.fieldName) {
                                    (formData as any)[item.fieldName] =
                                        response.fileName;
                                }

                                if (item.locale) {
                                    formData.translations = formData.translations.map(
                                        (translationItem: TranslationsType) => {
                                            if (
                                                translationItem.locale ===
                                                item.locale
                                            ) {
                                                return {
                                                    ...translationItem,
                                                    image: response.fileName as string,
                                                };
                                            }
                                            return translationItem;
                                        }
                                    );
                                }

                                return true;
                            }

                            return false;
                        }
                    );
                }
                return true;
            })
        ).then((results: boolean[]) => {
            if (results.every((result: boolean) => result)) {
                submitForm(formData);
            }
        });
    };

    useEffect(() => {
        if (isEditMode) {
            AFramePanelApi.findById<AFramePanel>(id, {
                "groups[]": "translations",
            }).then(({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("data not exist");
                } else if (response !== null) {
                    setData(response);
                    trigger();
                    setTransitionVideoFileName(response.transitionVideo || "");

                    if (response.translations) {
                        const items: TranslationsType[] = Object.keys(
                            response.translations
                        ).map((key) => {
                            return {
                                locale: key,
                                content: response.translations[key].content,
                                textValue: response.translations[key].textValue,
                                image: response.translations[key].image,
                            };
                        });

                        setTranslations(items);
                    }
                }
                setLoading(false);
            });
        }
    }, [id, isEditMode, trigger]);

    useEffect(() => {
        setLoadingForRooms(true);
        AFrameRoomApi.find<PAFrameRoom>(
            1,
            {
                "container.id": containerId,
            },
            (c: any) => {
                cancelTokenSourcesRef.current.push(c);
            }
        ).then(({ response, error }) => {
            setLoadingForRooms(false);
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                const targetRoomOptions = response.items.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setTargetIdOptions(targetRoomOptions as any);
            }
        });
    }, []);

    useEffect(() => {
        languages.forEach((language) => {
            if (language.isDefault) {
                setDefaultLanguage(language.locale);
                setActive(language.locale);
            }
        });
        if (languages.length !== translations.length) {
            const items: TranslationsType[] = languages.map((languageItem) => {
                let item = {
                    locale: languageItem.locale,
                    content: "",
                    image: "",
                    textValue: "",
                };
                translations.forEach((translationItem) => {
                    if (translationItem.locale === languageItem.locale) {
                        item = {
                            locale: translationItem.locale,
                            content: translationItem.content,
                            image: translationItem.image,
                            textValue: translationItem.textValue,
                        };
                    }
                });
                return item;
            });
            setTranslations(items);
        }
    }, [languages]);

    useEffect(() => {
        LanguageApi.find<Language>(1, {
            "container.id": containerId,
            "order[isDefault]": "desc",
        }).then(({ error, response }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setLanguages(response.items);
            }
            setLoadingLanguages(false);
        });
    }, []);

    const { errors } = formState;

    if (loading || loadingForRooms || loadingLanguages) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb linkText={"Panels"} linkUrl={".."} />
            <AppPageHeader title={isEditMode ? "Edit Panels" : "Add Panels"} />
            <Row className="aframepanel-add-edit-container">
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <>
                                <Form.Row>
                                    <Col md={12}>
                                        <AppFormLabel
                                            label={t(
                                                "common.label:chooseLanguage"
                                            )}
                                            required
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row className="mb-4">
                                    {languages.map(
                                        (language: Language, i: number) => {
                                            return (
                                                <AppButton
                                                    className={`mr-2 ${
                                                        active ===
                                                        language.locale
                                                            ? "active"
                                                            : ""
                                                    } ${language.locale}`}
                                                    onClick={() => {
                                                        setActive(
                                                            language.locale
                                                        );
                                                    }}
                                                    variant="secondary"
                                                    key={i}
                                                >
                                                    <i></i>
                                                    {language.name}
                                                </AppButton>
                                            );
                                        }
                                    )}
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group className={"col w-100"}>
                                        <Form.Label>
                                            {`${t(
                                                "admin.aframepanel.form:label.image"
                                            )} (${active})`}
                                        </Form.Label>
                                        <AppUploader
                                            accept="image/*"
                                            {...(typeof getValue("image") ===
                                            "string"
                                                ? {
                                                      imagePath: `${aframepanelImagePath}/${getValue(
                                                          "image"
                                                      )}`,
                                                  }
                                                : {})}
                                            {...(typeof getValue("image") !==
                                            "string"
                                                ? {
                                                      externalFiles: getValue(
                                                          "image"
                                                      ),
                                                  }
                                                : {})}
                                            onFileSelect={(files: File[]) =>
                                                onTranslatedFieldChange(
                                                    "image",
                                                    files
                                                )
                                            }
                                            onDelete={() => {
                                                setValue("image", "");
                                                setFilesToUpload({
                                                    ...filesToUpload,
                                                    image: null,
                                                });
                                                setData({
                                                    ...data,
                                                    image: "",
                                                });
                                            }}
                                            fileInfo={
                                                FILETYPEINFO_AFRAMEPANEL_MEDIA as FileTypeInfo
                                            }
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <AppFormInput
                                        name={"height"}
                                        label={t(
                                            "admin.aframepanel.form:label.height"
                                        )}
                                        maxCount={height.max}
                                        {...validation(
                                            "height",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.height?.message}
                                        defaultValue={data.height}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"width"}
                                        label={t(
                                            "admin.aframepanel.form:label.width"
                                        )}
                                        maxCount={width.max}
                                        {...validation(
                                            "width",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.width?.message}
                                        defaultValue={data.width}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"depth"}
                                        label={t(
                                            "admin.aframepanel.form:label.depth"
                                        )}
                                        maxCount={depth.max}
                                        {...validation(
                                            "depth",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.depth?.message}
                                        defaultValue={data.depth}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"padding"}
                                        label={t(
                                            "admin.aframepanel.form:label.padding"
                                        )}
                                        maxCount={padding.max}
                                        {...validation(
                                            "padding",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.padding?.message}
                                        defaultValue={data.padding}
                                        control={control}
                                    />
                                    <AppFormInputColorPicker
                                        label={t(
                                            "admin.aframepanel.form:label.color"
                                        )}
                                        name={"color"}
                                        errorMessage={errors.color?.message}
                                        defaultValue={data.color}
                                        control={control}
                                        setValue={setValue}
                                        {...validation(
                                            "color",
                                            formState,
                                            isEditMode
                                        )}
                                    />
                                    <AppFormInput
                                        name={"opacity"}
                                        label={t(
                                            "admin.aframepanel.form:label.opacity"
                                        )}
                                        maxCount={opacity.max}
                                        {...validation(
                                            "opacity",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.opacity?.message}
                                        defaultValue={data.opacity}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <AppFormInput
                                        name={"pX"}
                                        label={t(
                                            "admin.aframepanel.form:label.pX"
                                        )}
                                        maxCount={pX.max}
                                        {...validation(
                                            "pX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.pX?.message}
                                        defaultValue={data.pX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"pY"}
                                        label={t(
                                            "admin.aframepanel.form:label.pY"
                                        )}
                                        maxCount={pY.max}
                                        {...validation(
                                            "pY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.pY?.message}
                                        defaultValue={data.pY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"pZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.pZ"
                                        )}
                                        maxCount={pZ.max}
                                        {...validation(
                                            "pZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.pZ?.message}
                                        defaultValue={data.pZ}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"rX"}
                                        label={t(
                                            "admin.aframepanel.form:label.rX"
                                        )}
                                        maxCount={rX.max}
                                        {...validation(
                                            "rX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.rX?.message}
                                        defaultValue={data.rX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"rY"}
                                        label={t(
                                            "admin.aframepanel.form:label.rY"
                                        )}
                                        maxCount={rY.max}
                                        {...validation(
                                            "rY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.rY?.message}
                                        defaultValue={data.rY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"rZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.rZ"
                                        )}
                                        maxCount={rZ.max}
                                        {...validation(
                                            "rZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.rZ?.message}
                                        defaultValue={data.rZ}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"sX"}
                                        label={t(
                                            "admin.aframepanel.form:label.sX"
                                        )}
                                        maxCount={sX.max}
                                        {...validation(
                                            "sX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.sX?.message}
                                        defaultValue={data.sX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"sY"}
                                        label={t(
                                            "admin.aframepanel.form:label.sY"
                                        )}
                                        maxCount={sY.max}
                                        {...validation(
                                            "sY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.sY?.message}
                                        defaultValue={data.sY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        name={"sZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.sZ"
                                        )}
                                        maxCount={sZ.max}
                                        {...validation(
                                            "sZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.sZ?.message}
                                        defaultValue={data.sZ}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <AppFormSwitch
                                        required={false}
                                        name={"isRemoteDisabled"}
                                        label={t(
                                            "admin.aframepanel.form:label.isRemoteDisabled"
                                        )}
                                        {...validation(
                                            "isRemoteDisabled",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.isRemoteDisabled?.message
                                        }
                                        defaultChecked={data.isRemoteDisabled}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group className={"col w-100"}>
                                        <Form.Label>
                                            {t(
                                                "admin.aframepanel.form:label.remoteImage"
                                            )}
                                        </Form.Label>
                                        <AppUploader
                                            accept="image/*"
                                            imagePath={
                                                data.remoteImage
                                                    ? `${aframepanelImagePath}/${data.remoteImage}`
                                                    : ""
                                            }
                                            onFileSelect={onFileSelect(
                                                "remoteImage"
                                            )}
                                            onDelete={() => {
                                                setValue("remoteImage", "");
                                                setFilesToUpload({
                                                    ...filesToUpload,
                                                    remoteImage: null,
                                                });
                                                setData({
                                                    ...data,
                                                    remoteImage: "",
                                                });
                                            }}
                                            fileInfo={
                                                FILETYPEINFO_AFRAMEPANEL_MEDIA as FileTypeInfo
                                            }
                                        />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <AppFormInput
                                        required={false}
                                        name={"remotePosX"}
                                        label={t(
                                            "admin.aframepanel.form:label.remotePosX"
                                        )}
                                        maxCount={remotePosX.max}
                                        {...validation(
                                            "remotePosX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remotePosX?.message
                                        }
                                        defaultValue={data.remotePosX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remotePosY"}
                                        label={t(
                                            "admin.aframepanel.form:label.remotePosY"
                                        )}
                                        maxCount={remotePosY.max}
                                        {...validation(
                                            "remotePosY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remotePosY?.message
                                        }
                                        defaultValue={data.remotePosY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remotePosZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.remotePosZ"
                                        )}
                                        maxCount={remotePosZ.max}
                                        {...validation(
                                            "remotePosZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remotePosZ?.message
                                        }
                                        defaultValue={data.remotePosZ}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remoteScaX"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteScaX"
                                        )}
                                        maxCount={remoteScaX.max}
                                        {...validation(
                                            "remoteScaX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteScaX?.message
                                        }
                                        defaultValue={data.remoteScaX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remoteScaY"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteScaY"
                                        )}
                                        maxCount={remoteScaY.max}
                                        {...validation(
                                            "remoteScaY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteScaY?.message
                                        }
                                        defaultValue={data.remoteScaY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remoteScaZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteScaZ"
                                        )}
                                        maxCount={remoteScaZ.max}
                                        {...validation(
                                            "remoteScaZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteScaZ?.message
                                        }
                                        defaultValue={data.remoteScaZ}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remoteRotX"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteRotX"
                                        )}
                                        maxCount={remoteRotX.max}
                                        {...validation(
                                            "remoteRotX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteRotX?.message
                                        }
                                        defaultValue={data.remoteRotX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remoteRotY"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteRotY"
                                        )}
                                        maxCount={remoteRotY.max}
                                        {...validation(
                                            "remoteRotY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteRotY?.message
                                        }
                                        defaultValue={data.remoteRotY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"remoteRotZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteRotZ"
                                        )}
                                        maxCount={remoteRotZ.max}
                                        {...validation(
                                            "remoteRotZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteRotZ?.message
                                        }
                                        defaultValue={data.remoteRotZ}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <AppFormSwitch
                                        required={false}
                                        name={"isRemoteAnimationDisabled"}
                                        label={t(
                                            "admin.aframepanel.form:label.isRemoteAnimationDisabled"
                                        )}
                                        {...validation(
                                            "isRemoteAnimationDisabled",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.isRemoteAnimationDisabled
                                                ?.message
                                        }
                                        defaultChecked={
                                            data.isRemoteAnimationDisabled
                                        }
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <AppFormSelect
                                        required={false}
                                        id={"remoteAnimationType"}
                                        name={"remoteAnimationType"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteAnimationType"
                                        )}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        {...validation(
                                            "remoteAnimationType",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteAnimationType?.message
                                        }
                                        defaultValue={
                                            data.remoteAnimationType as any
                                        }
                                        options={remoteAnimationTypeOptions}
                                        control={control}
                                        transform={{
                                            output: (
                                                template: PrimitiveObject
                                            ) => {
                                                setValue(
                                                    "remoteAnimationType",
                                                    template?.value as string
                                                );
                                                return template?.value;
                                            },
                                            input: (value: string) => {
                                                return _find(
                                                    remoteAnimationTypeOptions,
                                                    {
                                                        value,
                                                    }
                                                );
                                            },
                                        }}
                                    />
                                    <AppFormInput
                                        required={false}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        name={"remoteAnimationSpeed"}
                                        label={t(
                                            "admin.aframepanel.form:label.remoteAnimationSpeed"
                                        )}
                                        maxCount={remoteAnimationSpeed.max}
                                        {...validation(
                                            "remoteAnimationSpeed",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.remoteAnimationSpeed?.message
                                        }
                                        defaultValue={data.remoteAnimationSpeed?.toString()}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <AppFormSwitch
                                        required={false}
                                        name={"isTextDisabled"}
                                        label={t(
                                            "admin.aframepanel.form:label.isTextDisabled"
                                        )}
                                        {...validation(
                                            "isTextDisabled",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={
                                            errors.isTextDisabled?.message
                                        }
                                        defaultChecked={data.isTextDisabled}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    <AppFormInput
                                        required={false}
                                        value={getValue("textValue")}
                                        name={"textValue"}
                                        label={`${t(
                                            "admin.aframepanel.form:label.textValue"
                                        )} (${active})`}
                                        maxCount={textValue.max}
                                        {...validation(
                                            "textValue",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textValue?.message}
                                        defaultValue={getValue("textValue")}
                                        control={control}
                                        onChange={(val) =>
                                            onTranslatedFieldChange(
                                                "textValue",
                                                val
                                            )
                                        }
                                    />
                                    <AppFormInputColorPicker
                                        required={false}
                                        label={t(
                                            "admin.aframepanel.form:label.textColor"
                                        )}
                                        name={"textColor"}
                                        errorMessage={errors.textColor?.message}
                                        defaultValue={data.textColor}
                                        control={control}
                                        setValue={setValue}
                                        {...validation(
                                            "textColor",
                                            formState,
                                            isEditMode
                                        )}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textWidth"}
                                        label={t(
                                            "admin.aframepanel.form:label.textWidth"
                                        )}
                                        maxCount={textWidth.max}
                                        {...validation(
                                            "textWidth",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textWidth?.message}
                                        defaultValue={data.textWidth}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textPosX"}
                                        label={t(
                                            "admin.aframepanel.form:label.textPosX"
                                        )}
                                        maxCount={textPosX.max}
                                        {...validation(
                                            "textPosX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textPosX?.message}
                                        defaultValue={data.textPosX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textPosY"}
                                        label={t(
                                            "admin.aframepanel.form:label.textPosY"
                                        )}
                                        maxCount={textPosY.max}
                                        {...validation(
                                            "textPosY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textPosY?.message}
                                        defaultValue={data.textPosY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textPosZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.textPosZ"
                                        )}
                                        maxCount={textPosZ.max}
                                        {...validation(
                                            "textPosZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textPosZ?.message}
                                        defaultValue={data.textPosZ}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textScaX"}
                                        label={t(
                                            "admin.aframepanel.form:label.textScaX"
                                        )}
                                        maxCount={textScaX.max}
                                        {...validation(
                                            "textScaX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textScaX?.message}
                                        defaultValue={data.textScaX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textScaY"}
                                        label={t(
                                            "admin.aframepanel.form:label.textScaY"
                                        )}
                                        maxCount={textScaY.max}
                                        {...validation(
                                            "textScaY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textScaY?.message}
                                        defaultValue={data.textScaY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textScaZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.textScaZ"
                                        )}
                                        maxCount={textScaZ.max}
                                        {...validation(
                                            "textScaZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textScaZ?.message}
                                        defaultValue={data.textScaZ}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textRotX"}
                                        label={t(
                                            "admin.aframepanel.form:label.textRotX"
                                        )}
                                        maxCount={textRotX.max}
                                        {...validation(
                                            "textRotX",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textRotX?.message}
                                        defaultValue={data.textRotX}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textRotY"}
                                        label={t(
                                            "admin.aframepanel.form:label.textRotY"
                                        )}
                                        maxCount={textRotY.max}
                                        {...validation(
                                            "textRotY",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textRotY?.message}
                                        defaultValue={data.textRotY}
                                        control={control}
                                    />
                                    <AppFormInput
                                        required={false}
                                        name={"textRotZ"}
                                        label={t(
                                            "admin.aframepanel.form:label.textRotZ"
                                        )}
                                        maxCount={textRotZ.max}
                                        {...validation(
                                            "textRotZ",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.textRotZ?.message}
                                        defaultValue={data.textRotZ}
                                        control={control}
                                    />
                                </Form.Row>
                                <Form.Row>
                                    {false && (
                                        <>
                                            <AppFormSelect
                                                required={false}
                                                id={"targetType"}
                                                name={"targetType"}
                                                label={t(
                                                    "admin.aframepanel.form:label.targetType"
                                                )}
                                                md={3}
                                                lg={3}
                                                xl={3}
                                                {...validation(
                                                    "targetType",
                                                    formState,
                                                    isEditMode
                                                )}
                                                errorMessage={
                                                    errors.targetType?.message
                                                }
                                                defaultValue={
                                                    data.targetType as any
                                                }
                                                options={targetTypeOptions}
                                                control={control}
                                                transform={{
                                                    output: (
                                                        template: PrimitiveObject
                                                    ) => {
                                                        setValue(
                                                            "targetType",
                                                            template?.value as string
                                                        );
                                                        return template?.value;
                                                    },
                                                    input: (value: string) => {
                                                        return _find(
                                                            targetTypeOptions,
                                                            {
                                                                value,
                                                            }
                                                        );
                                                    },
                                                }}
                                            />
                                            <AppFormSelect
                                                required={false}
                                                id={"targetAction"}
                                                name={"targetAction"}
                                                label={t(
                                                    "admin.aframepanel.form:label.targetAction"
                                                )}
                                                md={3}
                                                lg={3}
                                                xl={3}
                                                {...validation(
                                                    "targetAction",
                                                    formState,
                                                    isEditMode
                                                )}
                                                errorMessage={
                                                    errors.targetAction?.message
                                                }
                                                defaultValue={
                                                    data.targetAction as any
                                                }
                                                options={targetActionOptions}
                                                control={control}
                                                transform={{
                                                    output: (
                                                        template: PrimitiveObject
                                                    ) => {
                                                        setValue(
                                                            "targetAction",
                                                            template?.value as string
                                                        );
                                                        return template?.value;
                                                    },
                                                    input: (value: string) => {
                                                        return _find(
                                                            targetActionOptions,
                                                            {
                                                                value,
                                                            }
                                                        );
                                                    },
                                                }}
                                            />
                                        </>
                                    )}
                                    {panelType === "door" && (
                                        <AppFormSelect
                                            required={false}
                                            id={"targetId"}
                                            name={"targetId"}
                                            label={t(
                                                "admin.aframepanel.form:label.targetId"
                                            )}
                                            {...validation(
                                                "targetId",
                                                formState,
                                                isEditMode
                                            )}
                                            errorMessage={
                                                errors.targetId?.message
                                            }
                                            defaultValue={data.targetId as any}
                                            options={targetIdOptions}
                                            control={control}
                                            transform={{
                                                output: (
                                                    template: PrimitiveObject
                                                ) => {
                                                    setValue(
                                                        "targetId",
                                                        template?.value as any
                                                    );
                                                    return template?.value;
                                                },
                                                input: (value: string) => {
                                                    return _find(
                                                        targetIdOptions,
                                                        {
                                                            value,
                                                        }
                                                    );
                                                },
                                            }}
                                        />
                                    )}
                                    {panelType === "screen" && (
                                        <AppFormInput
                                            required={false}
                                            md={3}
                                            lg={3}
                                            xl={3}
                                            name={"targetUrl"}
                                            label={t(
                                                "admin.aframepanel.form:label.targetUrl"
                                            )}
                                            maxCount={targetUrl.max}
                                            {...validation(
                                                "targetUrl",
                                                formState,
                                                isEditMode
                                            )}
                                            errorMessage={
                                                errors.targetUrl?.message
                                            }
                                            defaultValue={data.targetUrl}
                                            control={control}
                                        />
                                    )}
                                </Form.Row>
                                {false && (
                                    <Form.Row>
                                        <AppFormSelect
                                            required={true}
                                            id={"type"}
                                            name={"type"}
                                            label={t(
                                                "admin.aframepanel.form:label.type"
                                            )}
                                            md={3}
                                            lg={3}
                                            xl={3}
                                            {...validation(
                                                "type",
                                                formState,
                                                isEditMode
                                            )}
                                            errorMessage={errors.type?.message}
                                            defaultValue={data.type || ""}
                                            options={typeOptions}
                                            control={control}
                                            transform={{
                                                output: (
                                                    template: PrimitiveObject
                                                ) => {
                                                    setValue(
                                                        "type",
                                                        template?.value as string
                                                    );
                                                    return template?.value;
                                                },
                                                input: (value: string) => {
                                                    return _find(typeOptions, {
                                                        value,
                                                    });
                                                },
                                            }}
                                        />
                                    </Form.Row>
                                )}

                                {panelType === "door" && (
                                    <Form.Row>
                                        <AppFormFile
                                            required={false}
                                            label={t(
                                                "admin.aframepanel.form:label.transitionVideo"
                                            )}
                                            {...validation(
                                                "transitionVideo",
                                                formState,
                                                isEditMode
                                            )}
                                            name={"transitionVideo"}
                                            defaultValue={data.transitionVideo}
                                            onFileSelect={onFileSelect(
                                                "transitionVideo"
                                            )}
                                            errorMessage={
                                                errors.transitionVideo?.message
                                            }
                                            control={control}
                                            value={transitionVideoFileName}
                                            filePath={aframepanelImagePath}
                                        />
                                    </Form.Row>
                                )}
                                {panelType === "projector" && (
                                    <Form.Row>
                                        <AppFormFile
                                            required={false}
                                            label={t(
                                                "admin.aframepanel.form:label.source"
                                            )}
                                            {...validation(
                                                "source",
                                                formState,
                                                isEditMode
                                            )}
                                            name={"source"}
                                            defaultValue={data.source}
                                            onFileSelect={onFileSelect(
                                                "source"
                                            )}
                                            errorMessage={
                                                errors.source?.message
                                            }
                                            control={control}
                                            value={sourceVideoFileName}
                                            filePath={aframepanelImagePath}
                                        />
                                    </Form.Row>
                                )}
                                {panelType === "billboard" && (
                                    <Form.Row>
                                        <AppFormRichTextArea
                                            xl={12}
                                            required={false}
                                            name={"content"}
                                            value={getValue("content")}
                                            onChange={(val) =>
                                                onTranslatedFieldChange(
                                                    "content",
                                                    val
                                                )
                                            }
                                            label={`${t(
                                                "admin.aframepanel.form:label.content"
                                            )} (${active})`}
                                            maxCount={content.max}
                                            {...validation(
                                                "content",
                                                formState,
                                                isEditMode
                                            )}
                                            errorMessage={
                                                errors.content?.message
                                            }
                                            defaultValue={getValue("content")}
                                            control={control}
                                        />
                                    </Form.Row>
                                )}
                                {panelType === "door" && (
                                    <Form.Row>
                                        <AppFormSwitch
                                            name={"isTransitionEnabled"}
                                            label={t(
                                                "admin.aframepanel.form:label.isTransitionEnabled"
                                            )}
                                            {...validation(
                                                "isTransitionEnabled",
                                                formState,
                                                isEditMode
                                            )}
                                            errorMessage={
                                                errors.isTransitionEnabled
                                                    ?.message
                                            }
                                            defaultChecked={
                                                data.isTransitionEnabled
                                            }
                                            control={control}
                                        />
                                    </Form.Row>
                                )}
                            </>
                        </AppCard>

                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={".."}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
