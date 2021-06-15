import React, { FunctionComponent } from "react";
import { Control } from "react-hook-form";
import { Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppFormInput } from "../AppFormInput";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppFormTextArea } from "../AppFormTextArea";
import { AppFormRichTextArea } from "../AppFormRichTextArea";
import { AppFormDropdown } from "../AppFormDropdown";
import { AppFormFile } from "../AppFormFile";
import { PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormElementGeneratorProps {
    properties: any;
    activeLanguage?: string;
    defaultValue: any;
    translations?: any[];
    onChange?: (value: any[]) => void;
    onFileSelect?: (files: File[], title: string, translation: boolean) => void;
    control: Control<any>;
}
export interface AppDataProps {
    type: string;
    name: string;
    label: string;
    value?: string;
    defaultValue: any;
    placeholder: string;
    onChange?: any;
}
export const AppFormElementGenerator: FunctionComponent<AppFormElementGeneratorProps> = ({
    properties,
    defaultValue,
    control,
    onChange,
    translations,
    activeLanguage = "",
    onFileSelect,
}) => {
    const { items } = properties;
    const { t } = useTranslation();

    items.label = items.label ? t(items.label) : "";

    const getLayoutProms = () => {
        switch (items.column) {
            case 3:
                return {
                    xl: 12,
                    lg: 12,
                    md: 12,
                    sm: 12,
                };
            case 2:
                return {
                    xl: 6,
                    lg: 6,
                    md: 6,
                    sm: 12,
                };
            case 1:
            default:
                return {
                    xl: 4,
                    lg: 4,
                    md: 6,
                    sm: 12,
                };
        }
    };

    const getTranslationValue = (name: string) => {
        if (translations) {
            const item = translations.find((e) => e.locale === activeLanguage);

            if (item) return item[name];
        }
        return "";
    };
    const handleTranslationValue = (value: string) => {
        if (translations) {
            const newTranslatiosn = translations.map((e) => {
                if ((e.locale as string) === activeLanguage)
                    return {
                        ...e,
                        [properties.title]: value,
                    };
                return e;
            });

            if (onChange) onChange(newTranslatiosn);
        }
    };

    const renderText = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
            name: properties.title,
        };
        if (items.translation && translations)
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: handleTranslationValue,
            };
        return (
            <AppFormInput {...getLayoutProms()} {...prps} control={control} />
        );
    };

    const renderSwitch = () => {
        const prps = {
            label: items.label ? items.label : "",
        };
        return (
            <AppFormSwitch
                {...getLayoutProms()}
                name={properties.title}
                {...prps}
                defaultChecked={defaultValue}
                control={control}
            />
        );
    };

    const renderSection = () => {
        return (
            <Col className="section-title mb-3" sm={12}>
                <h3>{items.label}</h3>
            </Col>
        );
    };

    const renderSeperator = () => {
        return (
            <Col className="section-title mb-3" sm={12}>
                <hr />
            </Col>
        );
    };
    const renderBlank = () => {
        return <Col md={6} sm={12} lg={4} xl={4}></Col>;
    };
    const renderDropDown = () => {
        const dropDownOptions: PrimitiveObject[] = [];
        let dropDownDefaultValue = {};

        Object.keys(items.options.choices).forEach((key) => {
            dropDownOptions.push({
                label: items.options.choices[key],
                name: properties.title,
                value: key,
            });
            if (items.options.defaultValue.toUpperCase() === key.toUpperCase())
                dropDownDefaultValue = {
                    label: items.options.choices[key],
                    value: key,
                };
        });
        const prps = {
            options: dropDownOptions,
            defaultValue: dropDownDefaultValue,
        };
        return (
            <Form.Group
                as={Col}
                {...getLayoutProms()}
                controlId={properties.title}
            >
                <Form.Label>{items.label}</Form.Label>
                <AppFormDropdown id={properties.title} {...prps} />
            </Form.Group>
        );
    };
    const renderTextarea = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
            name: properties.title,
        };
        if (items.translation && translations) {
            delete prps.defaultValue;
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: (e: any) => {
                    handleTranslationValue(e.target.value);
                },
            };
        }
        return (
            <AppFormTextArea
                {...getLayoutProms()}
                {...prps}
                control={control}
            />
        );
    };
    const renderRichTextarea = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
            name: properties.title,
        };
        if (items.translation && translations) {
            delete prps.defaultValue;
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: handleTranslationValue,
            };
        }
        return (
            <AppFormRichTextArea
                {...getLayoutProms()}
                {...prps}
                control={control}
            />
        );
    };
    const renderFile = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
            name: properties.title,
        };
        if (items.translation && translations)
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: handleTranslationValue,
            };
        return (
            <AppFormFile
                {...getLayoutProms()}
                onFileSelect={(files: File[]) => {
                    if (onFileSelect)
                        onFileSelect(
                            files,
                            properties.title,
                            items.translation
                        );
                }}
                {...prps}
                control={control}
            />
        );
    };
    const renderForm = () => {
        switch (properties.items.type) {
            case "TEXT":
                return renderText();
            case "CHOICE":
                return renderDropDown();
            case "SWITCH":
                return renderSwitch();
            case "SECTION":
                return renderSection();
            case "SEPERATOR":
                return renderSeperator();
            case "BLANK":
                return renderBlank();
            case "TEXTAREA":
                return renderTextarea();
            case "RICH_TEXTAREA":
                return renderRichTextarea();
            case "FILE":
                return renderFile();
            default:
                return <></>;
        }
    };

    return <>{renderForm()}</>;
};
