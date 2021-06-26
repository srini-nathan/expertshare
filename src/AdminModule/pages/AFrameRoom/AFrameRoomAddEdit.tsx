import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppFormActions,
    AppCard,
    AppUploader,
    AppFormSwitch,
    AppFormInput,
    AppLoader,
} from "../../../AppModule/components";
import {
    Upload,
    UnprocessableEntityErrorResponse,
    FileTypeInfo,
} from "../../../AppModule/models";
import { AFrameRoom, PAFrameRoom } from "../../models";
import { AFrameRoomApi, ContainerApi } from "../../apis";
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

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_AFRAMEROOM_MEDIA },
    FILETYPEINFO: { FILETYPEINFO_AFRAMEROOM_MEDIA },
} = UPLOAD;

const {
    name,
    camPosX,
    camPosY,
    camPosZ,
    camRotX,
    camRotY,
    camRotZ,
} = validations;

export const AFrameRoomAddEdit: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { id, isEditMode } = useParamId();
    const navigator = useNavigator(navigate);
    const { containerResourceId, containerId } = useAuthState();
    const [data, setData] = useState<PAFrameRoom>(
        new AFrameRoom(containerResourceId)
    );
    const [files, setFiles] = useState<File[]>([]);
    const aframeroomImagePath = useBuildAssetPath(
        FILETYPEINFO_AFRAMEROOM_MEDIA as FileTypeInfo
    );
    const [loading, setLoading] = useState<boolean>(true);
    const { t } = useTranslation();

    const {
        handleSubmit,
        setError,
        trigger,
        formState,
        control,
        setValue,
    } = useForm<AFrameRoom>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onFileSelect = (selectedFiles: File[]) => {
        setFiles(selectedFiles);
    };

    const submitForm = async (formData: AFrameRoom) => {
        formData.container = ContainerApi.toResourceUrl(containerId);

        return AFrameRoomApi.createOrUpdate<AFrameRoom>(id, formData).then(
            ({ error, errorMessage }) => {
                if (error instanceof UnprocessableEntityErrorResponse) {
                    setViolations<AFrameRoom>(error, setError);
                } else if (errorMessage) {
                    errorToast(errorMessage);
                } else {
                    navigator("/admin/rooms").then(() => {
                        successToast(
                            isEditMode ? "Rooms updated" : "Rooms created"
                        );
                    });
                }
            }
        );
    };

    const onSubmit = async (formData: AFrameRoom) => {
        if (files.length > 0) {
            const fd = new FormData();
            fd.set("file", files[0], files[0].name);
            fd.set("fileType", FILETYPE_AFRAMEROOM_MEDIA);

            return UploadAPI.createResource<Upload, FormData>(fd).then(
                ({ errorMessage, response }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);

                        return submitForm(formData);
                    }

                    if (response && response.fileName) {
                        formData.image = response.fileName;
                    }

                    successToast("Image uploaded");
                    return submitForm(formData);
                }
            );
        }
        return submitForm(formData);
    };
    useEffect(() => {
        if (isEditMode) {
            AFrameRoomApi.findById<AFrameRoom>(id).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("data not exist");
                    } else if (response !== null) {
                        setData(response);
                        trigger();
                    }
                    setLoading(false);
                }
            );
        }
        if (!isEditMode) {
            setLoading(false);
        }
    }, [id, isEditMode, trigger]);

    const { errors } = formState;

    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("common.breadcrumb:aframeroom")}
                linkUrl={"/admin/rooms"}
            />
            <AppPageHeader
                title={
                    isEditMode
                        ? t("admin.aframeroom.form:header.titleEdit")
                        : t("admin.aframeroom.form:header.title")
                }
            />
            <Row>
                <Col>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <AppCard>
                            <Form.Row>
                                <AppFormInput
                                    name={"name"}
                                    label={t(
                                        "admin.aframeroom.form:label.name"
                                    )}
                                    maxCount={name.max}
                                    {...validation(
                                        "name",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.name?.message}
                                    defaultValue={data.name}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <AppFormSwitch
                                    name={"isEntryRoom"}
                                    label={t(
                                        "admin.aframeroom.form:label.isEntryRoom"
                                    )}
                                    {...validation(
                                        "isEntryRoom",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.isEntryRoom?.message}
                                    defaultChecked={data.isEntryRoom}
                                    control={control}
                                />
                            </Form.Row>
                            <Form.Row>
                                <Form.Group className={"col w-100"}>
                                    <Form.Label>
                                        {t("admin.aframeroom.form:label.image")}
                                    </Form.Label>
                                    <AppUploader
                                        accept="image/*"
                                        imagePath={
                                            data.image
                                                ? `${aframeroomImagePath}/${data.image}`
                                                : ""
                                        }
                                        onFileSelect={onFileSelect}
                                        onDelete={() => {
                                            setValue("image", "");
                                            setData({
                                                ...data,
                                                image: "",
                                            });
                                        }}
                                        fileInfo={
                                            FILETYPEINFO_AFRAMEROOM_MEDIA as FileTypeInfo
                                        }
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <AppFormInput
                                    name={"camPosX"}
                                    label={t(
                                        "admin.aframeroom.form:label.camPosX"
                                    )}
                                    maxCount={camPosX.max}
                                    {...validation(
                                        "camPosX",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.camPosX?.message}
                                    defaultValue={data.camPosX}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"camPosY"}
                                    label={t(
                                        "admin.aframeroom.form:label.camPosY"
                                    )}
                                    maxCount={camPosY.max}
                                    {...validation(
                                        "camPosY",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.camPosY?.message}
                                    defaultValue={data.camPosY}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"camPosZ"}
                                    label={t(
                                        "admin.aframeroom.form:label.camPosZ"
                                    )}
                                    maxCount={camPosZ.max}
                                    {...validation(
                                        "camPosZ",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.camPosZ?.message}
                                    defaultValue={data.camPosZ}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"camRotX"}
                                    label={t(
                                        "admin.aframeroom.form:label.camRotX"
                                    )}
                                    maxCount={camRotX.max}
                                    {...validation(
                                        "camRotX",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.camRotX?.message}
                                    defaultValue={data.camRotX}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"camRotY"}
                                    label={t(
                                        "admin.aframeroom.form:label.camRotY"
                                    )}
                                    maxCount={camRotY.max}
                                    {...validation(
                                        "camRotY",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.camRotY?.message}
                                    defaultValue={data.camRotY}
                                    control={control}
                                />
                                <AppFormInput
                                    name={"camRotZ"}
                                    label={t(
                                        "admin.aframeroom.form:label.camRotZ"
                                    )}
                                    maxCount={camRotZ.max}
                                    {...validation(
                                        "camRotZ",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.camRotZ?.message}
                                    defaultValue={data.camRotZ}
                                    control={control}
                                />
                            </Form.Row>
                        </AppCard>

                        <Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={"/admin/rooms"}
                                isLoading={formState.isSubmitting}
                            />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    );
};
