import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { AppButton, AppButtonProps } from "./AppButton";

export default {
    title: "Form/Button - old",
    component: AppButton,
    argTypes: {
        color: {
            table: {
                category: "Style",
            },
        },
        outline: {
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
        label: "Button",
    },
} as Meta;

const Template: Story<AppButtonProps> = (args) => <AppButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Secondary = Template.bind({});
Secondary.args = {
    color: "secondary",
};

export const Large = Template.bind({});
Large.args = {
    size: "lg",
};

export const Small = Template.bind({});
Small.args = {
    size: "sm",
};
