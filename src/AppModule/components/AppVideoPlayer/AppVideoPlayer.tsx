import React, { FC } from "react";

export interface AppVideoPlayerType {
    url: string;
}

export const AppVideoPlayer: FC<AppVideoPlayerType> = ({
    url,
}): JSX.Element => (
    <div className="video-container m-0 p-0 position-relative">
        <video id="video-player" className="video-player" controls>
            <source src={url} type="video/mp4" />
        </video>
    </div>
);
