import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Admin - Translation",
        path: "/admin/translation",
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
