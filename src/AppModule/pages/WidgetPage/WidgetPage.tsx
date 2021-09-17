import React, { FC, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { ProductsWidget } from "./ProductsWidget";
import { ExhibitorQAWidget } from "./ExhibitorQAWidget";
import { ExhibitorDetailsWidget } from "./ExhibitorDetailsWidget";
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

    switch (type) {
        case "products":
            return <ProductsWidget id={id} />;
        case "exhibitors-qa":
            return <ExhibitorQAWidget id={id} />;
        case "exhibitors-details":
            return <ExhibitorDetailsWidget id={id} />;
        default:
            return (
                <>
                    <p>{t("widgetPage:notWidgetFound")}</p>
                </>
            );
    }
};
