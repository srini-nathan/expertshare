import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AppIcon, AppIconProps } from "./AppIcon";
import iconImage from "../../assets/images/icon-brand-google.png";

export default {
    title: "Icon",
    component: AppIcon,
    argTypes: {
        variant: {
            control: {
                type: "select",
                options: [
                    "primary",
                    "secondary",
                    "success",
                    "danger",
                    "warning",
                    "info",
                    "dark",
                    "light",
                    "link",
                    "outline-primary",
                    "outline-secondary",
                    "outline-success",
                    "outline-danger",
                    "outline-warning",
                    "outline-info",
                    "outline-dark",
                    "outline-light",
                ],
            },
            table: {
                category: "Style",
            },
        },
        className: {
            table: {
                category: "Style",
            },
        },
        imageIcon: {
            table: {
                category: "Style",
            },
        },
        size: {
            table: {
                category: "Size",
            },
        },
        block: {
            table: {
                category: "Size",
            },
        },
        disabled: {
            table: {
                category: "States",
            },
        },
        onClick: {
            table: {
                category: "Events",
            },
        },
    },
    args: {},
} as Meta;

const Template: Story<AppIconProps> = (args) => <AppIcon {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    src: iconImage,
};
