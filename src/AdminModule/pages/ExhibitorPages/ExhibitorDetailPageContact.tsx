import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Exhibitor } from "../../models";

type ExhibitorDetailPageContactType = {
    data?: Exhibitor;
};

export const ExhibitorDetailPageContact: FC<ExhibitorDetailPageContactType> = ({
    data,
}): JSX.Element => {
    const { t } = useTranslation();

    if (!data) {
        return <></>;
    }
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
        if (text !== "") {
            return (
                <Col xs={"auto"} className={"pr-0 custom-contact-item"}>
                    <div
                        className={
                            "d-flex custom-contact-item--content mr-2 mr-lg-3"
                        }
                    >
                        <i className={`fak fa-${icon} mr-2`}></i>
                        <p className={"mb-0"}>{text}</p>
                    </div>
                </Col>
            );
        }

        return <></>;
    };

    return (
        <>
            <h3 className="mb-0">
                <i className="fak fa-moderators mr-2"></i>
                {t("exhibitor.detail:section.contacts")}
            </h3>
            <div className={"mt-4"}>
                <Row>
                    {renderLink(email, "envelope-light")}
                    {renderLink(website, "globe-light")}
                    {renderLink(address, "icon-map")}
                    {renderLink(phone, "cellphone")}
                </Row>
                <Row>
                    <Col sm={"auto"} className="mt-2 mr-2">
                        <div
                            className={
                                "d-flex justify-content-between social-icons"
                            }
                        >
                            {renderSocialLink(facebook, "facebook-f")}
                            {renderSocialLink(linkedin, "linkedin")}
                            {renderSocialLink(twitter, "twitter")}
                        </div>
                    </Col>
                    <Col sm={"auto"} className="mt-2 pr-0">
                        <div className={"d-flex"}>
                            {contactUsCaption && (phone || email) ? (
                                <a
                                    href={
                                        phone
                                            ? `callto:${phone}`
                                            : `mailto:${email}`
                                    }
                                    className={"btn btn-secondary contact-btn"}
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
