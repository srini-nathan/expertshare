import React, { FC } from "react";
import { AppButton } from "../../components";

export interface AppLiveVoteQuestionType {
    name: string;
    isOpen: boolean;
    onToggleCollapse: () => void;
}

export const AppLiveVoteHeader: FC<AppLiveVoteQuestionType> = ({
    name,
    isOpen,
    onToggleCollapse,
}) => {
    return (
        <div className="header">
            <div className="row m-0 p-0">
                <div className="header--title col-auto pl-0">
                    <h2>
                        <i className="fak fa-circle-question"></i>
                        {name}
                    </h2>
                </div>
                <div className="header--collapse-btn col-auto mr-0 ml-auto pr-1">
                    <AppButton
                        className={isOpen ? "" : "collapsed"}
                        onClick={onToggleCollapse}
                        variant={"secondary"}
                    >
                        <i className="fak fa-chevron-down"></i>
                    </AppButton>
                </div>
            </div>
        </div>
    );
};
