import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    AppPageHeader,
    AppBreadcrumb,
    AppFormActions,
    AppCard,
    AppUploader,
    AppFormSwitch,
    AppFormLabel,
} from "../../components";
import {
    Upload,
    UnprocessableEntityErrorResponse,
    FileTypeInfo,
} from "../../models";
import { AFrameRoom, PAFrameRoom } from "../../../AdminModule/models";
import { AFrameRoomApi, ContainerApi } from "../../../AdminModule/apis";
import {
    errorToast,
    setViolations,
    successToast,
    validation,
} from "../../utils";
import {
    useParamId,
    useNavigator,
    useAuthState,
    useBuildAssetPath,
} from "../../hooks";
import { schema } from "./schema";
import { CONSTANTS } from "../../../config";
import { UploadAPI } from "../../apis";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPE: { FILETYPE_AFRAMEROOM_MEDIA },
    FILETYPEINFO: { FILETYPEINFO_AFRAMEROOM_MEDIA },
} = UPLOAD;

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
                    navigator("/aframerooms").then(() => {
                        successToast(
                            isEditMode
                                ? "AFrameRoom updated"
                                : "AFrameRoom created"
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
                }
            );
        }
    }, [id, isEditMode, trigger]);

    const { errors } = formState;

    return (
        <Fragment>
            <AppBreadcrumb linkText={"AFrameRooms"} linkUrl={"/aframerooms"} />
            <AppPageHeader
                title={isEditMode ? "Edit AFrameRooms" : "Add AFrameRooms"}
            />
            <Row>
                <Col>
                    <AppCard>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <AppFormLabel label={`Name`} required />
                                    <Form.Control
                                        value={data.name}
                                        name={`name`}
                                        onChange={(e: any) => {
                                            setValue("name", e.target.value);
                                            setData({
                                                ...data,
                                                name: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.name?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <AppFormSwitch
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                                name={"isEntryRoom"}
                                label={"Is EntryRoom?"}
                                {...validation(
                                    "isEntryRoom",
                                    formState,
                                    isEditMode
                                )}
                                errorMessage={errors.isEntryRoom?.message}
                                defaultChecked={data.isEntryRoom}
                                control={control}
                            />
                            <Form.Row>
                                <Form.Group
                                    as={Col}
                                    sm={12}
                                    md={12}
                                    lg={6}
                                    xl={6}
                                >
                                    <Form.Label>Image</Form.Label>
                                    <AppUploader
                                        withCropper
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
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md={4}>
                                    <AppFormLabel
                                        label={`Camera Position X`}
                                        required
                                    />

                                    <Form.Control
                                        value={data.camPosX}
                                        name={`camPosX`}
                                        onChange={(e: any) => {
                                            setValue("camPosX", e.target.value);
                                            setData({
                                                ...data,
                                                camPosX: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.camPosX?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <AppFormLabel
                                        label={`Camera Position Y`}
                                        required
                                    />

                                    <Form.Control
                                        value={data.camPosY}
                                        name={`camPosY`}
                                        onChange={(e: any) => {
                                            setValue("camPosY", e.target.value);
                                            setData({
                                                ...data,
                                                camPosY: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.camPosY?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <AppFormLabel
                                        label={`Camera Position Z`}
                                        required
                                    />

                                    <Form.Control
                                        value={data.camPosZ}
                                        name={`camPosZ`}
                                        onChange={(e: any) => {
                                            setValue("camPosZ", e.target.value);
                                            setData({
                                                ...data,
                                                camPosZ: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.camPosZ?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md={4}>
                                    <AppFormLabel
                                        label={`Camera Rotation X`}
                                        required
                                    />

                                    <Form.Control
                                        value={data.camRotX}
                                        name={`camRotX`}
                                        onChange={(e: any) => {
                                            setValue("camRotX", e.target.value);
                                            setData({
                                                ...data,
                                                camRotX: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.camRotX?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <AppFormLabel
                                        label={`Camera Rotation Y`}
                                        required
                                    />

                                    <Form.Control
                                        value={data.camRotY}
                                        name={`camRotY`}
                                        onChange={(e: any) => {
                                            setValue("camRotY", e.target.value);
                                            setData({
                                                ...data,
                                                camRotY: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.camRotY?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md={4}>
                                    <AppFormLabel
                                        label={`Camera Rotation Z`}
                                        required
                                    />

                                    <Form.Control
                                        value={data.camRotZ}
                                        name={`camRotZ`}
                                        onChange={(e: any) => {
                                            setValue("camRotZ", e.target.value);
                                            setData({
                                                ...data,
                                                camRotZ: e.target.value,
                                            });
                                        }}
                                    />

                                    <Form.Control.Feedback
                                        className={"d-block"}
                                        type="invalid"
                                    >
                                        {errors.camRotZ?.message &&
                                            "This feild is required"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <AppFormActions
                                isEditMode={isEditMode}
                                navigation={navigator}
                                backLink={"/aframerooms"}
                                isLoading={formState.isSubmitting}
                            />
                        </Form>
                    </AppCard>
                </Col>
            </Row>
        </Fragment>
    );
};
