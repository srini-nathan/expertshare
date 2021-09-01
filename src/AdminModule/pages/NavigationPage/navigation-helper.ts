import { SimpleObject } from "../../../AppModule/models";
import { InfoPage, NavigationType } from "../../models";

export const getInternalLinksOptions = (t: any): SimpleObject<string>[] => {
    const options: SimpleObject<string>[] = [
        {
            value: "/event",
            label: t("Events"),
        },
        {
            value: "/attendee",
            label: t("Attendee"),
        },
        {
            value: "/exhibitors",
            label: t("Exhibitors"),
        },
    ];
    return options;
};

export const getTypeOptions = (t: any): SimpleObject<string>[] => {
    return [
        {
            value: NavigationType.INTERNAL,
            label: t("admin.navigation.form:label.internalPage"),
        },
        {
            value: NavigationType.INFO_PAGE,
            label: t("admin.navigation.form:label.type.infoPage"),
        },
        {
            value: NavigationType.EXTERNAL,
            label: t("admin.navigation.form:label.type.external"),
        },
    ];
};

export const getInfoPagesLinksOptions = (
    ips: InfoPage[]
): SimpleObject<string>[] => {
    const options: SimpleObject<string>[] = ips.map((ip) => {
        const { id, slugKey } = ip;
        return {
            value: `/page/${id}/${slugKey}`,
            label: ip.title || slugKey,
        };
    });
    return options;
};
