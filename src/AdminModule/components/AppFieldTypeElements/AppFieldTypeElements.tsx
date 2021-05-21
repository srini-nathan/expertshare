import React, { FC, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AppButton } from "../../../AppModule/components";
import { FieldOptions } from "../../models";

export interface AppFieldTypeElementsProps {
    header: string;
    onAttributeUpdate: any;
    optvalue?: FieldOptions;
    attrValue?: any[];
    isEditMode?: boolean;
}

export const AppFieldTypeElements: FC<AppFieldTypeElementsProps> = ({
    header,
    onAttributeUpdate,
    optvalue,
    attrValue,
    isEditMode,
}): JSX.Element => {
    const initialValues = {
        key: "",
        value: "",
    };
    const [inputs, setInputs] = useState<any[]>([]);

    const onChangeForField = (prop: any, event: any, index: any) => {
        const old = inputs[index];
        const updated = { ...old, [prop]: event.target.value };
        const clone = [...inputs];
        clone[index] = updated;
        setInputs(clone);
    };

    const addInput = () => {
        setInputs((oldArray) => [...oldArray, initialValues]);
        onAttributeUpdate(
            inputs.map((ipt) => {
                ipt = { [ipt.key]: ipt.value };
                return ipt;
            })
        );
    };
    useEffect(() => {
        if (isEditMode) {
            if (optvalue) {
                const { choice } = optvalue;
                choice.map((opt) =>
                    Object.assign(opt, {
                        key: Object.keys(opt)[0],
                        value: Object.values(opt)[0],
                    })
                );
                setInputs(choice);
                onAttributeUpdate(choice);
            }
            if (attrValue) {
                attrValue.map((attr) =>
                    Object.assign(attr, {
                        key: Object.keys(attr)[0],
                        value: Object.values(attr)[0],
                    })
                );
                setInputs(attrValue);
                onAttributeUpdate(attrValue);
            }
        }
        setInputs((oldArray) => [...oldArray, initialValues]);
    }, [setInputs]);
    return (
        <Container>
            <Row className="mt-2 pl-3 form-label h6">{header}</Row>
            {inputs.map((inp: any, index: any) => {
                return (
                    <Row style={{ marginBottom: "10px" }}>
                        <Col md={6}>
                            <input
                                key={"key"}
                                name={"key"}
                                placeholder={`${header.replace(
                                    /s([^s]*)$/,
                                    "$1"
                                )} key`}
                                onChange={(e) =>
                                    onChangeForField("key", e, index)
                                }
                                className="col-md-12 form-control"
                                value={inp.key}
                            />
                        </Col>
                        <Col md={5}>
                            <input
                                key={"value"}
                                name={"value"}
                                placeholder={`${header.replace(
                                    /s([^s]*)$/,
                                    "$1"
                                )} value`}
                                onChange={(e) =>
                                    onChangeForField("value", e, index)
                                }
                                className="col-md-12 form-control"
                                value={inp.value}
                            />
                        </Col>
                        <Col md={1}>
                            <AppButton onClick={addInput}>+</AppButton>
                        </Col>
                    </Row>
                );
            })}
        </Container>
    );
};
