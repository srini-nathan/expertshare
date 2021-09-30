import React, { ChangeEventHandler, FC, useState } from "react";
import { Form } from "react-bootstrap";
import { Controller } from "react-hook-form";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";
import { useGridHelper, useInputPlaceholder } from "../../hooks";
import { AppButton } from "../AppButton";
import { AppFormLabel } from "../AppFormLabel";
import "./assets/scss/style.scss";

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
    block,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>(defaultValue);
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const {
        sm = 12,
        md = block ? 12 : 6,
        lg = block ? 12 : 4,
        xl = block ? 12 : 4,
        className = "",
    } = props;
    const labelProps = { label, required, maxCount, description };
    const controllerProps = { name, defaultValue, control };
    const controlProps = {
        placeholder: placeholderText,
        isValid,
        isInvalid,
        rows,
    };
    const { getColumnClasses } = useGridHelper();
    const colClasses = getColumnClasses(sm, md, lg, xl);
    let valueController = {};
    if (value)
        valueController = {
            value,
        };
    return (
        <Form.Group
            className={`col form-group ${colClasses} ${className}`}
            controlId={controlId}
        >
            {!isSend && <AppFormLabel counter={data?.length} {...labelProps} />}
            <Controller
                {...controllerProps}
                render={({ field }) => (
                    <Form.Control
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
        </Form.Group>
    );
};
