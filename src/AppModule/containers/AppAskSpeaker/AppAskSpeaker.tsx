import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Collapse } from "react-bootstrap";
import { AppCard } from "../../components";
import { AppAskSpeakerHeader } from "./AppAskSpeakerHeader";
import { AppAskSpeakerForm } from "./AppAskSpeakerForm";
import { SessionQuestionApi } from "../../apis";
import {
    PSessionQuestion,
    SessionQuestion,
} from "../../models/entities/SessionQuestion";
import { useAuthState, useAskSpeakerSocketEvents } from "../../hooks";
import "./assets/scss/style.scss";

export interface AppAskSpeakerProps {
    enable: boolean;
    sessionId: number;
}

export const AppAskSpeaker: FC<AppAskSpeakerProps> = ({
    sessionId,
    enable,
}) => {
    const { t } = useTranslation();
    const { containerId, userId } = useAuthState();
    const [open, setOpen] = useState<boolean>(true);
    const [alreadyAsked, setAlreadyAsked] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    let timerRef: any = null;

    const {
        emitPostNewAskSpeaker,
        emitJoinAskSpeaker,
        emitLeaveAskSpeaker,
    } = useAskSpeakerSocketEvents();

    useEffect(() => {
        if (containerId) emitJoinAskSpeaker(containerId);

        return () => {
            emitLeaveAskSpeaker(containerId);
        };
    }, [containerId]);

    const submitQuestion = (msg: string) => {
        const question = SessionQuestion.createFrom(
            sessionId,
            msg,
            userId,
            containerId
        );
        setIsSubmitting(true);
        SessionQuestionApi.create<SessionQuestion, PSessionQuestion>({
            message: question.message,
            session: question.session,
            user: question.user,
            container: question.container,
            isReplyed: false,
            parent: null,
        })
            .then(({ response }) => {
                setAlreadyAsked(true);
                timerRef = setTimeout(() => {
                    setAlreadyAsked(false);
                }, 3000);
                if (response) {
                    emitPostNewAskSpeaker(
                        containerId,
                        question.user,
                        response,
                        null
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const renderThankYou = () => {
        if (!alreadyAsked) {
            return null;
        }

        return (
            <div className="asking-announcement">
                <i className="fak fa-check-regular-bold" aria-hidden="true"></i>
                <p className="details mt-3 text-center">
                    {t("askSpeaker:message.questionSendConfirmation")}
                </p>
            </div>
        );
    };

    const renderQuestion = () => {
        if (alreadyAsked) {
            return null;
        }
        return (
            <AppAskSpeakerForm
                isSubmitting={isSubmitting}
                onDataChange={(res) => submitQuestion(res)}
            />
        );
    };

    useEffect(() => {
        return () => {
            if (timerRef) {
                clearTimeout(timerRef);
            }
        };
    }, []);

    if (!enable) {
        return <></>;
    }

    return (
        <AppCard
            className={`session-details-ask-speaker p-3 mb-4 ${
                open ? "" : "faded"
            }`}
        >
            <div className="session-details-ask-speaker--container">
                <AppAskSpeakerHeader
                    name={t("sessionDetails:section.askSpeaker")}
                    isOpen={open}
                    onToggleCollapse={() => {
                        setOpen(!open);
                    }}
                />
                <Collapse in={open} timeout={0}>
                    <div className={"inner mt-2"}>
                        <div className="inner--container">
                            {renderQuestion()}
                            {renderThankYou()}
                        </div>
                    </div>
                </Collapse>
            </div>
        </AppCard>
    );
};
