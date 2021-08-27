import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { AppButton } from "../../../AppModule/components";
import { Exhibitor } from "../../models";

type ExhibitorDetailPageContactType = {
    data: Exhibitor;
};

export const ExhibitorDetailPageContact: FC<ExhibitorDetailPageContactType> = ({
    data,
}): JSX.Element => {
    const { t } = useTranslation();
    return (
        <>
            <h5>
                <i className="fak fa-moderators mr-2"></i>
                {t("exhibitor.detail:section.contacts")}
            </h5>
            <div className="d-flex">
                <Row>
                    <Col>
                        {data.contactUsCaption ? (
                            <AppButton type="button" variant={"secondary"}>
                                <i className="fa fa-phone-alt mr-1"></i>
                                {data.contactUsCaption}
                            </AppButton>
                        ) : null}
                    </Col>
                </Row>
            </div>
        </>
    );
};
