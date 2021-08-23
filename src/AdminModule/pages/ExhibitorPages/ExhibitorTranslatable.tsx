import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Control } from "react-hook-form";
import { Form, Row } from "react-bootstrap";
import { get, find } from "lodash";
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

    const getContactLabelError = (): boolean => {
        let noError = false;
        translations.forEach((e) => {
            if (!noError) noError = e.contactUsCaption !== "";
        });
        return noError;
    };

    const getDescriptionError = (): boolean => {
        let noError = false;
        translations.forEach((e) => {
            if (!noError) noError = e.description !== "";
        });
        return noError;
    };

    return (
        <Row className="translatable-container">
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t(
                        "admin.exhibitor.form:label.name"
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
                        "admin.exhibitor.form:label.description"
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
            <Form.Group className="mb-0 px-3 w-100">
                <AppFormLabel
                    label={`${t(
                        "admin.exhibitor.form:label.contactUsCaption"
                    )} (${activeLocale})`}
                    required
                />
                <Form.Control
                    value={getValue("contactUsCaption")}
                    name={`contactUsCaption_${activeLocale}`}
                    onChange={(e: any) => {
                        handleValueChange(e.target.value, "contactUsCaption");
                    }}
                />
                <Form.Control.Feedback className={"d-block"} type="invalid">
                    {!getContactLabelError() && "This field is required"}
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    );
};
