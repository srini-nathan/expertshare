import React, { FC, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./assets/scss/style.scss";
import { useTranslation } from "react-i18next";
import { Language } from "../../models";
import { AppButton, AppFormLabel } from "../../../AppModule/components";

export interface AppFormTitleTranslatableType {
    locale: string;
    title: string;
}

export interface AppFormTitleTranslatableProps {
    languages?: Language[];
    onChange: (value: AppFormTitleTranslatableType[]) => void;
    setActiveLanguage?: (value: string) => void;
    translations: AppFormTitleTranslatableType[];
    defaultLanguage: string;
}

export const AppFormTitleTranslatable: FC<AppFormTitleTranslatableProps> = ({
    languages = [],
    translations,
    onChange,
    setActiveLanguage,
    defaultLanguage,
}) => {
    const [active, setActive] = React.useState<string>(defaultLanguage);
    const { t } = useTranslation();
    const handleValueChange = (value: string, name: string) => {
        const newTranslation = translations.map((e) => {
            if (e.locale === active)
                return {
                    ...e,
                    [name]: value,
                };

            return e;
        });

        onChange(newTranslation);
    };

    const getValue = (): string => {
        const item = translations.filter((e) => e.locale === active);
        if (item.length > 0) {
            return item[0].title;
        }

        return "";
    };

    const getTitleError = (): boolean => {
        let noErrorTitle = false;
        translations.forEach((e) => {
            if (!noErrorTitle) noErrorTitle = e.title !== "";
        });
        return noErrorTitle;
    };

    useEffect(() => {
        if (setActiveLanguage) setActiveLanguage(active);
    }, [active]);

    return (
        <Row className="translatable-container">
            <Col md={12}>
                <AppFormLabel
                    label={t("common.label:chooseLanguage")}
                    required
                />
            </Col>
            <Col md={12} className="d-flex mb-4 chooselang-row">
                {languages.map((e: Language, i: number) => {
                    return (
                        <AppButton
                            className={`mr-2 ${
                                active === e.locale ? "active" : ""
                            } ${e.locale}`}
                            onClick={() => {
                                setActive(e.locale);
                            }}
                            variant="secondary"
                            key={i}
                        >
                            <i></i>
                            {e.name}
                        </AppButton>
                    );
                })}
            </Col>
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t("event.form:label.title")} (${active})`}
                    required
                />

                <Form.Control
                    value={getValue()}
                    name={`title_${active}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "title");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getTitleError() && "This field is required"}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    );
};
