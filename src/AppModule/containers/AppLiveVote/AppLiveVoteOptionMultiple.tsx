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
import { useBuildAssetPath, useUserLocale } from "../../hooks";
import { LiveVoteOptionTranslation } from "../../../AdminModule/models/entities/LiveVoteOptionTranslation";
import { getFirstValue } from "../../utils";
import { VoteOptionFileInfo } from "../../../config";

export const QUESTION_TYPE_RADIO = "RADIO";
export const QUESTION_TYPE_CHECKBOX = "CHECKBOX";

export type QuestionTypeType = "RADIO" | "CHECKBOX";

export interface AppLiveVoteOptionMultipleType {
    options: LiveVoteOption[];
    optionType?: QuestionTypeType;
    onDataChange: (result: string) => void;
    maxOption: number;
    minOption: number;
    isSubmitting: boolean;
}

export const AppLiveVoteOptionMultiple: FC<AppLiveVoteOptionMultipleType> = ({
    options,
    optionType = QUESTION_TYPE_RADIO,
    minOption,
    maxOption,
    onDataChange,
    isSubmitting,
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
    const onSubmit = (data: any) => {
        if (optionType === QUESTION_TYPE_RADIO) {
            onDataChange(data?.voteChoice);
        } else {
            onDataChange(data?.voteChoice?.join(","));
        }
    };
    const voteOptionMediaPath = useBuildAssetPath(VoteOptionFileInfo);

    const renderOptionItem = (
        { title, description = "" }: LiveVoteOptionTranslation,
        imageName = ""
    ) => {
        return (
            <div className="det">
                <h4 className="mb-0">{title}</h4>
                {description ? <p className="mb-0">{description}</p> : null}
                {imageName ? (
                    <img
                        src={`${voteOptionMediaPath}/${imageName}`}
                        alt={title}
                        className={"w-100"}
                    />
                ) : null}
            </div>
        );
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {options.map((option, index) => {
                const trans = option.translations as SLiveVoteOptionTranslation;
                // @FIXME: if newly added language's translation not exist for this option, then we need default translation which is any from defined
                const firstTrans = getFirstValue(option.translations);
                const translation: LiveVoteOptionTranslation =
                    trans[locale] ?? firstTrans;
                return (
                    <div
                        className={`mb-3 form-check ${
                            optionType === "RADIO" ? "circle-radio-button" : ""
                        }${
                            optionType === "CHECKBOX"
                                ? "checkbox-list-item"
                                : ""
                        }`}
                        key={option.id}
                    >
                        {optionType === QUESTION_TYPE_RADIO ? (
                            <div>
                                <input
                                    {...register("voteChoice", {
                                        required: true,
                                    })}
                                    type={optionType}
                                    value={option.val}
                                    id={`voteChoice[${index}]`}
                                    className={"form-check-input"}
                                />
                                <label
                                    htmlFor={`voteChoice[${index}]`}
                                    className={"form-check-label"}
                                >
                                    {renderOptionItem(
                                        translation,
                                        option.imageName
                                    )}
                                </label>
                            </div>
                        ) : null}
                        {optionType === QUESTION_TYPE_CHECKBOX ? (
                            <label className="checkbox-label-container">
                                <input
                                    {...register(`voteChoice[${index}]`, {
                                        required: true,
                                    })}
                                    type={optionType}
                                    value={option.val}
                                    id={`voteChoice[${index}]`}
                                    className={"form-check-input"}
                                />
                                <span className="custom-checkbox"></span>
                                {renderOptionItem(
                                    translation,
                                    option.imageName
                                )}
                            </label>
                        ) : null}
                    </div>
                );
            })}
            <Form.Control.Feedback className={"d-block mb-2"} type="invalid">
                {formState.errors?.voteChoice?.message}
            </Form.Control.Feedback>
            <AppButton
                block={true}
                type="submit"
                isLoading={isSubmitting}
                disabled={!formState.isValid || isSubmitting}
                loadingTxt={t("liveVote.form:button.submittingVote")}
                className={"submit-btn"}
            >
                <i className="fak fa-check-regular-bold mr-1"></i>
                {t("liveVote.form:button.submitVote")}
            </AppButton>
        </Form>
    );
};
