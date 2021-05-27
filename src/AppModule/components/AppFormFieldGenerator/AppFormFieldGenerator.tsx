import React, { FunctionComponent } from "react";
import { Control } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import { find as _find } from "lodash";
import { AppFormInput } from "../AppFormInput";
import { AppFormTextArea } from "../AppFormTextArea";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppFormSelect } from "../AppFormSelect";
import { AppFormRadio } from "../AppFormRadio";
import { AppFormLabel } from "../AppFormLabel";
import { AppDatePicker } from "../AppDatePicker";
import { AppFormCheckBox2 } from "../AppFormCheckBox2";
import { PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormFieldGeneratorProps {
    properties: any;
    defaultValue?: any;
    control: Control<any>;
}
export const AppFormFieldGenerator: FunctionComponent<AppFormFieldGeneratorProps> = ({
    properties,
    defaultValue,
    control,
}) => {
    const { items } = properties;
    const renderText = (type: string) => {
        return (
            <AppFormInput
                md={"6"}
                sm={"12"}
                lg={"6"}
                xl={"6"}
                label={properties.labelKey}
                type={type}
                required={properties.isRequired}
                name={`userField./api/user_fields/${properties.id}`}
                defaultValue={defaultValue ? defaultValue.value : ""}
                {...properties.attr}
                control={control}
            />
        );
    };
    const renderTextArea = () => {
        return (
            <AppFormTextArea
                md={"6"}
                sm={"12"}
                lg={"6"}
                xl={"6"}
                label={properties.labelKey}
                required={properties.isRequired}
                name={`userField./api/user_fields/${properties.id}`}
                defaultValue={defaultValue ? defaultValue.value : ""}
                {...properties.attr}
                control={control}
            />
        );
    };
    const renderDate = () => {
        /* eslint-disable no-console */
        console.log(defaultValue);
        /* eslint-enable no-console */
        return (
            <Col className="react-datepicker-container">
                <AppFormLabel
                    label={properties.labelKey}
                    required={properties.isRequired}
                />
                <AppDatePicker
                    md={"6"}
                    sm={"12"}
                    lg={"6"}
                    xl={"6"}
                    label={properties.labelKey}
                    required={properties.isRequired}
                    name={`userField./api/user_fields/${properties.id}`}
                    defaultValue={defaultValue ? defaultValue.value : ""}
                    {...properties.attr}
                    control={control}
                />
            </Col>
        );
    };
    const renderSwitch = () => {
        return (
            <AppFormSwitch
                md={"6"}
                label={properties.labelKey}
                sm={"12"}
                lg={"6"}
                xl={"6"}
                {...properties.attr}
                name={`userField./api/user_fields/${properties.id}`}
                defaultChecked={defaultValue ? defaultValue.value : false}
                control={control}
            />
        );
    };

    const renderRadio = () => {
        const options: PrimitiveObject[] = [];

        Object.keys(properties.options.choice).forEach((key) => {
            options.push({
                label: properties.options.choice[key],
                name: `userField./api/user_fields/${properties.id}`,
                value: key,
                defaultCheck: defaultValue && defaultValue.value === key,
            });
        });

        return (
            <Col md={6} sm={12}>
                <AppFormLabel
                    label={properties.labelKey}
                    required={properties.isRequired}
                />
                <Row className="m-0">
                    {options.map((e: any) => {
                        return (
                            <AppFormRadio
                                key={e.value}
                                md={"6"}
                                name={e.name}
                                id={e.value}
                                value={e.value}
                                label={e.label}
                                sm={"12"}
                                lg={"6"}
                                xl={"6"}
                                {...properties.attr}
                                defaultChecked={e.defaultCheck}
                                control={control}
                            />
                        );
                    })}
                </Row>
            </Col>
        );
    };

    const renderCheckBox = () => {
        const options: PrimitiveObject[] = [];
        // const defVal: string[] = defaultValue
        //     ? JSON.parse(defaultValue.value)
        //     : [];
        Object.keys(properties.options.choice).forEach((key) => {
            options.push({
                label: properties.options.choice[key],
                name: `userField./api/user_fields/${properties.id}[]`,
                value: key,
            });
        });
        return (
            <Col md={6} sm={12}>
                <AppFormLabel
                    label={properties.labelKey}
                    required={properties.isRequired}
                />
                <Row className="m-0">
                    <AppFormCheckBox2
                        name={`userField./api/user_fields/${properties.id}`}
                        id={`userField./api/user_fields/${properties.id}`}
                        options={options}
                        {...properties.attr}
                        control={control}
                    />
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
        const dropDownOptions: PrimitiveObject[] = [];
        let dropDownDefaultValue = {};

        Object.keys(properties.options.choice).forEach((key) => {
            dropDownOptions.push({
                label: properties.options.choice[key],
                name: `userField./api/user_fields/${properties.id}`,
                value: key,
            });
            if (
                defaultValue &&
                defaultValue.value.toUpperCase() === key.toUpperCase()
            )
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
                md={"6"}
                sm={"12"}
                lg={"6"}
                xl={"6"}
                label={properties.labelKey}
                required={properties.isRequired}
                name={`userField./api/user_fields/${properties.id}`}
                id={properties.labelKey}
                {...prps}
                {...properties.attr}
                control={control}
                transform={{
                    output: (template: PrimitiveObject) => template?.value,
                    input: (value: string) => {
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
