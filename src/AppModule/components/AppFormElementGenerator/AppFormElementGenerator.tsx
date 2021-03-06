import React, { FunctionComponent } from "react";
import { Control, SetFieldValue } from "react-hook-form";
import { Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { find as _find } from "lodash";
import { AppFormInput } from "../AppFormInput";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppFormTextArea } from "../AppFormTextArea";
import { AppFormRichTextArea } from "../AppFormRichTextArea";
import { AppFormFile } from "../AppFormFile";
import { FileTypeInfo, PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";
import { AppFormInputColorPicker } from "../AppFormInputColorPicker";
import { AppFormCodeEditor } from "../AppFormCodeEditor";
import { AppUploader } from "../AppUploader";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import { AppFormSelect } from "../AppFormSelect";
import { AppFormMultiSelect } from "../AppFormMultiSelect";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_DESIGN_CONFIGURATION },
} = UPLOAD;

export interface AppFormElementGeneratorProps {
    properties: any;
    activeLanguage?: string;
    defaultValue: any;
    control: Control<any>;
    onFileSelect?: (files: File[], title: string, translation: boolean) => void;
    translations?: any[];
    onChange?: (value: any[]) => void;
    setValue?: SetFieldValue<any>;
    onFileRemove?: (title: string) => void;
}
export interface AppDataProps {
    type: string;
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
    setValue,
    onFileRemove,
}) => {
    const { items } = properties;
    const { t } = useTranslation();
    const designConfigBasePath = useBuildAssetPath(
        FILETYPEINFO_DESIGN_CONFIGURATION as FileTypeInfo
    );

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
        };
        if (items.translation && translations)
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: handleTranslationValue,
            };
        return (
            <AppFormInput
                name={properties.title}
                {...getLayoutProms()}
                {...prps}
                control={control}
            />
        );
    };

    const renderColor = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
        };
        if (items.translation && translations)
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: handleTranslationValue,
            };
        return (
            <AppFormInputColorPicker
                name={properties.title}
                {...getLayoutProms()}
                {...prps}
                control={control}
                setValue={setValue}
            />
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

        Object.keys(items.options.choices).forEach((key) => {
            dropDownOptions.push({
                label: items.options.choices[key],
                name: properties.title,
                value: key,
            });
        });
        const { defaultValue: backendValue } = items.options;

        return (
            <AppFormSelect
                name={properties.title}
                id={properties.title}
                label={items.label}
                {...getLayoutProms()}
                required={false}
                defaultValue={defaultValue || backendValue}
                placeholder={items.label}
                options={dropDownOptions}
                control={control}
                transform={{
                    output: (template: PrimitiveObject) => template?.value,
                    input: (value: string) => {
                        const s = _find(dropDownOptions, {
                            value,
                        });
                        return s;
                    },
                }}
            />
        );
    };
    const renderMultiSelector = () => {
        const dropDownOptions: string[] = [];

        Object.keys(items.options.choices).forEach((key) => {
            dropDownOptions.push(items.options.choices[key]);
        });
        const { defaultValue: backendValue } = items.options;

        return (
            <AppFormMultiSelect
                name={properties.title}
                id={properties.title}
                label={items.label}
                {...getLayoutProms()}
                required={false}
                defaultValue={defaultValue || backendValue}
                placeholder={items.label}
                options={dropDownOptions}
                control={control}
            />
        );
    };
    const renderTextarea = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
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
                name={properties.title}
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
                name={properties.title}
                {...getLayoutProms()}
                {...prps}
                control={control}
            />
        );
    };
    const renderCodeEditor = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
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
            <AppFormCodeEditor
                name={properties.title}
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
                name={properties.title}
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
    const renderImage = () => {
        let prps: AppDataProps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
            defaultValue,
            placeholder: "",
        };
        if (items.translation && translations)
            prps = {
                ...prps,
                label: items.label ? `${items.label} (${activeLanguage})` : "",
                value: getTranslationValue(properties.title),
                onChange: handleTranslationValue,
            };
        return (
            <Col className="form-group" {...getLayoutProms()}>
                <Form.Label>{items.label}</Form.Label>
                <AppUploader
                    accept="image/*"
                    withCropper
                    cropperOptions={{
                        cropBoxResizable: true,
                        aspectRatio: NaN,
                    }}
                    fileInfo={FILETYPEINFO_DESIGN_CONFIGURATION as FileTypeInfo}
                    onFileSelect={(files: File[]) => {
                        if (onFileSelect)
                            onFileSelect(files, properties.title, false);
                    }}
                    onDelete={() => {
                        if (onFileRemove) {
                            onFileRemove(properties.title);
                        }
                    }}
                    imagePath={
                        defaultValue
                            ? `${designConfigBasePath}/${defaultValue}`
                            : ""
                    }
                    {...prps}
                />
            </Col>
        );
    };
    const renderForm = () => {
        switch (properties.items.type) {
            case "TEXT":
                return renderText();
            case "CHOICE":
                return properties.items?.options?.multiple
                    ? renderMultiSelector()
                    : renderDropDown();
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
            case "COLOR_PICKER":
                return renderColor();
            case "CODE_EDITOR":
                return renderCodeEditor();
            case "IMAGE":
                return renderImage();
            default:
                return <></>;
        }
    };

    return <>{renderForm()}</>;
};
