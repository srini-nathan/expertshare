import React, { FC, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Controller } from "react-hook-form";
import { AppIcon } from "../AppIcon";
import {
    AppFormElementProps,
    AppFormLayoutProps,
    AppReactHookFormProps,
} from "../../models";
import { useGridHelper, useInputPlaceholder } from "../../hooks";
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
    };
    const [showPass, isShowPass] = useState<boolean>(false);

    const { getColumnClasses } = useGridHelper();
    const colClasses = getColumnClasses(sm, md, lg, xl);

    return (
        <Form.Group
            className={`col form-group ${colClasses} ${className}`}
            controlId={controlId}
        >
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
            <Form.Control.Feedback className={"d-block"} type="invalid">
                {errorMessage}
            </Form.Control.Feedback>
        </Form.Group>
    );
};
