import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form } from "react-bootstrap";
import {
    LiveVoteOption,
    SLiveVoteOptionTranslation,
} from "../../../AdminModule/models/entities/LiveVoteOption";
import { AppButton } from "../../components";
import { useUserLocale } from "../../hooks";
import { LiveVoteOptionTranslation } from "../../../AdminModule/models/entities/LiveVoteOptionTranslation";
import { getFirstValue } from "../../utils";

export const QUESTION_TYPE_RADIO = "RADIO";
export const QUESTION_TYPE_CHECKBOX = "CHECKBOX";

export type QuestionTypeType = "RADIO" | "CHECKBOX";

export interface AppLiveVoteOptionMultipleType {
    options: LiveVoteOption[];
    optionType?: QuestionTypeType;
    onDataChange: (result: string) => void;
    maxOption: number;
    minOption: number;
}

export const AppLiveVoteOptionMultiple: FC<AppLiveVoteOptionMultipleType> = ({
    options,
    optionType = QUESTION_TYPE_RADIO,
    minOption,
    maxOption,
    onDataChange,
}) => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState } = useForm({
        resolver: yupResolver(
            optionType === QUESTION_TYPE_RADIO
                ? yup.object().shape({
                      voteChoice: yup.string().required(),
                  })
                : yup.object().shape({
                      voteChoice: yup
                          .array()
                          .compact((v) => v === false)
                          .of(yup.string())
                          // eslint-disable-next-line no-template-curly-in-string
                          .min(minOption, "Choose minimum ${min} option")
                          // eslint-disable-next-line no-template-curly-in-string
                          .max(maxOption, "Choose maximum ${max} option")
                          .required(),
                  })
        ),
        mode: "all",
    });
    const { locale } = useUserLocale();
    const onSubmit = (data: any) => onDataChange(data);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {options.map((option, index) => {
                const trans = option.translations as SLiveVoteOptionTranslation;
                // @FIXME: if newly added language's translation not exist for this option, then we need default translation which is any from defined
                const firstTrans = getFirstValue(option.translations);
                const translation: LiveVoteOptionTranslation =
                    trans[locale] ?? firstTrans;
                return (
                    <div className="radio-item mb-3" key={option.id}>
                        {optionType === QUESTION_TYPE_CHECKBOX ? (
                            <input
                                {...register(`voteChoice[${index}]`, {
                                    required: true,
                                })}
                                type={optionType}
                                value={option.val}
                                id={`voteChoice[${index}]`}
                            />
                        ) : (
                            <input
                                {...register("voteChoice", {
                                    required: true,
                                })}
                                type={optionType}
                                value={option.val}
                                id={"voteChoice"}
                            />
                        )}
                        <label
                            htmlFor={
                                optionType === QUESTION_TYPE_CHECKBOX
                                    ? `voteChoice[${index}]`
                                    : "voteChoice"
                            }
                        >
                            <span>
                                {translation.title}
                                {translation.description ? (
                                    <p className="mb-0">
                                        {translation.description}
                                    </p>
                                ) : null}
                            </span>
                        </label>
                    </div>
                );
            })}
            <Form.Control.Feedback className={"d-block mb-2"} type="invalid">
                {formState.errors?.voteChoice?.message}
            </Form.Control.Feedback>
            <AppButton
                block={true}
                type="submit"
                isLoading={formState.isSubmitting}
                disabled={!formState.isValid || formState.isSubmitting}
                loadingTxt={t("liveVote.form:button.submittingVote")}
            >
                <i className="fak fa-check-regular-bold mr-1"></i>
                {t("liveVote.form:button.submitVote")}
            </AppButton>
        </Form>
    );
};
