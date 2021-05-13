import React, { FC, useState } from "react";
import { Form, Col } from "react-bootstrap";
import "./assets/scss/style.scss";
import { Control } from "react-hook-form";
import { AppFormInput } from "../AppFormInput";
import { AppIcon } from "../AppIcon";

export interface AppFormInputPasswordProps {
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
    isInvalid?: boolean;
    isValid?: boolean;
    maxCount?: number;
    control?: Control<any>;
}

export const AppFormInputPassword: FC<AppFormInputPasswordProps> = ({
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
    isInvalid,
    isValid,
    required = false,
    maxCount = 25,
    control,
}): JSX.Element => {
    const [showPass, isShowPass] = useState<boolean>(false);
    return (
        <Form.Group as={Col} md={md} sm={sm} lg={lg} xl={xl} className="p-0">
            <AppFormInput
                id={id}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                name={name}
                defaultValue={value}
                type={showPass ? "text" : "password"}
                placeholder={placeholder}
                label={label}
                errorMessage={errorMessage}
                description={description}
                isInvalid={isInvalid}
                isValid={isValid}
                required={required}
                maxCount={maxCount}
                control={control}
            />
            <div
                className={`show-password ${
                    (isValid || isInvalid) && "invalid"
                }`}
                onClick={() => isShowPass(!showPass)}
            >
                {showPass ? <AppIcon name="EyeOff" /> : <AppIcon name="Eye" />}
            </div>
        </Form.Group>
    );
};
