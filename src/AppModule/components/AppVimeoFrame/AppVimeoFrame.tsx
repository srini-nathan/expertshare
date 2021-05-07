import React, { FC } from "react";
import Vimeo, { VimeoProps } from "@u-wave/react-vimeo";

export interface AppVimeo {
    url: string;
    width: string;
    height: string;
    configuration?: Partial<VimeoProps>;
}

export const AppVimeoFrame: FC<AppVimeo> = ({
    url,
    width,
    height,
    configuration,
}): JSX.Element => (
    <Vimeo
        video={url}
        autoplay
        width={width}
        height={height}
        {...configuration}
    />
);
