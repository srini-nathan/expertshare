import React, { FC } from "react";
import { AppButton } from "../../components";

interface AppAskSpeakerHeaderProps {
    name: string;
    isOpen: boolean;
    onToggleCollapse: () => void;
    hideCollapse?: boolean;
}

export const AppAskSpeakerHeader: FC<AppAskSpeakerHeaderProps> = ({
    name,
    isOpen,
    onToggleCollapse,
    hideCollapse = false,
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
                {!hideCollapse ? (
                    <div className="header--collapse-btn col-auto mr-0 ml-auto pr-1">
                        <AppButton
                            className={isOpen ? "" : "collapsed"}
                            onClick={onToggleCollapse}
                            variant={"secondary"}
                        >
                            <i className="fak fa-chevron-down"></i>
                        </AppButton>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
