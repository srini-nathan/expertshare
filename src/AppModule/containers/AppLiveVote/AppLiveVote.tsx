import React, { FC, useState, useEffect, useRef } from "react";
import { Collapse } from "react-bootstrap";
import { Canceler } from "axios";
import { useTranslation } from "react-i18next";
import { AppCard, AppLoader } from "../../components";
import { LiveVoteQuestion } from "../../../AdminModule/models/entities/LiveVoteQuestion";
import { AppLiveVoteQuestion } from "./AppLiveVoteQuestion";
import { AppLiveVoteHeader } from "./AppLiveVoteHeader";
import "./assets/scss/style.scss";
import {
    AppLiveVoteOptionMultiple,
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RADIO,
} from "./AppLiveVoteOptionMultiple";
import { VOTE_QUESTION_TYPE } from "../../../config";
import { AppLiveVoteOptionTextBox } from "./AppLiveVoteOptionTextbox";
import {
    LiveVoteQuestionApi,
    LiveVoteResultApi,
} from "../../../AdminModule/apis";
import { LiveVoteResult, PLiveVoteResult } from "../../../AdminModule/models";

export interface AppLiveVoteProps {
    enable: boolean;
    data?: LiveVoteQuestion;
}

export const AppLiveVote: FC<AppLiveVoteProps> = ({ enable, data }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

    useEffect(() => {
        if (enable && data) {
            setLoading(true);
            LiveVoteResultApi.getMyResult<LiveVoteResult>(data.id, {}, (c) => {
                cancelTokenSourcesRef.current.push(c);
            })
                .then(({ response }) => {
                    if (response && response.items && response.items[0]) {
                        setAlreadyVoted(true);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [data, enable]);

    if (!enable || !data) {
        return <></>;
    }
    const submitVote = (result: string) => {
        setIsSubmitting(true);
        LiveVoteResultApi.create<LiveVoteResult, PLiveVoteResult>({
            result,
            voteQuestion: LiveVoteQuestionApi.toResourceUrl(data.id),
        })
            .then(() => {
                setAlreadyVoted(true);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const renderQuestion = () => {
        if (loading || data.isResultPublished || alreadyVoted) {
            return null;
        }

        if (data?.type === VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_TEXT) {
            return (
                <AppLiveVoteOptionTextBox
                    isSubmitting={isSubmitting}
                    onDataChange={(res) => {
                        submitVote(res);
                    }}
                />
            );
        }

        const type =
            data?.type === QUESTION_TYPE_CHECKBOX
                ? QUESTION_TYPE_CHECKBOX
                : QUESTION_TYPE_RADIO;

        return (
            <AppLiveVoteOptionMultiple
                isSubmitting={isSubmitting}
                optionType={type}
                options={data.voteOptions}
                maxOption={data.maxOptionSelect || 2}
                minOption={data.minOptionSelect || 1}
                onDataChange={(res) => {
                    submitVote(res);
                }}
            />
        );
    };

    const renderThankYou = () => {
        if (loading || data.isResultPublished || !alreadyVoted) {
            return null;
        }

        return (
            <p className="thanks-message mb-0 text-center">
                {t("liveVote:message.thankYouFotVoting")}
            </p>
        );
    };

    const renderResult = () => {
        if (loading || !data.isResultPublished) {
            return null;
        }

        return (
            <p className="thanks-message mb-0 text-center">
                Render Result here
            </p>
        );
    };

    const renderLoader = () => {
        if (!loading) {
            return null;
        }

        return <AppLoader />;
    };

    return (
        <AppCard className={"session-details-voting card p-3 mb-4"}>
            <div className="session-details-voting--container">
                <AppLiveVoteHeader
                    name={"Live Vote"}
                    isOpen={open}
                    onToggleCollapse={() => {
                        setOpen(!open);
                    }}
                />
                <AppLiveVoteQuestion
                    title={data?.title}
                    description={data?.description}
                />
                <Collapse in={open}>
                    <div className={`inner collapse mt-3 pt-3`}>
                        <div className="inner--container">
                            {renderLoader()}
                            {renderQuestion()}
                            {renderThankYou()}
                            {renderResult()}
                        </div>
                    </div>
                </Collapse>
            </div>
        </AppCard>
    );
};
