import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Admin - Languages",
        path: "/admin/languages",
        icon: {
            name: "administrator",
        },
    },
    {
        label: "Admin - Translation",
        path: "/admin/translations",
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
    {
        label: "Admin - Clients",
        path: "/admin/client",
        icon: {
            name: "administrator",
        },
    },
];
