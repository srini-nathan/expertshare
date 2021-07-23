import React, { FC, useState } from "react";
import { Form, Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-github";

export interface AppFormCodeEditorProps {
    id?: string;
    name: string;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    defaultValue?: string;
    value?: string;
    required?: boolean;
    onChange?: (value: string) => void;
    label?: string;
    description?: string;
    errorMessage?: string;
    className?: string;
    minHeight?: number;
    control?: Control<any>;
}

export const AppFormCodeEditor: FC<AppFormCodeEditorProps> = ({
    id,
    name,
    defaultValue = "",
    value = "",
    className = "",
    errorMessage,
    label = "",
    description,
    sm = 12,
    md = 6,
    lg = 4,
    xl = 4,
    required = false,
    control,
    onChange,
}): JSX.Element => {
    let val = defaultValue;
    if (value) val = value;
    const [model, setModel] = useState<string>(val);
    const controlId = id || name;

    return (
        <Col
            md={md}
            sm={sm}
            lg={lg}
            xl={xl}
            className={`form-group ${className}`}
        >
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
                    <AceEditor
                        mode="css"
                        theme="github"
                        name={name}
                        onChange={(e) => {
                            field.onChange(e);
                            if (onChange) {
                                onChange(e);
                            } else {
                                setModel(e);
                            }
                        }}
                        defaultValue={defaultValue ?? ""}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2,
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
