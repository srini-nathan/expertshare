import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Dashboard",
        path: "/home",
        icon: {
            name: "dashboard",
        },
    },
    {
        label: "Event",
        path: "/conferences/grid",
        icon: {
            name: "container",
        },
    },

    {
        label: "Container",
        path: "/containers/overview",
        icon: {
            name: "container",
        },
    },
];

export default navigation;
