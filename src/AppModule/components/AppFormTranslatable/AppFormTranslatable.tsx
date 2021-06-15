import React, { FC, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./assets/scss/style.scss";
import { useTranslation } from "react-i18next";
import { Language } from "../../../AdminModule/models";
import { AppButton } from "../AppButton";
import { AppFormLabel } from "../AppFormLabel";

export interface TranslationsType {
    locale: string;
    title: string;
    description: string;
    streamUrl?: string;
}

export interface AppFormTranslatableProps {
    languages: Language[];
    onChange: (value: TranslationsType[]) => void;
    setActiveLanguage?: (value: string) => void;
    translations: TranslationsType[];
    defaultLanguage: string;
}

export const AppFormTranslatable: FC<AppFormTranslatableProps> = ({
    languages,
    translations,
    onChange,
    setActiveLanguage,
    defaultLanguage,
}) => {
    const [active, setActive] = React.useState<string>(defaultLanguage);
    const { t } = useTranslation();

    const handleValueChange = (value: string, name: string) => {
        const newTranslatiosn = translations.map((e) => {
            if (e.locale === active)
                return {
                    ...e,
                    [name]: value,
                };

            return e;
        });

        onChange(newTranslatiosn);
    };

    const getValue = (name: string): string => {
        const item = translations.filter((e) => e.locale === active);

        if (item.length > 0)
            if (name === "description") return item[0].description;
            else return item[0].title;

        return "";
    };

    const getTitleError = (): boolean => {
        let noErrorTitle = false;
        translations.forEach((e) => {
            if (!noErrorTitle) noErrorTitle = e.title !== "";
        });
        return noErrorTitle;
    };

    const getDescriptionError = (): boolean => {
        let noErrorTitle = false;
        translations.forEach((e) => {
            if (!noErrorTitle) noErrorTitle = e.description !== "";
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
            <Col md={12} className="d-flex mb-4">
                {languages
                    // .sort((a: Language, b: Language) =>
                    //     b.isDefault > a.isDefault ? 1 : -1
                    // )
                    .map((e: Language, i: number) => {
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
                    value={getValue("title")}
                    name={`title_${active}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "title");
                    }}
                />

                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getTitleError() && "This feild is required"}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t("event.form:label.description")} (${active})`}
                    required
                />

                <Form.Control
                    as={"textarea"}
                    value={getValue("description")}
                    name={`description_${active}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "description");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getDescriptionError() && "This feild is required"}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    );
};
