import React, { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useGlobalData } from "../../contexts";
import { Language } from "../../../AdminModule/models";
import { AppFormLabel } from "../../components";

import "./assets/scss/style.scss";

export interface AppLanguageSwitcherType {
    activeLocale: string;
    activeOnly?: boolean;
    onChange?: (locale: string) => void;
}

export const AppLanguageSwitcher: FC<AppLanguageSwitcherType> = ({
    activeLocale,
    activeOnly = false,
    onChange = () => {},
}): JSX.Element => {
    const { languages: allLanguages, activeLanguages } = useGlobalData();
    const { t } = useTranslation();
    const [languages] = useState<Language[]>(
        activeOnly ? activeLanguages || [] : allLanguages || []
    );

    return (
        <Row className={"app-language-switcher"}>
            <Col xs={12}>
                <AppFormLabel
                    label={t("common.label:chooseLanguage")}
                    required
                />
            </Col>
            <Col xs={12} className="d-flex mb-4 mt-2 flex-wrap">
                {languages.map(({ locale, name }: Language) => {
                    return (
                        <div
                            key={locale}
                            className={`lang-item mr-2 mb-2 ${
                                activeLocale === locale && "active"
                            }`}
                            onClick={() => {
                                onChange(locale);
                            }}
                        >
                            <i className={`flag flag-${locale}`}></i>
                            {name}
                        </div>
                    );
                })}
            </Col>
        </Row>
    );
};
