import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Control } from "react-hook-form";
import { Form, Row } from "react-bootstrap";
import { ExhibitorTranslation, Language } from "../../models";
import {
    AppFormLabel,
    AppFormRichTextArea,
} from "../../../AppModule/components";

export interface ExhibitorTranslatableProps {
    languages?: Language[];
    defaultLocale: string;
    activeLocale: string;
    onChange: (value: ExhibitorTranslation[]) => void;
    translations: ExhibitorTranslation[];
    control: Control<any>;
}

export const ExhibitorTranslatable: FC<ExhibitorTranslatableProps> = ({
    translations,
    onChange,
    activeLocale,
    control,
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
    const getValue = (name: string): string => {
        const item = translations.filter((e) => e.locale === activeLocale);

        if (item.length > 0)
            if (name === "description") return item[0].description;
            else return item[0].name;

        return "";
    };

    const getTitleError = (): boolean => {
        let noErrorTitle = false;
        translations.forEach((e) => {
            if (!noErrorTitle) noErrorTitle = e.name !== "";
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

    return (
        <Row className="translatable-container">
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t("event.form:label.title")} (${activeLocale})`}
                    required
                />

                <Form.Control
                    value={getValue("title")}
                    name={`title_${activeLocale}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "title");
                    }}
                />

                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getTitleError() && "This field is required"}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormRichTextArea
                    name={`description_${activeLocale}`}
                    md={12}
                    lg={12}
                    xl={12}
                    className="p-0"
                    label={`${t(
                        "event.form:label.description"
                    )} (${activeLocale})`}
                    control={control}
                    value={getValue("description")}
                    onChange={(e: string) => {
                        handleValueChange(e, "description");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getDescriptionError() && "This field is required"}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    );
};
