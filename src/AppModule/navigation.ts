import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Event",
        path: "/event",
        icon: {
            name: "far fa-box",
        },
    },
    {
        label: "Attendees",
        path: "/attendee",
        icon: {
            name: "far fa-user-plus",
        },
    },
    // {
    //     label: "Social Feed",
    //     path: "/newsfeed",
    //     icon: {
    //         name: "fak fa-message-dot",
    //     },
    // },
];

export default navigation;
