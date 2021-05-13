import React, { FunctionComponent } from "react";
import { Control } from "react-hook-form";
import { Col, Form } from "react-bootstrap";
import { AppFormInput } from "../AppFormInput";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppFormDropdown } from "../AppFormDropdown";
import { PrimitiveObject } from "../../models";
import "./assets/scss/style.scss";

export interface AppFormElementGeneratorProps {
    properties: any;
    defaultValue: any;
    control?: Control<any>;
}
export const AppFormElementGenerator: FunctionComponent<AppFormElementGeneratorProps> = ({
    properties,
    defaultValue,
    control,
}) => {
    const { items } = properties;
    const renderText = () => {
        const prps = {
            type: items.attr ? items.attr.type : "text",
            label: items.label ? items.label : "",
        };
        return (
            <AppFormInput
                md={"6"}
                sm={"12"}
                lg={"4"}
                xl={"4"}
                name={properties.title}
                defaultValue={defaultValue}
                {...prps}
                control={control}
            />
        );
    };
    const renderSwitch = () => {
        const prps = {
            label: items.label ? items.label : "",
        };
        return (
            <AppFormSwitch
                md={"6"}
                sm={"12"}
                lg={"4"}
                xl={"4"}
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
                md={"6"}
                sm={"12"}
                lg={"4"}
                xl={"4"}
                controlId={properties.title}
            >
                <Form.Label>{items.label}</Form.Label>
                <AppFormDropdown id={properties.title} {...prps} />
            </Form.Group>
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
            default:
                return <></>;
        }
    };

    return <>{renderForm()}</>;
};
