import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Control } from "react-hook-form";
import { Form, Row } from "react-bootstrap";
import { get, find } from "lodash";
import { ExhibitorProductTranslation, Language } from "../../models";
import { AppFormLabel, AppFormTextArea } from "../../../AppModule/components";

export interface ExhibitorProductTranslatableProps {
    languages?: Language[];
    defaultLocale: string;
    activeLocale: string;
    onChange: (value: ExhibitorProductTranslation[]) => void;
    translations: ExhibitorProductTranslation[];
    control: Control<any>;
    ctaRequire?: boolean;
}

export const ExhibitorProductTranslatable: FC<ExhibitorProductTranslatableProps> = ({
    translations,
    onChange,
    activeLocale,
    control,
    ctaRequire = false,
}) => {
    const { t } = useTranslation();
    const handleValueChange = (value: string, name: string) => {
        const newTranslations = translations.map((e) => {
            if (e.locale === activeLocale)
                return {
                    ...e,
                    [name]: value,
                };

            return e;
        });
        onChange(newTranslations);
    };
    const getValue = (fieldName: string): string => {
        const item = find(translations, { locale: activeLocale });
        if (item) {
            return get(item, fieldName);
        }
        return "";
    };

    const getTitleError = (): boolean => {
        let noError = false;
        translations.forEach((e) => {
            if (!noError) noError = e.name !== "";
        });
        return noError;
    };

    const getCtaLabelError = (): boolean => {
        let noError = false;
        translations.forEach((e) => {
            if (!noError) noError = e.ctaLabel !== "";
        });
        return noError;
    };

    return (
        <Row className="translatable-container">
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t(
                        "admin.exhibitorProduct.form:label.name"
                    )} (${activeLocale})`}
                    required
                />
                <Form.Control
                    value={getValue("name")}
                    name={`name_${activeLocale}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "name");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getTitleError() &&
                        t("admin.exhibitorProduct.form:error.fieldIsRequired")}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormTextArea
                    md={12}
                    lg={12}
                    xl={12}
                    name={`description_${activeLocale}`}
                    label={`${t(
                        "admin.exhibitorProduct.form:label.description"
                    )} (${activeLocale})`}
                    value={getValue("description")}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "description");
                    }}
                    control={control}
                    className={"p-0"}
                />
            </Form.Group>
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t(
                        "admin.exhibitorProduct.form:label.ctaLabel"
                    )} (${activeLocale})`}
                    required={ctaRequire}
                />
                <Form.Control
                    value={getValue("ctaLabel")}
                    name={`ctaLabel_${activeLocale}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "ctaLabel");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {ctaRequire &&
                        !getCtaLabelError() &&
                        t("admin.exhibitorProduct.form:error.fieldIsRequired")}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    );
};
