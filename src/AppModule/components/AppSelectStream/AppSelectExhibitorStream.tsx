import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { Control, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Exhibitor } from "../../../AdminModule/models";
import { AppFormInput } from "../AppFormInput";
import { AppFormLabel } from "../AppFormLabel";
import { validation } from "../../utils";
import "./assets/scss/style.scss";
import { AppFormFile } from "../AppFormFile";
import { useBuildAssetPath } from "../../hooks";
import { ExhibitorVideoFileInfo } from "../../../config";

export interface AppSelectStreamProps {
    data: Exhibitor;
    errors: any;
    formState: any;
    isEditMode: boolean;
    setValue: UseFormSetValue<Exhibitor>;
    control: Control<any>;
    onFileSelect: (file: File) => void;
}

export const AppSelectExhibitorStream: FC<AppSelectStreamProps> = ({
    data,
    errors,
    formState,
    isEditMode,
    setValue,
    control,
    onFileSelect,
}) => {
    const { t } = useTranslation();
    const videoBasePath = useBuildAssetPath(ExhibitorVideoFileInfo);
    const [type, setType] = React.useState<string>(
        data.streamType === "FILE" ? "FILE" : data.streamType
    );
    const [activeKey, setActiveKey] = React.useState<string>(
        data.streamType === "FILE" ? "FILE" : "STREAM"
    );

    return (
        <Row className="streams-container">
            <Col md={12}>
                <AppFormLabel
                    label={t("admin.exhibitor.form:label.chooseStreaming")}
                    required
                />
            </Col>
            <Col md={12} className="d-flex mb-4">
                <div className="streaming-tab mt-2">
                    <Row className="m-0 w-100 ">
                        <Row className="m-0 tabs">
                            <div
                                className={`mr-3 mb-3 nav-link ${
                                    type === "YOUTUBE" ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveKey("STREAM");
                                    setType("YOUTUBE");
                                    setValue("streamType", "YOUTUBE");
                                }}
                            >
                                <span className={"stream-items youtube"}></span>
                            </div>
                            <div
                                className={`mr-3 mb-3 nav-link ${
                                    type === "VIMEO" ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveKey("STREAM");
                                    setType("VIMEO");
                                    setValue("streamType", "VIMEO");
                                }}
                            >
                                <span className={"stream-items vimeo"}></span>
                            </div>
                            <div
                                className={`mr-3 mb-3 nav-link ${
                                    type === "SWISSCOM" ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveKey("STREAM");
                                    setType("SWISSCOM");
                                    setValue("streamType", "SWISSCOM");
                                }}
                            >
                                <span
                                    className={"stream-items swisscom"}
                                ></span>
                            </div>
                            <div
                                className={`mr-3 mb-3 nav-link ${
                                    type === "DACAST" ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveKey("STREAM");
                                    setType("DACAST");
                                    setValue("streamType", "DACAST");
                                }}
                            >
                                <span className={"stream-items dacast"}></span>
                            </div>
                            <div
                                className={`mr-3 mb-3 nav-link ${
                                    type === "FILE" ? "active" : ""
                                }`}
                                onClick={() => {
                                    setActiveKey("FILE");
                                    setType("FILE");
                                    setValue("streamType", "FILE");
                                }}
                            >
                                <span className={"stream-items upload"}>
                                    <i className="fak fa-upload"></i>
                                </span>
                            </div>
                        </Row>
                        <Col className="p-0" md={12}>
                            {activeKey === "STREAM" && (
                                <div className="mt-4">
                                    <AppFormInput
                                        id={"streamUrl"}
                                        defaultValue={data.streamUrl}
                                        className="pl-0"
                                        md={12}
                                        name={"streamUrl"}
                                        lg={12}
                                        xl={12}
                                        required={true}
                                        label={`${t(
                                            "admin.exhibitor.form:label.streamUrl"
                                        )}`}
                                        {...validation(
                                            "streamUrl",
                                            formState,
                                            isEditMode
                                        )}
                                        errorMessage={errors.streamUrl?.message}
                                        control={control}
                                    />
                                </div>
                            )}
                            {activeKey === "FILE" && (
                                <div className="mt-4">
                                    <AppFormFile
                                        name={"streamFileInput"}
                                        onFileSelect={(files: File[]) => {
                                            if (onFileSelect)
                                                onFileSelect(files[0]);
                                        }}
                                        control={control}
                                        className={"p-0 mb-4"}
                                        hideDownload={true}
                                        md={12}
                                        xl={12}
                                        lg={12}
                                    />
                                    {data.streamUrl ? (
                                        <video
                                            controls={true}
                                            className={"w-100"}
                                        >
                                            <source
                                                src={`${videoBasePath}/${data.streamUrl}`}
                                            />
                                        </video>
                                    ) : null}
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
};
