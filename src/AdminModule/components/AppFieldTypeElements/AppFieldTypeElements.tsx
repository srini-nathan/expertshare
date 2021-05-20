import React, { FC, useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AppButton } from "../../../AppModule/components";
import { FieldOptions } from "../../models";

export interface AppFieldTypeElementsProps {
    header: string;
    onAttributeUpdate: any;
    optvalue?: FieldOptions;
    attrValue?: any;
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
    const [inputs, setInputs] = useState<any>(initialValues);

    const onChangeForField = useCallback(
        ({ target }) => {
            setInputs((_state: any) => {
                return {
                    ..._state,
                    [target.name]: target.value,
                };
            });
            onAttributeUpdate({ [inputs.key]: inputs.value });
        },
        [onAttributeUpdate]
    );

    useEffect(() => {
        if (isEditMode) {
            if (optvalue) {
                const { choice } = optvalue!;
                setInputs({
                    key: Object.keys(choice)[0],
                    value: Object.values(choice)[0],
                });
                onAttributeUpdate({
                    [Object.keys(choice)[0]]: Object.values(choice)[0],
                });
            }
            if (attrValue) {
                setInputs({
                    key: Object.keys(attrValue)[0],
                    value: Object.values(attrValue)[0],
                });
                onAttributeUpdate({
                    [Object.keys(attrValue)[0]]: Object.values(attrValue)[0],
                });
            }
        }
    }, []);
    return (
        <Container>
            <Row className="mt-2 pl-3 form-label h6">{header}</Row>
            <Row>
                <Col md={6}>
                    <input
                        key={"key"}
                        name={"key"}
                        placeholder={`${header.replace(/s([^s]*)$/, "$1")} key`}
                        onChange={onChangeForField}
                        className="col-md-12 form-control"
                        value={inputs.key}
                    />
                </Col>
                <Col md={5}>
                    <input
                        key={"key"}
                        name={"value"}
                        placeholder={`${header.replace(
                            /s([^s]*)$/,
                            "$1"
                        )} value`}
                        onChange={onChangeForField}
                        className="col-md-12 form-control"
                        value={inputs.value}
                    />
                </Col>
                <Col md={1}>
                    <AppButton>+</AppButton>
                </Col>
            </Row>
        </Container>
    );
};
