import React, { ChangeEventHandler, FC } from "react";
import { FormCheck } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppSwitchProps {
    id: string;
    name: string;
    value: boolean;
    label?: string;
    size?: "lg" | "sm";
    onChange?: ChangeEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

export const AppSwitch: FC<AppSwitchProps> = ({
    id,
    name,
    value,
    label = "",
    size = "lg",
    onChange = () => {},
    disabled = false,
}): JSX.Element => {
    return (
        <FormCheck
            type="switch"
            id={id}
            className={size}
            name={name}
            defaultChecked={value}
            label={label}
            onChange={onChange}
            disabled={disabled}
        />
    );
};
