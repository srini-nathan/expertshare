import React, { FC } from "react";
import { Form, Col, Row } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { isString as _isString, startCase as _startCase } from "lodash";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import "./assets/scss/style.scss";
import { AppIcon } from "../AppIcon";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONFIGURATION },
} = UPLOAD;
const { path } = FILETYPEINFO_CONFIGURATION;

export interface AppFormFileProps {
    id?: string;
    name: string;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
    defaultValue?: string;
    placeholder?: string | boolean;
    required?: boolean;
    label?: string;
    description?: string;
    errorMessage?: string;
    value?: string;
    withCounter?: boolean;
    maxCount?: number;
    onFileSelect?: (files: File[]) => void;
    control?: Control<any>;
}

export const AppFormFile: FC<AppFormFileProps> = ({
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
    control,
    onFileSelect = () => {},
}): JSX.Element => {
    const controlId = id || name;
    let placeholderText = "";
    const settingFilePath = useBuildAssetPath(path, value);

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
            <Row className="m-0 w-100 custom-file--container">
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Form.File
                            label={label}
                            id={controlId}
                            placeholder={placeholderText}
                            {...field}
                            custom
                            onChange={(e: any) => {
                                onFileSelect(e.target.files);
                            }}
                        />
                    )}
                />

                <a
                    target="_blank"
                    href={settingFilePath}
                    onClick={(e) => {
                        if (!value) {
                            e.preventDefault();
                        }
                    }}
                    className={`btn btn-secondary ${!value && "disabled"}`}
                >
                    <AppIcon name="Download" />
                </a>
            </Row>

            <Form.Control.Feedback
                type="invalid"
                className={required ? "d-block" : ""}
            >
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
