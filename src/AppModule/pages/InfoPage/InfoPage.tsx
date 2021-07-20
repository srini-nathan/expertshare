import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { AppPageHeader, AppCard, AppLoader } from "../../components";
import { InfoPage as IP } from "../../../AdminModule/models";
import { InfoPageApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";

export const InfoPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [found, setFound] = useState<boolean>(true);
    const [data, setData] = useState<IP>();
    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);
        InfoPageApi.findById<IP>(id).then(({ isNotFound, response }) => {
            if (isNotFound) {
                setFound(false);
                errorToast(t("infopage:notexit"));
            }

            if (response) {
                if (response.isActive) {
                    setFound(true);
                    setData(response);
                } else {
                    setFound(false);
                    errorToast(t("infopage:notexit"));
                }
            }
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <AppLoader />;
    }

    if (found === false) {
        return <AppPageHeader title={t("infopage:notexit")} />;
    }

    return (
        <Fragment>
            <AppPageHeader title={data?.title || ""} showToolbar={false} />
            <AppCard>
                <div
                    dangerouslySetInnerHTML={{
                        __html: data?.description || "",
                    }}
                ></div>
            </AppCard>
        </Fragment>
    );
};
