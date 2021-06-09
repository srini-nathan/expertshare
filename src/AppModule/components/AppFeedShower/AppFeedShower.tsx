import React, { FC, ReactNode } from "react";
import { AppButton } from "../AppButton";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";

export interface AppFeedShowerProps {
    item?: any;
    children?: ReactNode;
}

export const AppFeedShower: FC<AppFeedShowerProps> = ({
    item,
    children,
}): JSX.Element => {
    return (
        <div className="app-feed-shower-wrapper">
            <div className="row m-0 px-3 pt-3 pb-3">
                <div className="details col-auto p-0">
                    <div className="details--content">
                        <div className="avatar">
                            <i></i>
                        </div>
                        <div className="name pl-2">
                            <div className="name--sender">
                                <h3>{item.user}</h3>
                            </div>
                            <div className="name--comment">
                                <span>{item.scheduleEndAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="action col-auto p-0 mr-0 ml-auto">
                    <div className="row m-0 p-0">
                        <div
                            className="btn-collapse col-auto p-0"
                            id="btn-collapse-single"
                        >
                            <AppButton variant="secondary">
                                <AppIcon className="mr-2 ml-2" name="FaShare" />
                            </AppButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row app-feed-shower-wrapper--posted-text text pt-2 pb-3">
                {item.postText}
            </div>

            <div className="row app-feed-shower-wrapper--button-comments text pt-2 pb-3">
                <AppButton variant="secondary">
                    <span className="mr-2">1.5K</span>
                    <AppIcon name="CommentAlt" />
                </AppButton>
            </div>
            {children}
        </div>
    );
};
