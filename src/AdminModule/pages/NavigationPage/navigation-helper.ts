import { SimpleObject } from "../../../AppModule/models";
import { NavigationType } from "../../models";

export const getInternalLinksOptions = (t: any): SimpleObject<string>[] => {
    const options: SimpleObject<string>[] = [
        {
            value: "/events",
            label: t("Events"),
        },
        {
            value: "/attendee",
            label: t("Attendee"),
        },
    ];
    return options;
};

export const getTypeOptions = (t: any): SimpleObject<string>[] => {
    return [
        {
            value: NavigationType.INTERNAL,
            label: t("admin.navigation.form:label.type.internal"),
        },
        {
            value: NavigationType.INFO_PAGE,
            label: t("admin.navigation.form:label.type.infopage"),
        },
        {
            value: NavigationType.EXTERNAL,
            label: t("admin.navigation.form:label.type.external"),
        },
    ];
};
