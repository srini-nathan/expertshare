import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Event",
        path: "/event",
        icon: {
            name: "fak fa-agenda-cs",
        },
    },
    {
        label: "Attendees",
        path: "/attendee",
        icon: {
            name: "fak fa-atendees-cs",
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
