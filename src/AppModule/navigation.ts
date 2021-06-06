import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Event",
        path: "/conferences/grid",
        icon: {
            name: "container",
        },
    },
    {
        label: "Attendees",
        path: "/attendees",
        icon: {
            name: "AddUserPlus",
        },
    },
];

export default navigation;
