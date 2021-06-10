import React, { FC, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Control, Controller } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/scss/style.scss";
import { InputGroup } from "react-bootstrap";
import { AppIcon } from "../AppIcon";

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
    const [open, setOpen] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={dateValue}
            render={({ field }) => (
                <InputGroup>
                    <ReactDatePicker
                        selected={field.value}
                        onInputClick={() => {
                            setOpen(true);
                        }}
                        onChange={(...e) => {
                            setOpen(!open);
                            field.onChange(...e);
                        }}
                        calendarClassName="custom-datepicker"
                        dateFormat={dateFormat}
                        showTimeSelect={showTimeSelect as boolean}
                        showTimeInput={showTimeInput}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        open={open}
                        onClickOutside={() => {
                            setOpen(false);
                        }}
                    />
                    <InputGroup.Append>
                        <InputGroup.Text
                            onClick={() => {
                                setOpen(!open);
                            }}
                        >
                            <AppIcon name="calendar" />
                        </InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            )}
        />
    );
};
