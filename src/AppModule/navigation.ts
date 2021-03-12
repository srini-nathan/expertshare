import { AppNavigationItemProps } from "./components/AppNavigationItem";

export const navigation: AppNavigationItemProps[] = [
    {
        label: "Home",
        path: "/home",
        icon: {
            name: "dashboard",
        },
    },
    {
        label: "Sponsors",
        path: "/events",
        icon: {
            name: "sponsors",
        },
    },
    {
        label: "Attendees",
        path: "/events",
        icon: {
            name: "attendees",
        },
    },
    {
        label: "My Agenda",
        path: "/my-agendas",
        icon: {
            name: "myAgenda",
        },
    },
];

export default navigation;
