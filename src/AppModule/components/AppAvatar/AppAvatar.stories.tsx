import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AppAvatar, AppAvatarProps, AppAvatarVariant } from "./AppAvatar";

export default {
    title: "UI/Avatar",
    component: AppAvatar,
    argTypes: {
        variant: {
            control: {
                type: "select",
                options: [
                    AppAvatarVariant.ROUNDED,
                    AppAvatarVariant.CIRCLE,
                    AppAvatarVariant.THUMBNAIL,
                ],
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
        fluid: {
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
} as Meta;

const Template: Story<AppAvatarProps> = (args) => <AppAvatar {...args} />;

export const Avatar = Template.bind({});
Avatar.args = {};
