import React, { FC } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/scss/style.scss";

export interface AppDatePickerProps {
    value: Date;
    onChange: (
        date: Date | [Date, Date] | /* for selectsRange */ null,
        event: React.SyntheticEvent<any> | undefined
    ) => void;
}

export const AppDatePicker: FC<AppDatePickerProps> = ({
    value,
    onChange = () => {},
}): JSX.Element => {
    return <ReactDatePicker selected={value} inline onChange={onChange} />;
};
