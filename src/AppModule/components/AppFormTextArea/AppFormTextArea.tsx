import React, { ChangeEventHandler, FC, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";

import { AppButton } from "../AppButton";

import "./assets/scss/style.scss";
import { useInputPlaceholder } from "../../hooks";
import { AppFormLabel } from "../AppFormLabel";

export interface AppFormTextAreaProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    maxCount?: number;
    isSend?: boolean;
    rows?: number;
    onChange?: ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;
    disabled?: boolean;
    onBlurHandler?: (value: React.FocusEvent<HTMLTextAreaElement>) => void;
    value?: string;
}

export const AppFormTextArea: FC<AppFormTextAreaProps> = ({
    id,
    name,
    defaultValue = "",
    placeholder,
    errorMessage,
    label = "",
    description,
    disabled = false,
    isInvalid,
    isValid,
    required = true,
    maxCount,
    control,
    rows = 5,
    onChange,
    onBlurHandler,
    isSend,
    value,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>(defaultValue);
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const { sm = 12, md = 6, lg = 4, xl = 4, className = "" } = props;
    const groupProps = {
        sm: sm as number,
        md: md as number,
        lg: lg as number,
        xl: xl as number,
    };
    const labelProps = { label, required, maxCount, description };
    const controllerProps = { name, defaultValue, control };
    const controlProps = {
        placeholder: placeholderText,
        isValid,
        isInvalid,
        rows,
    };
    let valueController = {};
    if (value)
        valueController = {
            value,
        };
    return (
        <Col {...groupProps} className={`mb-0 form-group ${className}`}>
            {!isSend && <AppFormLabel counter={data?.length} {...labelProps} />}
            <Controller
                {...controllerProps}
                render={({ field }) => (
                    <Form.Control
                        id={controlId}
                        {...field}
                        as="textarea"
                        disabled={disabled}
                        onChange={(e) => {
                            if (onChange) {
                                onChange(e);
                            }
                            field.onChange(e);
                            setData(e.target.value);
                        }}
                        onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                            if (onBlurHandler) onBlurHandler(e);
                        }}
                        {...controlProps}
                        {...valueController}
                    />
                )}
            />

            {isSend && (
                <div className="is-send-wrapper">
                    <i className="far fa-smile smile-icon">|</i>

                    <AppButton className="sent-btn" variant="light">
                        Send
                    </AppButton>
                </div>
            )}

            {!isSend && (
                <Form.Control.Feedback type="invalid" className=" d-block">
                    {errorMessage}
                </Form.Control.Feedback>
            )}
        </Col>
    );
};
