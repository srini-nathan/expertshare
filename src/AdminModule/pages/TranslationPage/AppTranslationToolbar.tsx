import React, { FC } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
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
        <Col className={"  translation-page mt-2 "}>
            <Row>
                <Col md={3} sm={6} className="px-1">
                    <AppTagSelectDropDown
                        options={values}
                        selectedItems={selectedValues}
                        label={label}
                        onChange={onChangeSelect}
                    />
                </Col>
                <Col md={3} sm={6} className="px-1">
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
                <Col md={3} sm={6} className="px-1 mt-sm-2 mt-md-0">
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
                <Col md={3} sm={6} className="px-1 mt-sm-2  mt-md-0">
                    <AppButton
                        variant={"secondary"}
                        className="justify-content-center p-1"
                        block
                        onClick={onCreateNew}
                    >
                        + New Group Key
                    </AppButton>
                </Col>
            </Row>
        </Col>
    );
};
