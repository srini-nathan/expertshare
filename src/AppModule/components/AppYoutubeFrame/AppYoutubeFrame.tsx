import React, { FC } from "react";
import YouTube, { Options } from "react-youtube";

export interface AppYoutube {
    incomeString: string;
}

export const AppYoutubeFrame: FC<AppYoutube> = ({
    incomeString,
}): JSX.Element => {
    let videoID = incomeString.split("v=")[1];
    const ampersandPosition = videoID.indexOf("&");

    if (ampersandPosition !== -1) {
        videoID = videoID.substring(0, ampersandPosition);
    }
    const opts: Options = {
        height: "360",
        width: "640",
        playerVars: {
            autoplay: 1,
        },
    };

    return <YouTube videoId={videoID} opts={opts} />;
};
