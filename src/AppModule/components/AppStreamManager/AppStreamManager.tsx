import React, { FC } from "react";
import { AppVimeoFrame } from "../AppVimeoFrame";
import { AppYoutubeFrame } from "../AppYoutubeFrame";
import { AppDacastFrame } from "../AppDacastFrame";
import { AppKnovioPlayer } from "../AppKnovioPlayer";
import "./assets/scss/style.scss";
import { Session } from "../../../AdminModule/models";

interface AppStreamManagerProps {
    session: Session;
}
export const AppStreamManager: FC<AppStreamManagerProps> = ({
    session,
}): JSX.Element => {
    const renderStram = () => {
        switch (session.streamType) {
            case "VIMEO":
                return (
                    <AppVimeoFrame
                        url={session.streamUrl}
                        width="10"
                        height="10"
                    />
                );
            case "YOUTUBE":
                return (
                    <AppYoutubeFrame
                        url={session.streamUrl}
                        width="1522"
                        height="910"
                    />
                );
            case "DACAST":
                return (
                    <AppDacastFrame
                        id="dacast"
                        provider="dacast"
                        width={1522}
                        height={910}
                        configuration={{
                            videoURL: session.streamUrl,
                        }}
                    />
                );
            case "KNOVIO":
                return (
                    <AppKnovioPlayer
                        width={1522}
                        height={910}
                        linkUrl={session.streamUrl}
                    />
                );

            default:
                return <></>;
        }
    };

    return <div className="app-video-stream">{renderStram()}</div>;
};
