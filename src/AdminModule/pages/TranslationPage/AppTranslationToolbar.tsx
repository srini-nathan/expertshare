import React, { FC } from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import {
    AppFormDropdown,
    AppButton,
    AppIcon,
    AppTagSelectDropDown,
} from "../../../AppModule/components";
import { Language } from "../../models";
import { SimpleObject } from "../../../AppModule/models";

import "./assets/scss/style.scss";

export interface AppTranslationToolbarProps {
    onCreateNew: () => void;
    label?: string;
    description?: string;
    options: Language[];
    selectedItems: Language[];
    onChangeSelect: (item: SimpleObject<string>) => void;
}

export const AppTranslationToolbar: FC<AppTranslationToolbarProps> = ({
    onCreateNew,
    options,
    label,
    selectedItems,
    onChangeSelect,
}): JSX.Element => {
    const values: SimpleObject<string>[] = options.map((e) => {
        return {
            id: e.locale,
            value: e.name,
            label: e.name,
        };
    });
    const selectedValues: SimpleObject<string>[] = selectedItems.map((e) => {
        return {
            id: e.locale,
            value: e.name,
            label: e.name,
        };
    });

    return (
        <Col className={" p-0 my-auto translation-page"}>
            <Form className="w-100">
                <Form.Row className="justify-content-end">
                    <Col md="4">
                        <AppTagSelectDropDown
                            options={values}
                            selectedItems={selectedValues}
                            label={label}
                            onChange={onChangeSelect}
                        />
                    </Col>
                    <Col md="2">
                        <AppFormDropdown
                            id="where-filter"
                            defaultValue={{
                                label: "Translation Key",
                                value: "2",
                            }}
                            options={[
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
