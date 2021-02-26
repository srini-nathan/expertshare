import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AppButton, AppButtonProps } from "./AppButton";

export default {
    title: "Form/Button",
    component: AppButton,
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
    args: {
        children: "App Button",
    },
} as Meta;

const Template: Story<AppButtonProps> = (args) => <AppButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const PrimaryOutlined = Template.bind({});
PrimaryOutlined.args = {
    variant: "outline-primary",
};

export const PrimaryBlock = Template.bind({});
PrimaryBlock.args = {
    block: true,
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
    disabled: true,
};

export const PrimaryLarge = Template.bind({});
PrimaryLarge.args = {
    size: "lg",
};

export const PrimarySmall = Template.bind({});
PrimarySmall.args = {
    size: "sm",
};

export const Secondary = Template.bind({});
Secondary.args = {
    variant: "secondary",
};
