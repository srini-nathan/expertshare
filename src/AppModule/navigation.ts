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
        label: "Container",
        path: "/admin/containers/overview",
        icon: {
            name: "container",
        },
    },
];

export default navigation;
