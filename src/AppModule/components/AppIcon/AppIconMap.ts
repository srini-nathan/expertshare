import dashboard from "./assets/images/icon_dashboard.svg";
import sponsors from "./assets/images/icon_sponsers.svg";
import attendees from "./assets/images/icon_attendees.svg";
import my_agenda from "./assets/images/icon_my_agenda.svg";

export const AppIconMap = {
    dashboard,
    sponsors,
    suitcase: sponsors,
    attendees,
    persons: attendees,
    my_agenda,
    calendar: my_agenda,
};

export const getIcon = (name: string): string => {
    return AppIconMap[name];
};

export default AppIconMap;
