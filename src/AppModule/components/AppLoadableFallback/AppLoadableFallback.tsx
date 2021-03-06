import React, { CSSProperties, FC } from "react";
import { Spinner } from "react-bootstrap";
import { Variant } from "react-bootstrap/types";

export interface AppLoadableFallbackProps {
    containerClassName?: string;
    containerStyle?: CSSProperties;
    spinnerClassName?: string;
    spinnerContainerStyle?: CSSProperties;
    spinnerAnimation?: "border" | "grow";
    spinnerSize?: "sm";
    spinnerVariant?: Variant;
}

export const AppLoadableFallback: FC<AppLoadableFallbackProps> = ({
    containerClassName,
    containerStyle,
    spinnerClassName,
    spinnerContainerStyle,
    spinnerAnimation = "border",
    spinnerVariant = "primary",
}) => (
    <div className={containerClassName} style={containerStyle}>
        <Spinner
            className={spinnerClassName}
            style={spinnerContainerStyle}
            variant={spinnerVariant}
            animation={spinnerAnimation}
        />
    </div>
);
