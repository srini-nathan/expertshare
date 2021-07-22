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
    const [data, setData] = useState<IP>();
    const { t } = useTranslation();

    useEffect(() => {
        InfoPageApi.findById<IP>(id).then(({ isNotFound, response }) => {
            if (response) {
                setData(response);
            }
            if (isNotFound) {
                errorToast(t("infopage:notexit"));
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <AppLoader />;
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
