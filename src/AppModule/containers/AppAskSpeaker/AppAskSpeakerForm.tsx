import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { AppMessageCompose } from "../../components";

interface AppAskSpeakerFormProps {
    onDataChange: (result: string) => void;
    isSubmitting: boolean;
}

export const AppAskSpeakerForm: FC<AppAskSpeakerFormProps> = ({
    onDataChange,
}) => {
    const { t } = useTranslation();
    const onSubmit = (data: any) => onDataChange(data);

    return (
        <div className={"typing-block"}>
            <AppMessageCompose
                id="compose-textarea"
                placeholder={t("askSpeaker:form.question.placeholder")}
                rows={4}
                isSend
                editMessage={""}
                isEdit={false}
                enterToPost={false}
                handleUpdateData={() => {}}
                handleDataSend={(data) => {
                    onSubmit(data);
                }}
            />
        </div>
    );
};
