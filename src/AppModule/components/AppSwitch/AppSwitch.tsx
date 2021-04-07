import React, { ChangeEventHandler, FC } from "react";
import { FormCheck } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface AppSwitchProps {
    id: string;
    name: string;
    value: boolean;
    label?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const AppSwitch: FC<AppSwitchProps> = ({
    id,
    name,
    value,
    label = "",
    onChange = () => {},
}): JSX.Element => {
    return (
        <FormCheck
            type="switch"
            id={id}
            name={name}
            defaultChecked={value}
            label={label}
            onChange={onChange}
        />
    );
};
