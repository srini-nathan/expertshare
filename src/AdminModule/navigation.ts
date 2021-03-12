import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Administrator",
        path: "/admin",
        icon: {
            name: "administrator",
        },
        subNavigations: [
            {
                label: "General Settings",
                path: "/admin/settings",
            },
            {
                label: "Translation",
                path: "/admin/translation",
            },
        ],
    },
];
