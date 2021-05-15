import React, { FC, useState } from "react";
import { Form, Col, InputGroup } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { AppIcon } from "../AppIcon";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";
import { useInputPlaceholder } from "../../hooks";
import { AppFormLabel } from "../AppFormLabel";

import "./assets/scss/style.scss";

export interface AppFormInputPasswordProps
    extends AppFormElementProps,
        AppFormLayoutProps,
        AppReactHookFormProps {
    maxCount?: number;
}

export const AppFormInputPassword: FC<AppFormInputPasswordProps> = ({
    id,
    name,
    defaultValue = "",
    placeholder,
    errorMessage,
    label = "",
    description,
    isInvalid,
    isValid,
    required = true,
    maxCount,
    control,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>(defaultValue);
    const placeholderText = useInputPlaceholder(name, placeholder, label);
    const controlId = id || name;
    const { sm = 12, md = 6, lg = 4, xl = 4, className = "" } = props;
    const groupProps = { sm, md, lg, xl, controlId, className, as: Col };
    const labelProps = { label, required, maxCount, description };
    const controllerProps = { name, defaultValue, control };
    const controlProps = {
        placeholder: placeholderText,
        isValid,
        isInvalid,
    };
    const [showPass, isShowPass] = useState<boolean>(false);
    return (
        <Form.Group {...groupProps} className={className}>
            <AppFormLabel counter={data?.length} {...labelProps} />
            <InputGroup>
                <Controller
                    {...controllerProps}
                    render={({ field }) => (
                        <Form.Control
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                setData(e.target.value);
                            }}
                            {...controlProps}
                            type={showPass ? "text" : "password"}
                        />
                    )}
                />
                <InputGroup.Append className={`${isInvalid ? "invalid" : ""}`}>
                    <InputGroup.Text onClick={() => isShowPass(!showPass)}>
                        {showPass ? (
                            <AppIcon name="EyeOff" />
                        ) : (
                            <AppIcon name="Eye" />
                        )}
                    </InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
