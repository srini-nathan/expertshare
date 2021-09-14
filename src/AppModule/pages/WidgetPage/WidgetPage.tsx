import React, { FC, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { ProductsWidget } from "./ProductsWidget";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    normalLayout,
    overViewLayout,
} from "../../atoms";

export const WidgetPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { type, id } = useParams();
    const { t } = useTranslation();
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );

    useEffect(() => {
        setLayoutOptions((currVal) => {
            return {
                ...currVal,
                ...overViewLayout,
            };
        });
        return () => {
            setLayoutOptions((currVal) => {
                return {
                    ...currVal,
                    ...normalLayout,
                };
            });
        };
    });

    if (type === "products") {
        return <ProductsWidget id={id} />;
    }

    return (
        <>
            <p>{t("widgetPage:notWidgetFound")}</p>
        </>
    );
};
