import React, { FC } from "react";
import Vimeo from "@u-wave/react-vimeo";

export interface AppVimeo {
    url: string;
    width: string;
    height: string;
    configuration?: any;
}

export const AppVimeoFrame: FC<AppVimeo> = ({
    url,
    width,
    height,
}): JSX.Element => <Vimeo video={url} autoplay width={width} height={height} />;
