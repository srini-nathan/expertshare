import React, { FC, Fragment } from "react";
import { RouteComponentProps } from "@reach/router";
import { AppPageHeader, AppCard } from "../../components";
import { useGlobalData } from "../../contexts";
import { useUserLocale } from "../../hooks";

export const InfoPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { container } = useGlobalData();
    const { locale } = useUserLocale();

    const getValues = () => {
        let title = "info Page";
        let content = "info Page";
        if (container && container.configuration)
            (container.configuration as any).translations.forEach((e: any) => {
                if (e.locale === locale && e.infoPageNavigationTitle)
                    title = e.infoPageNavigationTitle;
                if (e.locale === locale && e.infoPage) content = e.infoPage;
            });
        return {
            title,
            content,
        };
    };

    return (
        <Fragment>
            <AppPageHeader title={getValues().title} />
            <AppCard>
                <div
                    dangerouslySetInnerHTML={{ __html: getValues().content }}
                ></div>
            </AppCard>
        </Fragment>
    );
};
