import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { AppFeedAdder } from "../../components";

export const NewsFeedPage: FC<RouteComponentProps> = (): JSX.Element => {
    return (
        <>
            <AppFeedAdder
                isSend
                handleDataSend={() => {}}
                className="app-feed-adder"
            />
        </>
    );
};
