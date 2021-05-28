import React, { FC } from "react";
import ReactDatePicker from "react-datepicker";
import { Control, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/scss/style.scss";

export interface AppDatePickerProps {
    defaultValue?: Date;
    name?: string;
    control?: Control<any>;
}

export const AppDatePicker: FC<AppDatePickerProps> = ({
    defaultValue,
    name = "",
    control,
}): JSX.Element => {
    const dateValue = defaultValue || new Date();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={dateValue}
            render={({ field }) => (
                <ReactDatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    calendarClassName="custom-datepicker"
                    dateFormat="yyyy-M-d"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                />
            )}
        />
    );
};
