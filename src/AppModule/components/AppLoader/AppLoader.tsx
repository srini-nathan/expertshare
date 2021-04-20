import React, { CSSProperties, FC } from "react";
import { Spinner } from "react-bootstrap";
import { Variant } from "react-bootstrap/types";
import "./assets/scss/style.scss";

export interface AppLoaderProps {
    containerClassName?: string;
    containerStyle?: CSSProperties;
    spinnerClassName?: string;
    spinnerContainerStyle?: CSSProperties;
    spinnerAnimation?: "border" | "grow";
    spinnerSize?: "sm";
    spinnerVariant?: Variant;
}

export const AppLoader: FC<AppLoaderProps> = ({
    containerClassName,
    containerStyle,
    spinnerClassName,
    spinnerContainerStyle,
    spinnerAnimation = "border",
    spinnerVariant = "primary",
}) => (
    <div
        className={`loaderContainer ${containerClassName}`}
        style={containerStyle}
    >
        <Spinner
            className={`appLoader ${spinnerClassName}`}
            style={spinnerContainerStyle}
            variant={spinnerVariant}
            animation={spinnerAnimation}
        />
    </div>
);
