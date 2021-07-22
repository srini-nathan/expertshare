import React, { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useGlobalData } from "../../contexts";
import { Language } from "../../../AdminModule/models";
import { AppButton, AppFormLabel } from "../../components";

import "./assets/scss/style.scss";

export interface AppLanguageSwitcherType {
    activeOnly?: boolean;
    onChange?: (locale: string) => void;
}

export const AppLanguageSwitcher: FC<AppLanguageSwitcherType> = ({
    activeOnly = false,
    onChange = () => {},
}): JSX.Element => {
    const {
        languages: allLanguages,
        activeLanguages,
        defaultLanguage,
    } = useGlobalData();
    const { t } = useTranslation();
    const [languages] = useState<Language[]>(
        activeOnly ? activeLanguages || [] : allLanguages || []
    );
    const [active, setActive] = useState<string>(
        defaultLanguage?.locale || "en"
    );

    return (
        <Row className={"app-language-switcher"}>
            <Col xs={12}>
                <AppFormLabel
                    label={t("common.label:chooseLanguage")}
                    required
                />
            </Col>
            <Col xs={12} className="d-flex mb-4 mt-2">
                {languages.map(({ locale, name }: Language) => {
                    return (
                        <AppButton
                            key={locale}
                            className={`mr-2 ${active === locale && "active"}`}
                            variant="secondary"
                            onClick={() => {
                                onChange(locale);
                                setActive(locale);
                            }}
                        >
                            <i className={`flag flag-${locale}`}></i>
                            {name}
                        </AppButton>
                    );
                })}
            </Col>
        </Row>
    );
};
