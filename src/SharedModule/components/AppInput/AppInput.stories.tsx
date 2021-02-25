import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Form } from "@bootstrap-styled/v4";
import { AppInput, AppInputProps } from "./AppInput";

export default {
    title: "Form/Input",
    component: AppInput,
    argTypes: {
        type: {},
        placeholder: {},
        size: {
            table: {
                category: "Size",
            },
        },
        state: {
            table: {
                category: "States",
            },
        },
        className: {
            table: {
                category: "Style",
            },
        },
        disabled: {
            table: {
                category: "States",
            },
        },
        readOnly: {
            table: {
                category: "States",
            },
        },
    },
    args: {},
    decorators: [(StoryTag) => <Form inline>{StoryTag()}</Form>],
} as Meta;

const Template: Story<AppInputProps> = (args) => <AppInput {...args} />;

export const TextInput = Template.bind({});
TextInput.args = {};

export const TextInputLarge = Template.bind({});
TextInputLarge.args = {
    size: "lg",
};

export const TextInputSmall = Template.bind({});
TextInputSmall.args = {
    size: "sm",
};

export const NumberInput = Template.bind({});
NumberInput.args = {
    type: "number",
};

export const DateInput = Template.bind({});
DateInput.args = {
    type: "date",
};

export const TimeInput = Template.bind({});
TimeInput.args = {
    type: "time",
};

export const ColorInput = Template.bind({});
ColorInput.args = {
    type: "color",
};
