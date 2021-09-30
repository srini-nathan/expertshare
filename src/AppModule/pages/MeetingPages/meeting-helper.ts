import { SimpleObject } from "../../models/SimpleObject";
import { MEETING_PROVIDER } from "../../../config";

export const getProviderOptions = (t: any): SimpleObject<string>[] => {
    return [
        {
            value: MEETING_PROVIDER.PROVIDER_MEET,
            label: t("meeting.form:provider.option.meet"),
        },
        {
            value: MEETING_PROVIDER.PROVIDER_WEBEX,
            label: t("meeting.form:provider.option.webx"),
        },
        {
            value: MEETING_PROVIDER.PROVIDER_ZOOM,
            label: t("meeting.form:provider.option.zoom"),
        },
    ];
};
