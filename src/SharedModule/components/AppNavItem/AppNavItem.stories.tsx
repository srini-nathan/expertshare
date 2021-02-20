import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AppNavItemProps, AppNavItem } from "./AppNavItem";

export default {
    title: "Example/AppNavItem",
    component: AppNavItem,
    argTypes: {},
} as Meta;

const Template: Story<AppNavItemProps> = (args) => <AppNavItem {...args} />;

export const Default = Template.bind({});
