import React, { FC, useState } from "react";
import { Collapse } from "react-bootstrap";
import { AppCard, AppLoader } from "../../components";
import { LiveVoteQuestion } from "../../../AdminModule/models/entities/LiveVoteQuestion";
import { AppLiveVoteQuestion } from "./AppLiveVoteQuestion";
import { AppLiveVoteHeader } from "./AppLiveVoteHeader";
import "./assets/scss/style.scss";
import { AppLiveVoteOptionMultiple } from "./AppLiveVoteOptionMultiple";
import { VOTE_QUESTION_TYPE } from "../../../config";
import { AppLiveVoteOptionTextBox } from "./AppLiveVoteOptionTextbox";

export interface AppLiveVoteProps {
    enable: boolean;
}

export const AppLiveVote: FC<AppLiveVoteProps> = ({ enable }) => {
    const [open, setOpen] = useState<boolean>(true);
    const [loading] = useState<boolean>(false);
    const [data] = useState<LiveVoteQuestion>();

    if (!enable) {
        return <></>;
    }

    const renderQuestion = () => {
        return (
            <>
                <AppLiveVoteQuestion
                    description={
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mi sit fringilla adipiscing arcu augue. Mattis aliquam sagittis scelerisque mattis friskilia?"
                    }
                    title={"What's the best solution for reducing the crime ?"}
                />
                <Collapse in={open}>
                    <div className={`inner collapse mt-3 pt-3`}>
                        <div className="inner--container">
                            {data?.type ===
                            VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_TEXT ? (
                                <AppLiveVoteOptionTextBox />
                            ) : (
                                <AppLiveVoteOptionMultiple
                                    optionType={"RADIO"}
                                    options={[]}
                                />
                            )}
                        </div>
                    </div>
                </Collapse>
            </>
        );
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
                {loading ? <AppLoader /> : renderQuestion()}
            </div>
        </AppCard>
    );
};
