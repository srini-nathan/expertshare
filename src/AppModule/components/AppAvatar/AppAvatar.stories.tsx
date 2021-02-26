import React from "react";
import { Meta, Story } from "@storybook/react/types-6-0";
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
    },
} as Meta;

const Template: Story<AppAvatarProps> = (args) => <AppAvatar {...args} />;

export const DefaultAvatar = Template.bind({});
DefaultAvatar.args = {};

export const LargeAvatar = Template.bind({});
LargeAvatar.args = {
    size: "lg",
};

export const SmallAvatar = Template.bind({});
SmallAvatar.args = {
    size: "sm",
};

export const CircularAvatar = Template.bind({});
CircularAvatar.args = {
    variant: AppAvatarVariant.CIRCLE,
};

export const ThumbnailAvatar = Template.bind({});
ThumbnailAvatar.args = {
    variant: AppAvatarVariant.THUMBNAIL,
};

export const FluidAvatar = Template.bind({});
FluidAvatar.args = {
    fluid: true,
};
