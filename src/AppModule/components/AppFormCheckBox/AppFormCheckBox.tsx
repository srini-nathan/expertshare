import React, { FC } from "react";
import "./assets/scss/style.scss";

export interface AppFormCheckBoxProps {
    label: string;
    name: string;
    className?: string;
    labelPosition: string;
    value: string | number;
    register: any;
    defaultChecked?: boolean;
}

export const AppFormCheckBox: FC<AppFormCheckBoxProps> = ({
    label,
    name,
    labelPosition = "left",
    className,
    register,
    defaultChecked,
}): JSX.Element => {
    const renderClass = () => {
        switch (labelPosition) {
            case "top":
                return "custom-checkbox d-flex flex-column align-items-center align-items-sm-start mb-4";
            case "left":
            default:
                return "custom-checkbox d-flex flex-column  h-100 flex-sm-row text-center align-items-center";
        }
    };

    return (
        <div className={`col-6 mb-3 ${className}`}>
            <div className={renderClass()}>
                {labelPosition === "top" && (
                    <div className="normal-label theme-label-clr mb-1 mb-sm-0">
                        {label}
                    </div>
                )}
                <input
                    className="d-none"
                    type="checkbox"
                    id={name}
                    {...register(name)}
                    defaultChecked={defaultChecked}
                />
                <label className="position-relative mb-0" htmlFor={name} />
                {labelPosition === "left" && (
                    <div className="normal-label ml-3 mb-1 mb-sm-0">
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppFormCheckBox;
