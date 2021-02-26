import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
import {
    AppSocialLoginBtn,
    AppSocialLoginBtnProps,
    AppSocialLoginBtnType,
} from "./AppSocialLoginBtn";

export default {
    title: "Form/Button",
    component: AppSocialLoginBtn,
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
        type: {
            control: {
                type: "select",
                options: [
                    AppSocialLoginBtnType.GOOGLE,
                    AppSocialLoginBtnType.CUSTOM,
                ],
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
        children: "Login with Google",
    },
} as Meta;

const Template: Story<AppSocialLoginBtnProps> = (args) => (
    <AppSocialLoginBtn {...args} />
);

export const GoogleLogin = Template.bind({});
GoogleLogin.args = {
    type: AppSocialLoginBtnType.GOOGLE,
};
