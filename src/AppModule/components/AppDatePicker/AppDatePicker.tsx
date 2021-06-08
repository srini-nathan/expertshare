import React, { FC } from "react";
import ReactDatePicker from "react-datepicker";
import { Control, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/scss/style.scss";

export interface AppDatePickerProps {
    defaultValue?: Date;
    name?: string;
    dateFormat?: string;
    showTimeSelect?: boolean;
    showTimeInput?: boolean;
    control?: Control<any>;
}

export const AppDatePicker: FC<AppDatePickerProps> = ({
    defaultValue,
    name = "",
    dateFormat = "yyyy-M-d",
    control,
    showTimeSelect = false,
    showTimeInput = false,
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
                    dateFormat={dateFormat}
                    showMonthDropdown
                    showYearDropdown
                    showTimeSelect={showTimeSelect as boolean}
                    showTimeInput={showTimeInput}
                    dropdownMode="select"
                />
            )}
        />
    );
};
