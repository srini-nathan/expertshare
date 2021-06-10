import React, { FC } from "react";
import { Row, Col, Tab } from "react-bootstrap";
import { UseFormSetValue } from "react-hook-form";
import "./assets/scss/style.scss";
import { Language, Session } from "../../../AdminModule/models";
import { AppCustomTab } from "../AppCustomTab";
import { AppFormInput } from "../AppFormInput";
import { AppFormLabel } from "../AppFormLabel";
import { TranslationsType } from "../AppFormTranslatable";
import { AppReactHookFormProps } from "../../models";
import { validation } from "../../utils";

export interface AppSelectStreamProps extends AppReactHookFormProps {
    languages: Language[];
    onChange: (value: TranslationsType[]) => void;
    setActiveLanguage?: (name: string) => void;
    changeValue?: UseFormSetValue<Session>;
    translations: TranslationsType[];
    defaultLanguage: string;
    streamType: string;
    activeLanguage: string;
    data: Session;
    errors: any;
    formState: any;
    isEditMode: boolean;
}

export const AppSelectStream: FC<AppSelectStreamProps> = ({
    translations,
    onChange,
    changeValue,
    streamType,
    activeLanguage,
    formState,
    isEditMode,
    errors,
    control,
    data,
}) => {
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
                <AppFormLabel label="Choose your stream platform" required />
            </Col>
            <Col md={12} className="d-flex mb-4">
                <Tab.Container
                    onSelect={(e: string | null) => {
                        if (e === activeKey) setActiveKey("");
                        else setActiveKey(e as string);
                        if (changeValue) {
                            changeValue("streamType", e as string);
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
                            <AppCustomTab
                                className="mr-3 mb-3"
                                eventKey="KNOVIO"
                            >
                                <span className={"stream-items knovio"}></span>
                            </AppCustomTab>
                            <AppCustomTab className="mr-3 mb-3" eventKey="ZOOM">
                                <span className={"stream-items zoom"}></span>
                            </AppCustomTab>
                            <AppCustomTab
                                className="mr-3 mb-3"
                                eventKey="WEBEX"
                            >
                                <span className={"stream-items webex"}></span>
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
                                    label={`Youtube Url (${activeLanguage.toUpperCase()})`}
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
                            <Tab.Pane className="mt-4 " eventKey="KNOVIO">
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"streamUrlKnovio"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    value={getValue("streamUrlKnovio")}
                                    label={`Knovio Url (${activeLanguage.toUpperCase()})`}
                                    {...validation(
                                        "streamUrlKnovio",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.streamUrlKnovio?.message
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
                                    label={`Dacast Url (${activeLanguage.toUpperCase()})`}
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
                                    label={`Swisscom Url (${activeLanguage.toUpperCase()})`}
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
                                    label={`Vimeo Url (${activeLanguage.toUpperCase()})`}
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
                            <Tab.Pane className="mt-4 " eventKey="WEBEX">
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"webexUrl"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    label={"Webex Meeting Url"}
                                    {...validation(
                                        "webexUrl",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.webexUrl?.message}
                                    defaultValue={data.webexUrl}
                                    control={control}
                                />
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"webexMeetingPassword"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    label={"Webex Meeting Url"}
                                    {...validation(
                                        "webexMeetingPassword",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.webexMeetingPassword?.message
                                    }
                                    defaultValue={data.webexMeetingPassword}
                                    control={control}
                                />
                            </Tab.Pane>
                            <Tab.Pane className="mt-4 " eventKey="ZOOM">
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"zoomurl"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    label={"Zoom Meeting Url"}
                                    {...validation(
                                        "zoomurl",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={errors.zoomurl?.message}
                                    defaultValue={data.zoomUrl}
                                    control={control}
                                />

                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"zoomMeetingNumber"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    label={"Zoom Meeting Number"}
                                    {...validation(
                                        "zoomMeetingNumber",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.zoomMeetingNumber?.message
                                    }
                                    defaultValue={data.zoomMeetingNumber}
                                    control={control}
                                />
                                <AppFormInput
                                    className="pl-0"
                                    md={12}
                                    name={"zoomMeetingPassword"}
                                    lg={12}
                                    xl={12}
                                    required={true}
                                    label={"Zoom Meeting Password"}
                                    {...validation(
                                        "zoomMeetingPassword",
                                        formState,
                                        isEditMode
                                    )}
                                    errorMessage={
                                        errors.zoomMeetingPassword?.message
                                    }
                                    defaultValue={data.zoomMeetingPassword}
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
