import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { AppButton } from "../../components";

interface AppLiveVoteOptionTextBoxType {
    onDataChange: (result: string) => void;
}

export const AppLiveVoteOptionTextBox: FC<AppLiveVoteOptionTextBoxType> = ({
    onDataChange,
}) => {
    const { t } = useTranslation();

    return (
        <div>
            <input
                onChange={(e) => onDataChange(e.currentTarget.value)}
                type={"text"}
            />
            <AppButton
                type="submit"
                block={true}
                loadingTxt={t("liveVote.form:button.submittingVote")}
            >
                <i className="fak fa-check-regular-bold mr-1"></i>
                {t("liveVote.form:button.submitVote")}
            </AppButton>
        </div>
    );
};
