import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "navigation:event",
        path: "/event",
        icon: {
            name: "fak fa-agenda-cs",
        },
    },
    {
        label: "navigation:attendee",
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
