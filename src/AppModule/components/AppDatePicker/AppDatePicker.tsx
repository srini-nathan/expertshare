import React, { FC, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Control, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/scss/style.scss";

export interface AppDatePickerProps {
    value?: Date;
    name?: string;
    control: Control<any>;
    onChange: (
        date: Date | [Date, Date] | /* for selectsRange */ null,
        event: React.SyntheticEvent<any> | undefined
    ) => void;
}

export const AppDatePicker: FC<AppDatePickerProps> = ({
    value,
    name = "",
    control,
}): JSX.Element => {
    const dateValue = value || new Date();
    const [date, setDate] = useState<Date>(new Date(dateValue));

    /* eslint-disable no-console */
    console.log(dateValue, date, value, new Date(dateValue));
    /* eslint-enable no-console */
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={date.toString()}
            render={() => (
                <ReactDatePicker
                    name={name}
                    selected={date}
                    onChange={(e) => setDate(e as Date)}
                    calendarClassName="custom-datepicker"
                    dateFormat="d-M-yyyy"
                />
            )}
        />
    );
};
