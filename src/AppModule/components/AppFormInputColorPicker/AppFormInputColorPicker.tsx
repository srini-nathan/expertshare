import React, { FC, useRef, useState } from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import { Controller, UseFormSetValue } from "react-hook-form";
import { ChromePicker } from "react-color";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";
import { useInputPlaceholder } from "../../hooks";
import { AppFormLabel } from "../AppFormLabel";

import "./assets/scss/style.scss";

export interface AppFormInputColorPickerProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    setValue: UseFormSetValue<any>;
}

export const AppFormInputColorPicker: FC<AppFormInputColorPickerProps> = ({
    id,
    name,
    defaultValue = "#00FF00",
    placeholder,
    errorMessage,
    label = "",
    description,
    isInvalid,
    isValid,
    required = true,
    control,
    setValue,
    ...props
}): JSX.Element => {
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const { sm = 12, md = 6, lg = 4, xl = 4, className = "" } = props;
    const groupProps = { sm, md, lg, xl, controlId, className, as: Col };
    const labelProps = { label, required, description };
    const controllerProps = { name, defaultValue, control };
    const controlProps = {
        placeholder: placeholderText,
        isValid,
        isInvalid,
    };
    const [visible, setVisible] = useState<boolean>(false);
    const spanRef = useRef<HTMLSpanElement>();
    return (
        <Form.Group
            {...groupProps}
            className={` app-form-input-color-picker ${className}`}
        >
            <AppFormLabel {...labelProps} />
            <InputGroup>
                <Controller
                    {...controllerProps}
                    render={({ field }) => (
                        <Form.Control
                            {...field}
                            onClick={() => {
                                setVisible(true);
                            }}
                            {...controlProps}
                            type={"text"}
                        />
                    )}
                />
                <InputGroup.Append className={`${isInvalid ? "invalid" : ""}`}>
                    <InputGroup.Text onClick={() => setVisible(!visible)}>
                        <span
                            ref={(ref) => {
                                if (ref) {
                                    spanRef.current = ref;
                                }
                            }}
                            style={{ backgroundColor: defaultValue }}
                        ></span>
                    </InputGroup.Text>
                </InputGroup.Append>
                {visible ? (
                    <div className="color-picker-popup">
                        <div
                            className="color-picker-cover"
                            onClick={() => setVisible(false)}
                        />
                        <ChromePicker
                            onChange={({ hex }) => {
                                if (spanRef && spanRef.current) {
                                    spanRef.current.style.backgroundColor = hex;
                                }
                                setValue(name, hex);
                            }}
                        />
                    </div>
                ) : null}
            </InputGroup>
            <Form.Control.Feedback className={"d-block"} type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
