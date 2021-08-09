import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Form } from "react-bootstrap";
import { AppButton, AppFormInput } from "../../components";
import { validation } from "../../utils";

interface AppLiveVoteOptionTextBoxType {
    onDataChange: (result: string) => void;
    isSubmitting: boolean;
}

export const AppLiveVoteOptionTextBox: FC<AppLiveVoteOptionTextBoxType> = ({
    onDataChange,
    isSubmitting,
}) => {
    const { t } = useTranslation();
    const { handleSubmit, formState, control } = useForm({
        resolver: yupResolver(
            yup.object().shape({
                feedback: yup.string().required(),
            })
        ),
        mode: "all",
    });
    const onSubmit = (data: any) => onDataChange(data?.feedback);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <AppFormInput
                className="p-1 mb-2"
                name={"feedback"}
                placeholder={t("liveVote.form:placeholder.feedback")}
                control={control}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                {...validation("feedback", formState, false, true)}
            />
            <AppButton
                block={true}
                isLoading={isSubmitting}
                type="submit"
                disabled={!formState.isValid || isSubmitting}
                loadingTxt={t("liveVote.form:button.submittingVote")}
            >
                <i className="fak fa-check-regular-bold mr-1"></i>
                {t("liveVote.form:button.submitVote")}
            </AppButton>
        </Form>
    );
};
