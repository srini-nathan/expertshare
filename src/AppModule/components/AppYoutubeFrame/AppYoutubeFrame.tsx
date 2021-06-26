import React, { FC } from "react";
import YouTube, { Options, PlayerVars } from "react-youtube";

export interface AppYoutube {
    url: string;
    height: string;
    width: string;
    configuration?: PlayerVars; // https://developers.google.com/youtube/player_parameters
}

export const AppYoutubeFrame: FC<AppYoutube> = ({
    url,
    height,
    width,
    // configuration,
}): JSX.Element => {
    let videoID = url.split("v=")[1];
    if (videoID) {
        const ampersandPosition = videoID.indexOf("&");

        if (ampersandPosition !== -1) {
            videoID = videoID.substring(0, ampersandPosition);
        }
        const opts: Options = {
            height,
            width,
            // playerVars: configuration,
        };

        return <YouTube videoId={videoID} opts={opts} />;
    }
    return <></>;
};
