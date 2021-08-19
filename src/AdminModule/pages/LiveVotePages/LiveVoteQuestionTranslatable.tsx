import React, { FC } from "react";
import { Form } from "react-bootstrap";
import { Control, FormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form/dist/types/form";
import {
    Language,
    LiveVoteQuestion,
    SLiveVoteQuestionTranslation,
} from "../../models";
import { LiveVoteQuestionTranslation } from "../../models/entities/LiveVoteQuestionTranslation";
import { AppFormInput } from "../../../AppModule/components";
import { validation } from "../../../AppModule/utils";

interface LiveVoteQuestionTranslatableProps {
    languages?: Language[];
    activeLocale: string;
    isEditMode: boolean;
    setValue: UseFormSetValue<any>;
    formState: FormState<any>;
    control: Control<any>;
    register: UseFormRegister<any>;
    translations: SLiveVoteQuestionTranslation;
}

export const LiveVoteQuestionTranslatable: FC<LiveVoteQuestionTranslatableProps> = ({
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
                const transData =
                    translations?.[locale] ??
                    LiveVoteQuestionTranslation.createFrom(locale);

                setValue(
                    `translations[${index}].locale` as keyof LiveVoteQuestion,
                    locale
                );

                if (locale !== activeLocale) {
                    const titleKey = `translations[${index}].title` as keyof LiveVoteQuestion;
                    return (
                        <input
                            type="hidden"
                            {...register(titleKey)}
                            defaultValue={transData?.title}
                            key={locale}
                        />
                    );
                }

                return (
                    <Form.Row key={locale}>
                        <AppFormInput
                            name={`translations[${index}].title`}
                            label={`${t(
                                "admin.liveVote.form:label.title"
                            )}(${activeLocale})`}
                            {...validation(
                                `translations[${index}].title`,
                                formState,
                                isEditMode,
                                true
                            )}
                            control={control}
                            defaultValue={transData?.title}
                            lg={6}
                            md={6}
                            xl={6}
                        />
                    </Form.Row>
                );
            })}
        </>
    );
};
