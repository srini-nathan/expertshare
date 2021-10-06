import { SimpleObject } from "../../../AppModule/models";
import { InfoPage, NavigationType } from "../../models";

export const getInternalLinksOptions = (t: any): SimpleObject<string>[] => {
    const options: SimpleObject<string>[] = [
        {
            value: "/event",
            label: t("navigation.main:events"),
        },
        {
            value: "/attendee",
            label: t("navigation.main:attendee"),
        },
        {
            value: "/exhibitors",
            label: t("navigation.main:exhibitors"),
        },
        {
            value: "/meetings",
            label: t("navigation.main:meetings"),
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
