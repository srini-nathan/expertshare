import React, { FC, useEffect } from "react";
import { Row, Col, Tab } from "react-bootstrap";
import { UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "./assets/scss/style.scss";
import { Exhibitor } from "../../../AdminModule/models";
import { AppCustomTab } from "../AppCustomTab";
import { AppFormInput } from "../AppFormInput";
import { AppFormLabel } from "../AppFormLabel";
import { TranslationsType } from "../AppFormTranslatable";
import { AppReactHookFormProps } from "../../models";
import { validation } from "../../utils";

export interface AppSelectStreamProps extends AppReactHookFormProps {
    onChange: (value: TranslationsType[]) => void;
    changeValue?: UseFormSetValue<Exhibitor>;
    streamType: string;
    streamUrl: string;
    errors: any;
    formState: any;
    isEditMode: boolean;
}

export const AppSelectExhibitorStream: FC<AppSelectStreamProps> = ({
    translations,
    onChange,
    changeValue,
    streamType,
    activeLanguage,
    formState,
    isEditMode,
    errors,
    control,
}) => {
    const { t } = useTranslation();
    const [activeKey, setActiveKey] = React.useState(streamType);
    const handleValueChange = (value: string) => {
        const newTranslatiosn = translations.map((e) => {
            if (e.locale === activeLanguage)
                return {
                    ...e,
                    streamUrl: value,
                };

            return e;
        });

        onChange(newTranslatiosn);
    };

    useEffect(() => {
        if (streamType) {
            if (changeValue) changeValue("streamType", streamType);
        }
    }, []);
    const getValue = (name: any): string => {
        const item = translations.find((e) => e.locale === activeLanguage);

        if (item && item.streamUrl) {
            if (changeValue) changeValue(name, item.streamUrl);

            return item.streamUrl;
        }

        return "";
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
                        if (e === activeKey) {
                            setActiveKey("");
                            if (changeValue) changeValue("streamType", "");
                        } else {
                            setActiveKey(e as string);
                            if (changeValue) {
                                changeValue("streamType", e as string);
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
                        </Row>
                        <Col className="p-0" md={12}>
                            <Tab.Pane className="mt-4 " eventKey="YOUTUBE">
                                <AppFormInput
                                    value={getValue("streamUrlYoutube")}
                                    className="pl-0"
                                    md={12}
                                    name={"streamUrlYoutube"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    label={`${t(
                                        "admin.exhibitor.form:label.streamingUrl"
                                    )}`}
                                    {...validation(
                                        "streamUrlYoutube",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.streamUrlYoutube?.message
                                    }
                                    onChange={(value: string) => {
                                        handleValueChange(value);
                                    }}
                                    control={control}
                                />
                            </Tab.Pane>
                            <Tab.Pane className="mt-4 " eventKey="DACAST">
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"streamUrlDacast"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    value={getValue("streamUrlDacast")}
                                    label={`${t(
                                        "admin.exhibitor.form:label.streamingUrl"
                                    )}`}
                                    {...validation(
                                        "streamUrlDacast",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.streamUrlDacast?.message
                                    }
                                    onChange={(value: string) => {
                                        handleValueChange(value);
                                    }}
                                    control={control}
                                />
                            </Tab.Pane>
                            <Tab.Pane className="mt-4 " eventKey="SWISSCOM">
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"streamUrlSwisscom"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    value={getValue("streamUrlSwisscom")}
                                    label={`${t(
                                        "admin.exhibitor.form:label.streamingUrl"
                                    )}`}
                                    {...validation(
                                        "streamUrlSwisscom",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.streamUrlSwisscom?.message
                                    }
                                    onChange={(value: string) => {
                                        handleValueChange(value);
                                    }}
                                    control={control}
                                />
                            </Tab.Pane>
                            <Tab.Pane className="mt-4 " eventKey="VIMEO">
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"streamUrlVimeo"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    value={getValue("streamUrlVimeo")}
                                    label={`${t(
                                        "admin.exhibitor.form:label.streamingUrl"
                                    )}`}
                                    {...validation(
                                        "streamUrlVimeo",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.streamUrlVimeo?.message
                                    }
                                    onChange={(value: string) => {
                                        handleValueChange(value);
                                    }}
                                    control={control}
                                />
                            </Tab.Pane>
                        </Col>
                    </Row>
                </Tab.Container>
            </Col>
        </Row>
    );
};
