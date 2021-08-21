import React, { FC } from "react";
import { Row, Col, Tab } from "react-bootstrap";
import { Control, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Exhibitor } from "../../../AdminModule/models";
import { AppCustomTab } from "../AppCustomTab";
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
    const [activeKey, setActiveKey] = React.useState<string>(
        data.streamType === "FILE" ? "FILE" : data.streamType
    );

    const renderInput = (id: string) => {
        return (
            <AppFormInput
                id={id}
                value={data.streamUrl}
                className="pl-0"
                md={12}
                name={"streamUrl"}
                lg={12}
                xl={12}
                required={true}
                label={`${t("admin.exhibitor.form:label.streamUrl")}`}
                {...validation("streamUrl", formState, isEditMode)}
                errorMessage={errors.streamUrl?.message}
                control={control}
            />
        );
    };

    return (
        <Row className="streams-container">
            <Col md={12}>
                <AppFormLabel
                    label={t("admin.exhibitor.form:label.chooseStreaming")}
                    required
                />
            </Col>
            <Col md={12} className="d-flex mb-4">
                <Tab.Container
                    onSelect={(e: string | null) => {
                        if (e) {
                            if (e === "FILE") {
                                setActiveKey("FILE");
                                setValue("streamType", e);
                            } else {
                                setActiveKey(e);
                                setValue("streamType", e);
                            }
                        }
                    }}
                    activeKey={activeKey}
                >
                    <Row className="m-0 w-100 ">
                        <Row className="m-0">
                            <AppCustomTab
                                className="mr-3 mb-3"
                                eventKey="YOUTUBE"
                            >
                                <span className={"stream-items youtube"}></span>
                            </AppCustomTab>
                            <AppCustomTab
                                className="mr-3 mb-3"
                                eventKey="VIMEO"
                            >
                                <span className={"stream-items vimeo"}></span>
                            </AppCustomTab>
                            <AppCustomTab
                                className="mr-3 mb-3"
                                eventKey="SWISSCOM"
                            >
                                <span
                                    className={"stream-items swisscom"}
                                ></span>
                            </AppCustomTab>
                            <AppCustomTab
                                className="mr-3 mb-3"
                                eventKey="DACAST"
                            >
                                <span className={"stream-items dacast"}></span>
                            </AppCustomTab>
                            <AppCustomTab className="mr-3 mb-3" eventKey="FILE">
                                <span className={"stream-items"}>VIDEO</span>
                            </AppCustomTab>
                        </Row>
                        <Col className="p-0" md={12}>
                            <Tab.Pane className="mt-4" eventKey="YOUTUBE">
                                {renderInput("YOUTUBE")}
                            </Tab.Pane>
                            <Tab.Pane className="mt-4" eventKey="VIMEO">
                                {renderInput("VIMEO")}
                            </Tab.Pane>
                            <Tab.Pane className="mt-4" eventKey="SWISSCOM">
                                {renderInput("SWISSCOM")}
                            </Tab.Pane>
                            <Tab.Pane className="mt-4" eventKey="DACAST">
                                {renderInput("DACAST")}
                            </Tab.Pane>
                            <Tab.Pane className="mt-4" eventKey="FILE">
                                <AppFormFile
                                    name={"streamUrl"}
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
                                    <video controls={true} className={"w-100"}>
                                        <source
                                            src={`${videoBasePath}/${data.streamUrl}`}
                                        />
                                    </video>
                                ) : null}
                            </Tab.Pane>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
        </Row>
    );
};
