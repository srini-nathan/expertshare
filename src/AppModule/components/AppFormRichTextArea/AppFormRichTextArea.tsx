import React, { FC, useState, useRef } from "react";
import { Form, Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { isString as _isString, startCase as _startCase } from "lodash";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { UploadAPI } from "../../apis";

import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min";
import { useBuildAssetPath } from "../../hooks";
import { Upload, FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";

import "./assets/scss/style.scss";
import { useGlobalData } from "../../contexts";

const { Upload: UPLOAD } = CONSTANTS;

const {
    FILETYPE: { FILETYPE_TEXT_EDITOR },
    FILETYPEINFO: { FILETYPEINFO_TEXT_EDITOR },
} = UPLOAD;

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
    className?: string;
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
    className = "",
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
    const ref = useRef<any>(null);
    const { container } = useGlobalData();
    const imagePath = useBuildAssetPath(
        FILETYPEINFO_TEXT_EDITOR as FileTypeInfo
    );
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

    const uploadImage = async (imageObject: Blob, imageName: string) => {
        const fd = new FormData();
        fd.set("file", imageObject, imageName);
        fd.set("fileType", FILETYPE_TEXT_EDITOR);
        fd.set("container", `${container}`);

        return UploadAPI.createResource<Upload, FormData>(fd).then(
            ({ response }) => {
                if (response) {
                    ref.current.editor.image.insert(
                        `${imagePath}/${response.fileName}`,
                        true,
                        { name: response.fileName, id: response.id },
                        "",
                        null
                    );
                }
            }
        );
    };

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
                    <FroalaEditorComponent
                        ref={ref}
                        model={value}
                        onModelChange={(e: string) => {
                            if (onChange) {
                                onChange(e);
                                field.onChange(e);
                            } else {
                                setModel(e);
                                field.onChange(e);
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
                            imageEditButtons: [
                                "imageDisplay",
                                "imageAlign",
                                "imageInfo",
                                "imageRemove",
                                "imageStyle",
                                "imageAlt",
                                "imageSize",
                            ],
                            events: {
                                "image.beforeUpload": (images: any) => {
                                    uploadImage(images[0], images[0].name);
                                    return false;
                                },
                            },
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
