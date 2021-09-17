import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { AppCard, AppLoader } from "../../components";
import { Exhibitor, User } from "../../../AdminModule/models";
import { ExhibitorDetailPageMembers } from "../../../AdminModule/pages/ExhibitorPages/ExhibitorDetailPageMembers";
import { ExhibitorDetailPageContact } from "../../../AdminModule/pages/ExhibitorPages/ExhibitorDetailPageContact";
import "./assets/scss/style.scss";
import { ExhibitorApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";

export interface ExhibitorDetailsWidgetType {
    id: number;
}

export const ExhibitorDetailsWidget: FC<ExhibitorDetailsWidgetType> = ({
    id,
}): JSX.Element => {
    const { t } = useTranslation();
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();
    const [members, setMembers] = useState<User[]>([]);
    const [haveMembers, setHaveMembers] = useState<boolean>(true);

    useEffect(() => {
        isLoading(true);
        ExhibitorApi.findById<Exhibitor>(id).then(
            ({ response, isNotFound }) => {
                if (isNotFound) {
                    errorToast(t("exhibitor.detail:error.message.notExist"));
                } else if (response !== null) {
                    setData(response);
                    const users = response?.members ?? [];
                    setMembers(users as User[]);
                    setHaveMembers(users.length > 0);
                }
                isLoading(false);
            }
        );
    }, [id]);

    if (loading) {
        return <AppLoader />;
    }

    return (
        <div className={"exhibitor-details-widget"}>
            <>
                <AppCard>
                    <Row className="my-2">
                        {haveMembers ? (
                            <Col
                                lg={7}
                                xl={7}
                                md={12}
                                className={`exhibitor-detail--members mb-4 mb-lg-0`}
                            >
                                <ExhibitorDetailPageMembers members={members} />
                            </Col>
                        ) : (
                            <></>
                        )}
                        <Col
                            lg={haveMembers ? 5 : 12}
                            xl={haveMembers ? 5 : 12}
                            className="exhibitor-detail--contact"
                        >
                            <ExhibitorDetailPageContact data={data} />
                        </Col>
                    </Row>
                </AppCard>
                {data?.description && data?.description !== "" ? (
                    <AppCard>
                        <Row className="m-0 mb-3 mb-lg-4">
                            <Col
                                sm={12}
                                className="session-details-desc my-4 pt-1 px-2"
                            >
                                <h2>
                                    <i className="fak fa-description"></i>
                                    {t("exhibitor.detail:section.description")}
                                </h2>
                                <div className="session-details-desc--container mt-3">
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: data.description,
                                        }}
                                    ></p>
                                </div>
                            </Col>
                        </Row>
                    </AppCard>
                ) : null}
            </>
        </div>
    );
};
