import React, { FC, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppCard } from "../../../AppModule/components";
import { Exhibitor, User } from "../../models";
import { ExhibitorDetailPageContact } from "./ExhibitorDetailPageContact";
import { ExhibitorDetailPageMembers } from "./ExhibitorDetailPageMembers";
import { ExhibitorDetailPageVideo } from "./ExhibitorDetailPageVideo";

interface ExhibitorDetailTabDetailsType {
    data: Exhibitor;
    members: User[];
}

export const ExhibitorDetailTabDetails: FC<ExhibitorDetailTabDetailsType> = ({
    data,
    members,
}) => {
    const [haveMembers] = useState<boolean>(members.length > 0);
    const { t } = useTranslation();

    return (
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
            <ExhibitorDetailPageVideo
                type={data?.streamType}
                url={data?.streamUrl}
            />
            {data?.description && data?.description !== "" ? (
                <AppCard>
                    <Row className="m-0 mb-3 mb-lg-4">
                        <Col
                            sm={12}
                            className="session-details-desc my-1 pt-1 px-1"
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
    );
};
