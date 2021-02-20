import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { Button, ButtonProps } from "./Button";

export default {
    title: "Form/Button",
    component: Button,
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

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

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
