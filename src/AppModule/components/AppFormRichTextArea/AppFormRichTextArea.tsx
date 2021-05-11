import React, { FC, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { isString as _isString, startCase as _startCase } from "lodash";
import FroalaEditor from "react-froala-wysiwyg";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "./assets/scss/style.scss";

export interface AppFormRichTextAreaProps {
    id?: string;
    name: string;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    value?: string;
    placeholder?: string | boolean;
    required?: boolean;
    label?: string;
    description?: string;
    errorMessage?: string;
    withCounter?: boolean;
    maxCount?: number;
    control?: Control<any>;
}

export const AppFormRichTextArea: FC<AppFormRichTextAreaProps> = ({
    id,
    name,
    value = "",
    placeholder,
    errorMessage,
    label = "",
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    required = false,
    withCounter = false,
    maxCount = 25,
    control,
}): JSX.Element => {
    const [model, setModel] = useState<string>(value);
    const controlId = id || name;
    let placeholderText = "";

    if (placeholder !== false) {
        placeholderText = _isString(placeholder)
            ? placeholder
            : `Enter ${_startCase(label) || _startCase(name)}`;
    }
    return (
        <Form.Group
            as={Col}
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            controlId={controlId}
        >
            {label?.length > 0 ? (
                <Form.Label>
                    {label}
                    {required && <span className="required">*</span>}
                    {description && (
                        <div className="custom-input-description">
                            <span>i</span>
                            <div className="custom-input-description-content">
                                {description}
                            </div>
                        </div>
                    )}
                </Form.Label>
            ) : null}
            <Controller
                name={name}
                defaultValue={value}
                control={control}
                render={() => (
                    <FroalaEditor
                        model={model}
                        onModelChange={setModel}
                        tag="textarea"
                        config={{
                            placeholderText,
                            value,
                            charCounterCount: withCounter,
                            charCounterMax: maxCount,
                        }}
                    />
                )}
            />

            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
