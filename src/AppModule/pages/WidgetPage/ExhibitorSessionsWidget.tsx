import React, { FC, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { AppLoader, AppSessionCard } from "../../components";
import { Exhibitor, Session } from "../../../AdminModule/models";
import { ExhibitorApi } from "../../../AdminModule/apis";
import "./assets/scss/style.scss";

export interface ExhibitorSessionsWidgetType {
    id: number;
}

export const ExhibitorSessionsWidget: FC<ExhibitorSessionsWidgetType> = ({
    id,
}): JSX.Element => {
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();

    const fetchData = () => {
        isLoading(true);
        ExhibitorApi.findById<Exhibitor>(id)
            .then(({ response }) => {
                if (response !== null) {
                    setData(response);
                }
            })
            .finally(() => {
                isLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={"exhibitor-sessions"}>
            <Row>
                {loading ? (
                    <AppLoader />
                ) : (
                    data?.sessions?.map((e) => (
                        <AppSessionCard key={e.id} data={e as Session} />
                    ))
                )}
            </Row>
        </div>
    );
};
