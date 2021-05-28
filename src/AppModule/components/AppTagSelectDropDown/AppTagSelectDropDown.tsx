import React, { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { SimpleObject } from "../../models";
import { AppTagSelect } from "../AppTagSelect";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";

export interface AppTagSelectDropDownProps {
    label?: string;
    description?: string;
    options: SimpleObject<string>[];
    selectedItems: SimpleObject<string>[];
    required?: boolean;
    onChange: (item: SimpleObject<string>) => void;
}

export const AppTagSelectDropDown: FC<AppTagSelectDropDownProps> = ({
    label = "",
    options,
    selectedItems,
    onChange,
}): JSX.Element => {
    type Props = {
        onClick: () => void;
        children: any;
    };
    type RefType = number;

    const CustomToggle = React.forwardRef<RefType, Props>(
        ({ children, onClick }, ref) => (
            <div
                className=" custom-dropdown-toggle d-flex"
                ref={ref as React.RefObject<HTMLDivElement>}
                onClick={onClick}
            >
                <AppIcon name="ChevronDown" />
                <span>{children}</span>
            </div>
        )
    );

    return (
        <Dropdown id={`dropdown-button-drop-down`}>
            <Dropdown.Toggle as={CustomToggle}>{label}</Dropdown.Toggle>
            <Dropdown.Menu className="custom-drop-down-menu">
                <AppTagSelect
                    selectedItems={selectedItems}
                    onChange={onChange}
                    options={options}
                />
            </Dropdown.Menu>
        </Dropdown>
    );
};
