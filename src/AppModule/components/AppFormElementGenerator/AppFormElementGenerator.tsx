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
                lg={"6"}
                xl={"6"}
                name={properties.title}
                value={defaultValue}
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
                lg={"6"}
                xl={"6"}
                name={properties.title}
                {...prps}
                defaultChecked={defaultValue}
                control={control}
            />
        );
    };
    const renderDropDown = () => {
        const dropDownOptions: PrimitiveObject[] = [];
        let dropDownDefaultValue = {};

        Object.keys(items.options.choices).forEach((key) => {
            dropDownOptions.push({
                label: key,
                name: properties.title,
                value: items.options.choices[key],
            });
            if (
                items.options.defaultValue.toUpperCase() ===
                items.options.choices[key].toUpperCase()
            )
                dropDownDefaultValue = {
                    label: key,
                    value: items.options.choices[key],
                };
        });
        const prps = {
            options: dropDownOptions,
            defaultValue: dropDownDefaultValue,
        };
        return (
            <Form.Group
                as={Col}
                md={6}
                sm={12}
                lg={6}
                xl={6}
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
            default:
                return <Col md={6} sm={12} lg={6} xl={6}></Col>;
        }
    };

    return <>{renderForm()}</>;
};
