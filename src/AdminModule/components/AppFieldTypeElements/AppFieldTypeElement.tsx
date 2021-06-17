import React, { FC, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Controller } from "react-hook-form";
import {
    AppButton,
    AppFormInput,
    AppFormLabel,
    AppIcon,
} from "../../../AppModule/components";

export interface AppFieldTypeElementProps {
    name: string;
    header: string;
    isEditMode: boolean;
    control: any;
    defaultValue: any;
    setValue: any;
    errors?: any;
    required: boolean;
}

interface Value {
    key: string;
    value: string;
}

export const AppFieldTypeElement: FC<AppFieldTypeElementProps> = ({
    name,
    control,
    header,
    defaultValue,
    isEditMode,
    errors,
    required,
}): JSX.Element => {
    const [values, setValues] = useState<Value[]>();

    const isValidCheck = (value: any) => {
        return !!value;
    };
    useEffect(() => {
        if (isEditMode) {
            const items: Value[] = [];
            if (name === "attr") {
                defaultValue.forEach((e: any) => {
                    Object.keys(e).forEach((b) => {
                        items.push({ key: b, value: e[b] });
                    });
                });
            } else if (defaultValue.choice) {
                Object.keys(defaultValue.choice).forEach((e) => {
                    items.push({
                        key: e,
                        value: defaultValue.choice[e],
                    });
                });
            }

            if (items.length === 0) items.push({ key: "", value: "" });

            setValues(items);
        } else {
            setValues([{ key: "", value: "" }]);
        }
    }, []);
    useEffect(() => {
        // eslint-disable-next-line no-console
        console.log(values);
    }, [values]);
    return (
        <Container>
            <AppFormLabel label={header} required={required} />
            {values &&
                values.map((item: any, index: any) => {
                    return (
                        <Row key={index} style={{ marginBottom: "8px" }}>
                            <Col md={6} className="pl-0">
                                <Controller
                                    name={`${name}[${index}].key`}
                                    defaultValue={item.key}
                                    control={control}
                                    render={() => (
                                        <AppFormInput
                                            md={12}
                                            lg={12}
                                            sm={12}
                                            xl={12}
                                            name={`${name}[${index}].key`}
                                            placeholder={`${header.replace(
                                                /s([^s]*)$/,
                                                "$1"
                                            )} key`}
                                            isInvalid={isValidCheck(
                                                errors[name]?.[index]?.key
                                            )}
                                            errorMessage={
                                                errors[name]?.[index]?.key
                                                    ?.message
                                            }
                                            defaultValue={item.key}
                                            control={control}
                                        />
                                    )}
                                />
                            </Col>
                            <Col md={5} className="p-0">
                                <Controller
                                    name={`${name}[${index}].value`}
                                    defaultValue={item.value}
                                    control={control}
                                    render={() => (
                                        <AppFormInput
                                            name={`${name}[${index}].value`}
                                            defaultValue={item.value}
                                            control={control}
                                            md={12}
                                            lg={12}
                                            sm={12}
                                            xl={12}
                                            isInvalid={isValidCheck(
                                                errors[name]?.[index]?.value
                                            )}
                                            errorMessage={
                                                errors[name]?.[index]?.value
                                                    ?.message
                                            }
                                            placeholder={`${header.replace(
                                                /s([^s]*)$/,
                                                "$1"
                                            )} value`}
                                        />
                                    )}
                                />
                            </Col>
                            <Col md={1}>
                                {index === 0 && (
                                    <AppButton
                                        onClick={() =>
                                            setValues([
                                                ...values,
                                                { key: "", value: "" },
                                            ])
                                        }
                                    >
                                        <AppIcon name="add"></AppIcon>
                                    </AppButton>
                                )}
                                {index !== 0 && (
                                    <AppButton
                                        onClick={() => {
                                            setValues([
                                                ...values.splice(0, index),
                                                ...values.splice(index + 1),
                                            ]);
                                        }}
                                    >
                                        <AppIcon name="delete"></AppIcon>
                                    </AppButton>
                                )}
                            </Col>
                        </Row>
                    );
                })}
        </Container>
    );
};
