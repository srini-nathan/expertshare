import { AppNavigationItemProps } from "../AppModule/components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Admin - Design",
        path: "/admin/design",
        icon: {
            name: "administrator",
        },
    },
    {
        label: "Admin - Settings",
        path: "/admin/settings",
        icon: {
            name: "administrator",
        },
    },
    {
        label: "Admin - Email",
        path: "/admin/templates",
        icon: {
            name: "administrator",
        },
    },
    {
        label: "Admin - Languages",
        path: "/admin/languages",
        icon: {
            name: "administrator",
        },
    },
    {
        label: "Admin - TranslationPage",
        path: "/admin/translations",
        icon: {
            name: "administrator",
        },
        subNavigations: [
            {
                label: "General Settings",
                path: "/admin/settings",
                icon: {
                    name: "",
                },
            },
            {
                label: "TranslationPage",
                path: "/admin/translation",
                icon: {
                    name: "",
                },
            },
        ],
    },
    {
        label: "Admin - Clients",
        path: "/admin/clients",
        icon: {
            name: "administrator",
        },
    },

    {
        label: "Admin - User Groups",
        path: "/admin/user-groups",
        icon: {
            name: "Users",
        },
    },
];
