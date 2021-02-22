import React from "react";
import {
    Button as BaseButton,
    ButtonProps as BaseButtonProps,
} from "@bootstrap-styled/v4";
import BootstrapProvider from "@bootstrap-styled/provider";
import defaultTheme from "../../theme/expertshare";

export interface ButtonProps extends BaseButtonProps {
    /**
     * Choose to change size of the button
     */
    size?: "sm" | "lg";
    /**
     * Predefined type of buttons
     */
    color?:
        | "link"
        | "primary"
        | "secondary"
        | "success"
        | "info"
        | "warning"
        | "danger";
    /**
     * Checks if the button should be outlined
     */
    outline?: boolean;
    /**
     * Checks if the button width should be 100%
     */
    block?: boolean;
    /**
     * Checks if the button should be disabled
     */
    disabled?: boolean;
    /**
     * Add your manual class to apply this button
     */
    className?: string;
    /**
     * You can pass any function to call when the button clicked
     */
    onClick?: () => void;
    /**
     * Pass text need to render within the button
     */
    label?: string;
}

/**
 * Primary Button component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
    color = "primary",
    label,
    children,
    ...props
}) => {
    return (
        <BootstrapProvider theme={defaultTheme}>
            <BaseButton color={color} {...props}>
                {label || children}
            </BaseButton>
        </BootstrapProvider>
    );
};
