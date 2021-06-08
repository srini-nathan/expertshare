import React, { FC } from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./assets/scss/style.scss";
import { useFormContext } from "react-hook-form";
import { Language } from "../../../AdminModule/models";
import { AppButton } from "../AppButton";
import { AppFormLabel } from "../AppFormLabel";
// import { validation } from "../../utils";

export interface SessionCategoryTranslationsType {
    locale: string;
    name: string;
}

export interface AppSessionCategoryTranslationsProps {
    languages: Language[];
    onChange: (value: SessionCategoryTranslationsType[]) => void;
    translations: SessionCategoryTranslationsType[];
    defaultLanguage: string;
}

export const AppSessionCategoryTranslations: FC<AppSessionCategoryTranslationsProps> = ({
    languages,
    translations,
    onChange,
    defaultLanguage,
}) => {
    const { formState, register } = useFormContext();
    const [active, setActive] = React.useState<string>(defaultLanguage);
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
                {languages
                    .sort((a: Language, b: Language) =>
                        b.isDefault > a.isDefault ? 1 : -1
                    )
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
            <Form.Group as={Col} md={12}>
                <AppFormLabel label={`Name (${active})`} required />

                <Form.Control
                    value={getValue("name")}
                    {...register(`name_${active}`)}
                    // required
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "name");
                    }}
                />

                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {formState?.errors[`name_${active}`]?.message || ""}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    );
};
