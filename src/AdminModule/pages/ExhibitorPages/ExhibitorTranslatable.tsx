import React, { FC } from "react";
import { Form } from "react-bootstrap";
import { Control, FormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form/dist/types/form";
import {
    Exhibitor,
    Language,
    SExhibitorTranslation,
    ExhibitorTranslation,
} from "../../models";
import {
    AppFormInput,
    AppFormRichTextArea,
} from "../../../AppModule/components";
import { validation } from "../../../AppModule/utils";

interface ExhibitorTranslatableProps {
    languages?: Language[];
    activeLocale: string;
    isEditMode: boolean;
    setValue: UseFormSetValue<any>;
    formState: FormState<any>;
    control: Control<any>;
    register: UseFormRegister<any>;
    translations: SExhibitorTranslation;
}

export const ExhibitorTranslatable: FC<ExhibitorTranslatableProps> = ({
    languages,
    activeLocale,
    control,
    register,
    isEditMode,
    formState,
    setValue,
    translations,
}): JSX.Element => {
    const { t } = useTranslation();
    return (
        <>
            {languages?.map(({ locale }, index) => {
                const localeKey = `translations[${index}].locale` as keyof Exhibitor;
                const nameKey = `translations[${index}].name` as keyof Exhibitor;
                const descriptionKey = `translations[${index}].name` as keyof Exhibitor;
                const transData =
                    translations?.[locale] ??
                    ExhibitorTranslation.createFrom(locale);

                setValue(localeKey, locale);

                if (locale !== activeLocale) {
                    return (
                        <div key={locale}>
                            <input
                                {...register(nameKey)}
                                type="hidden"
                                defaultValue={transData?.name}
                            />
                            <textarea
                                {...register(descriptionKey)}
                                className={"d-none"}
                                defaultValue={transData?.description}
                            />
                        </div>
                    );
                }

                return (
                    <Form.Row key={locale}>
                        <AppFormInput
                            name={`translations[${index}].title`}
                            label={`${t(
                                "admin.exhibitor.form:label.name"
                            )} (${activeLocale})`}
                            {...validation(
                                `translations[${index}].name`,
                                formState,
                                isEditMode,
                                true
                            )}
                            control={control}
                            defaultValue={transData?.name}
                            lg={12}
                            md={12}
                            xl={12}
                        />
                        <AppFormRichTextArea
                            name={descriptionKey}
                            md={12}
                            lg={12}
                            xl={12}
                            className="p-0"
                            label={`${t(
                                "admin.exhibitor.form:label.description"
                            )} (${activeLocale})`}
                            control={control}
                            value={transData?.description}
                        />
                    </Form.Row>
                );
            })}
        </>
    );
};
