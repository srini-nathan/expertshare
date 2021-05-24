import React, { FC, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Controller, useFieldArray } from "react-hook-form";
import {
    AppButton,
    AppFormInput,
    AppFormLabel,
} from "../../../AppModule/components";

export interface AppFieldTypeElementProps {
    name: string;
    header: string;
    isEditMode: boolean;
    control: any;
    defaultValue: any;
    setValue: any;
    errorMessage?: any;
    required: boolean;
}

export const AppFieldTypeElement: FC<AppFieldTypeElementProps> = ({
    name,
    control,
    header,
    setValue,
    defaultValue,
    isEditMode,
    errorMessage,
    required,
}): JSX.Element => {
    const { fields, append } = useFieldArray({
        control,
        name,
    });

    const addInput = () => {
        append({ key: "", value: "" });
    };

    useEffect(() => {
        if (isEditMode) {
            setValue(name, defaultValue);
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
                                        placeholder={`${header.replace(
                                            /s([^s]*)$/,
                                            "$1"
                                        )} value`}
                                    />
                                )}
                            />
                        </Col>
                        <Col md={1} className="p-0">
                            <AppButton onClick={addInput}>+</AppButton>
                        </Col>
                        {errorMessage && (
                            <div style={{ color: "red" }}>{errorMessage}</div>
                        )}
                    </Row>
                );
            })}
        </Container>
    );
};
