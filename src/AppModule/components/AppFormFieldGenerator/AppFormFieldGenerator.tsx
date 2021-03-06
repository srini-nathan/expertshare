import React, { FunctionComponent, useEffect } from "react";
import { Control } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { find as _find } from "lodash";
import { AppFormInput } from "../AppFormInput";
import { AppFormTextArea } from "../AppFormTextArea";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppFormSelect } from "../AppFormSelect";
import { AppFormRadioGroup } from "../AppFormRadioGroup";
import { AppFormLabel } from "../AppFormLabel";
import { AppDatePicker } from "../AppDatePicker";
import { AppFormCheckBoxGroup } from "../AppFormCheckBoxGroup";
import { PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormFieldGeneratorProps {
    properties: any;
    defaultValue?: any;
    errorMessage?: any;
    control: Control<any>;
    validation: any;
    setValue: any;
    md?: number;
    sm?: number;
    lg?: number;
    xl?: number;
}
export const AppFormFieldGenerator: FunctionComponent<AppFormFieldGeneratorProps> = ({
    properties,
    defaultValue,
    control,
    validation,
    setValue,
    errorMessage,
    md = 6,
    sm = 12,
    lg = 6,
    xl = 6,
}) => {
    const { items } = properties;

    const { t } = useTranslation();

    useEffect(() => {
        if (setValue && defaultValue) {
            setValue(`/api/user_fields/${properties.id}`, defaultValue.value);
        }
    }, []);

    const renderText = (type: string) => {
        return (
            <AppFormInput
                md={md}
                sm={sm}
                lg={lg}
                xl={xl}
                label={t(properties.labelKey)}
                type={type}
                onChange={(e) => {
                    if (setValue) {
                        setValue(`/api/user_fields/${properties.id}`, e);
                    }
                }}
                required={properties.isRequired}
                name={`userField./api/user_fields/${properties.id}`}
                defaultValue={defaultValue ? defaultValue.value : ""}
                // {...properties.attr}
                control={control}
                {...validation}
                errorMessage={errorMessage}
            />
        );
    };
    const renderTextArea = () => {
        return (
            <AppFormTextArea
                md={md}
                sm={sm}
                lg={lg}
                xl={xl}
                {...validation}
                label={t(properties.labelKey)}
                required={properties.isRequired}
                name={`userField./api/user_fields/${properties.id}`}
                defaultValue={defaultValue ? defaultValue.value : ""}
                // {...properties.attr}
                onChange={(e) => {
                    if (setValue) {
                        setValue(
                            `/api/user_fields/${properties.id}`,
                            e.target.value
                        );
                    }
                }}
                control={control}
            />
        );
    };
    const renderDate = () => {
        return (
            <Col className="react-datepicker-container">
                <AppFormLabel
                    label={t(properties.labelKey)}
                    required={properties.isRequired}
                />
                <AppDatePicker
                    md={md}
                    sm={sm}
                    lg={lg}
                    xl={xl}
                    {...validation}
                    label={t(properties.labelKey)}
                    required={properties.isRequired}
                    name={`userField./api/user_fields/${properties.id}`}
                    defaultValue={
                        defaultValue ? new Date(defaultValue.value) : null
                    }
                    // {...properties.attr}
                    control={control}
                />
            </Col>
        );
    };
    const renderSwitch = () => {
        return (
            <Col className="p-0" md={"6"} sm={"12"} lg={"6"} xl={"6"}>
                <AppFormSwitch
                    label={t(properties.labelKey)}
                    md={md}
                    sm={sm}
                    lg={lg}
                    xl={xl}
                    // {...properties.attr}
                    name={`userField./api/user_fields/${properties.id}`}
                    defaultChecked={defaultValue ? defaultValue.value : false}
                    control={control}
                />
            </Col>
        );
    };

    const renderRadio = () => {
        const options: PrimitiveObject[] = [];

        Object.keys(properties.options.choice).forEach((key) => {
            options.push({
                label: properties.options.choice[key],
                name: `userField./api/user_fields/${properties.id}`,
                value: key,
                defaultCheck: defaultValue ? defaultValue.value === key : false,
            });
        });

        return (
            <Col md={6} sm={12}>
                <AppFormLabel
                    label={t(properties.labelKey)}
                    required={properties.isRequired}
                />
                <Row className="m-0">
                    <AppFormRadioGroup
                        setValue={setValue}
                        defaultValue={defaultValue}
                        name={`userField./api/user_fields/${properties.id}`}
                        options={options}
                        {...validation}
                        // {...properties.attr}
                        control={control}
                    />
                </Row>
            </Col>
        );
    };

    const renderCheckBox = () => {
        const options: PrimitiveObject[] = [];
        const defVal: string[] = defaultValue
            ? JSON.parse(defaultValue.value)
            : [];
        Object.keys(properties.options.choice).forEach((key) => {
            options.push({
                label: properties.options.choice[key],
                name: `userField./api/user_fields/${properties.id}.${key}`,
                value: key,
                defaultCheck: defVal && defVal.includes(key),
            });
        });
        return (
            <Col md={6} sm={12}>
                <AppFormLabel
                    label={t(properties.labelKey)}
                    required={properties.isRequired}
                />
                <Row className="m-0">
                    {options.map((e: any) => {
                        return (
                            <AppFormCheckBoxGroup
                                key={e.value}
                                name={e.name}
                                id={e.value}
                                {...validation}
                                value={e.value}
                                label={e.label}
                                // {...properties.attr}
                                defaultChecked={e.defaultCheck}
                                control={control}
                            />
                        );
                    })}
                </Row>
            </Col>
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
        const dropDownOptions: PrimitiveObject[] = [
            {
                label: t("userField.label:selectOptionBlank").toString(),
                name: "",
                value: "",
            },
        ];
        let dropDownDefaultValue = {};

        Object.keys(properties.options.choice).forEach((key) => {
            dropDownOptions.push({
                label: properties.options.choice[key],
                name: `userField./api/user_fields/${properties.id}`,
                value: key,
            });
            if (defaultValue && key && defaultValue.value === key)
                dropDownDefaultValue = {
                    label: properties.options.choice[key],
                    name: `userField./api/user_fields/${properties.id}`,
                    value: key,
                };
        });
        const prps = {
            options: dropDownOptions,
            defaultValue: dropDownDefaultValue,
        };
        return (
            <AppFormSelect
                md={md}
                sm={sm}
                lg={lg}
                xl={xl}
                label={t(properties.labelKey)}
                required={properties.isRequired}
                name={`userField./api/user_fields/${properties.id}`}
                id={properties.labelKey}
                {...prps}
                {...validation}
                // {...properties.attr}
                control={control}
                errorMessage={errorMessage}
                transform={{
                    output: (template: PrimitiveObject) => {
                        if (setValue) {
                            setValue(
                                `/api/user_fields/${properties.id}`,
                                template?.value
                            );
                        }
                        return template?.value;
                    },
                    input: (value: string) => {
                        setValue(`/api/user_fields/${properties.id}`, value);
                        return _find([], {
                            value,
                        });
                    },
                }}
            />
        );
    };

    const renderForm = () => {
        if (!properties.isActive) return <></>;

        switch (properties.fieldType) {
            case "TEXT":
                return renderText("text");
            case "TEXT_NUMBER":
                return renderText("number");
            case "TEXT_EMAIL":
                return renderText("email");
            case "TEXT_URL":
                return renderText("url");
            case "TEXTAREA":
                return renderTextArea();
            case "SELECT":
                return renderDropDown();
            case "SWITCH":
                return renderSwitch();
            case "RADIO_GROUP":
                return renderRadio();
            case "CHECKBOX_GROUP":
                return renderCheckBox();
            case "DATE":
                return renderDate();
            case "SECTION":
                return renderSection();
            case "SEPERATOR":
                return renderSeperator();
            case "BLANK":
                return renderBlank();
            default:
                return <></>;
        }
    };

    return <>{renderForm()}</>;
};
