import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Admin Home",
        path: "/admin",
        icon: {
            name: "users",
        },
    },
    {
        label: "Design",
        path: "/admin/design",
        icon: {
            name: "gears",
        },
    },
    {
        label: "Settings",
        path: "/admin/settings",
        icon: {
            name: "gears",
        },
    },
    {
        label: "Translation",
        path: "/admin/translation",
        icon: {
            name: "gears",
        },
    },
];
