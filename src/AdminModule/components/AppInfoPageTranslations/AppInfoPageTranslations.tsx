import React, { FC } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import "./assets/scss/style.scss";
import { AppButton, AppFormLabel } from "../../../AppModule/components";
import { Language } from "../../models";

export interface SessionCategoryTranslationsType {
    locale: string;
    name: string;
}

export interface AppSessionCategoryTranslationsProps {
    languages?: Language[];
    onChange: (value: SessionCategoryTranslationsType[]) => void;
    translations: SessionCategoryTranslationsType[];
    defaultLanguage: string;
}

export const AppInfoPageTranslations: FC<AppSessionCategoryTranslationsProps> = ({
    languages = [],
    translations,
    onChange,
    defaultLanguage,
}) => {
    const { formState, register } = useFormContext();
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

        if (item.length > 0) if (name === "name") return item[0].name;

        return "";
    };

    return (
        <Row className="translatable-container">
            <Col md={12}>
                <AppFormLabel label="Choose your language" required />
            </Col>
            <Col md={12} className="d-flex mb-4">
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
            <Col className="mb-0" md={12}>
                <AppFormLabel
                    label={`${t(
                        "admin.sessionCategory.form:label.name"
                    )} (${active})`}
                    required
                />
                <Form.Control
                    value={getValue("name")}
                    {...register(`name_${active}`)}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "name");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {formState?.errors[`name_${active}`]?.message}
                </Form.Control.Feedback>
            </Col>
        </Row>
    );
};
