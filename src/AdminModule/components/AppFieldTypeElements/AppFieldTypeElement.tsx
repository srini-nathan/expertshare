import React, { FC, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Controller, useFieldArray } from "react-hook-form";
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

export const AppFieldTypeElement: FC<AppFieldTypeElementProps> = ({
    name,
    control,
    header,
    defaultValue,
    isEditMode,
    errors,
    required,
}): JSX.Element => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });
    const isValidCheck = (value: any) => {
        return !!value;
    };
    useEffect(() => {
        if (isEditMode) {
            if (name === "attr") {
                defaultValue.forEach((e: any) => {
                    Object.keys(e).forEach((b) => {
                        append({ key: b, value: e[b] });
                    });
                });
            } else if (defaultValue.choice) {
                defaultValue.choice.forEach((e: any) => {
                    Object.keys(e).forEach((b) => {
                        append({ key: b, value: e[b] });
                    });
                });
            }
        } else {
            append({ key: "", value: "" });
        }
    }, []);
    return (
        <Container>
            <AppFormLabel label={header} required={required} />
            {fields.map((item: any, index: any) => {
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
                                            errors[name]?.[index]?.key?.message
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
                                        append({ key: "", value: "" })
                                    }
                                >
                                    <AppIcon name="add"></AppIcon>
                                </AppButton>
                            )}
                            {index !== 0 && (
                                <AppButton onClick={() => remove(index)}>
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
