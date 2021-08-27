import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Exhibitor } from "../../models";

type ExhibitorDetailPageContactType = {
    data: Exhibitor;
};

export const ExhibitorDetailPageContact: FC<ExhibitorDetailPageContactType> = ({
    data,
}): JSX.Element => {
    const { t } = useTranslation();
    const {
        contactUsCaption,
        facebook,
        linkedin,
        twitter,
        email,
        phone,
        address,
        website,
    } = data;

    const renderSocialLink = (link = "", icon: string) => {
        if (link !== "") {
            return (
                <a className={"btn btn-secondary mr-2"} href={link}>
                    <i className={`fa fa-${icon}`}></i>
                </a>
            );
        }
        return <></>;
    };

    const renderLink = (text = "", icon: string) => {
        return (
            <div className={"d-flex"}>
                <i className={`fak fa-${icon} mr-1 mt-1`}></i> <p>{text}</p>
            </div>
        );
    };

    return (
        <>
            <h5>
                <i className="fak fa-moderators mr-2"></i>
                {t("exhibitor.detail:section.contacts")}
            </h5>
            <div className={"mt-4"}>
                <Row>
                    <Col sm={6} className={"pr-0"}>
                        {renderLink(email, "seat")}
                    </Col>
                    <Col sm={6} className={"pr-0"}>
                        {renderLink(website, "seat")}
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} className={"pr-0"}>
                        {renderLink(address, "icon-map")}
                    </Col>
                    <Col sm={6} className={"pr-0"}>
                        {renderLink(phone, "cellphone")}
                    </Col>
                </Row>
                <Row className={"mt-4"}>
                    <Col sm={6}>
                        <div className={"d-flex justify-content-between"}>
                            {renderSocialLink(facebook, "facebook-f")}
                            {renderSocialLink(linkedin, "linkedin")}
                            {renderSocialLink(twitter, "twitter")}
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className={"d-flex"}>
                            {contactUsCaption && (phone || email) ? (
                                <a
                                    href={
                                        phone
                                            ? `callto:${phone}`
                                            : `mailto:${email}`
                                    }
                                    className={"btn btn-secondary"}
                                >
                                    <i className="fak fa-message-incoming mr-1"></i>
                                    {contactUsCaption}
                                </a>
                            ) : null}
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};
