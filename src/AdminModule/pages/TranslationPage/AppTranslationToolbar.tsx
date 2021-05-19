import React, { FC } from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import {
    AppFormDropdown,
    AppButton,
    AppIcon,
} from "../../../AppModule/components";
import "./assets/scss/style.scss";

export interface AppTranslationToolbarProps {
    onCreateNew: () => void;
}

export const AppTranslationToolbar: FC<AppTranslationToolbarProps> = ({
    onCreateNew,
}): JSX.Element => {
    return (
        <Col className={" p-0 translation-page"}>
            <Form className="w-100">
                <Form.Row>
                    <Col md="4">
                        <AppFormDropdown
                            id="language-filter"
                            defaultValue={{
                                label: "Included Language (8)",
                                value: 0,
                            }}
                            options={[
                                {
                                    label: "Included Language (8)",
                                    value: 0,
                                },
                            ]}
                        />
                    </Col>
                    <Col md="2">
                        <AppFormDropdown
                            id="where-filter"
                            defaultValue={{
                                label: "Everywhere",
                                value: "1",
                            }}
                            options={[
                                {
                                    label: "Everywhere",
                                    value: "1",
                                },
                                {
                                    label: "Translation Group",
                                    value: "2",
                                },
                                {
                                    label: "Translation Key",
                                    value: "3",
                                },
                                {
                                    label: "Translation Value",
                                    value: "4",
                                },
                            ]}
                        />
                    </Col>
                    <Col md="auto">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <AppIcon name="Search" />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                placeholder="Search ..."
                                type={"search"}
                            ></Form.Control>
                        </InputGroup>
                    </Col>
                    <Col md="auto">
                        <AppButton variant={"secondary"} onClick={onCreateNew}>
                            + New Group Key
                        </AppButton>
                    </Col>
                </Form.Row>
            </Form>
        </Col>
    );
};
