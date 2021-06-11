import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Event",
        path: "/event",
        icon: {
            name: "container",
        },
    },
    {
        label: "Attendees",
        path: "/attendee",
        icon: {
            name: "AddUserPlus",
        },
    },
];

export default navigation;
