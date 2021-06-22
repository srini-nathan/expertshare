import React, { FC, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { isString as _isString, startCase as _startCase } from "lodash";
import FroalaEditorComponent from "react-froala-wysiwyg";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min";

import "./assets/scss/style.scss";
import { useGlobalData } from "../../contexts";

export interface AppFormRichTextAreaProps {
    id?: string;
    name: string;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    defaultValue?: string;
    value?: string;
    placeholder?: string | boolean;
    required?: boolean;
    onChange?: (value: string) => void;
    label?: string;
    description?: string;
    errorMessage?: string;
    withCounter?: boolean;
    maxCount?: number;
    minHeight?: number;
    control?: Control<any>;
}

export const AppFormRichTextArea: FC<AppFormRichTextAreaProps> = ({
    id,
    name,
    defaultValue = "",
    minHeight = 250,
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
    onChange,
}): JSX.Element => {
    let val = defaultValue;
    if (value) val = value;
    const [model, setModel] = useState<string>(val);
    const { container } = useGlobalData();
    let authKey = "";
    if (
        container &&
        container.configuration &&
        (container?.configuration as any).froalaEditorKey
    )
        authKey = (container?.configuration as any).froalaEditorKey;
    const controlId = id || name;
    let placeholderText = "";

    if (placeholder !== false) {
        placeholderText = _isString(placeholder)
            ? placeholder
            : `Enter ${_startCase(label) || _startCase(name)}`;
    }

    return (
        <Col md={md} sm={sm} lg={lg} xl={xl} className="form-group">
            {label?.length > 0 ? (
                <Form.Label id={controlId}>
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
                defaultValue={val}
                control={control}
                render={({ field }) => (
                    <FroalaEditorComponent
                        model={value && onChange ? value : model}
                        onModelChange={(e: string) => {
                            if (onChange) {
                                onChange(e);
                            } else {
                                field.onChange(e);
                                setModel(e);
                            }
                        }}
                        tag="textarea"
                        config={{
                            key: authKey,
                            placeholderText,
                            value: val,
                            charCounterCount: withCounter,
                            charCounterMax: maxCount,
                            heightMin: minHeight,
                        }}
                    />
                )}
            />
            <Form.Control.Feedback
                type="invalid"
                className={required && !model ? "d-inline" : ""}
            >
                {errorMessage}
            </Form.Control.Feedback>
        </Col>
    );
};
