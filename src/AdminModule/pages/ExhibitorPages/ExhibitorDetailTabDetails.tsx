import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
    AppCard,
    AppSessionUsers,
    AppButton,
} from "../../../AppModule/components";
import { Exhibitor, User } from "../../models";

interface ExhibitorDetailTabDetailsType {
    data: Exhibitor;
}

export const ExhibitorDetailTabDetails: FC<ExhibitorDetailTabDetailsType> = ({
    data,
}) => {
    const { t } = useTranslation();

    return (
        <>
            {data?.members && data?.members.length > 0 ? (
                <AppCard>
                    <Row className="m-0 mb-3 mb-lg-4">
                        <Col
                            lg={8}
                            md={12}
                            className={`create-session--speakers`}
                        >
                            <AppSessionUsers
                                xl={6}
                                lg={6}
                                md={12}
                                sm={12}
                                selectedUsers={data.members as User[]}
                                title={t("exhibitor.detail:label.members")}
                                icon="speakers"
                            />
                        </Col>
                        <Col lg={4}>
                            <h2>
                                <i className="fak fa-speakers"></i>
                                {t("exhibitor.detail:section.contact")}
                            </h2>
                            <div className="d-flex">
                                <Row>
                                    <Col>
                                        {data.contactUsCaption ? (
                                            <AppButton
                                                type="button"
                                                variant={"secondary"}
                                            >
                                                <i className="fa fa-phone-alt mr-1"></i>
                                                {data.contactUsCaption}
                                            </AppButton>
                                        ) : null}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </AppCard>
            ) : null}
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
    );
};
