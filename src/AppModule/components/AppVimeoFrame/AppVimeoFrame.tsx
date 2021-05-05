import React, { FC } from "react";
import Vimeo from "@u-wave/react-vimeo";

export interface AppVimeo {
    url: string;
}

export const AppVimeoFrame: FC<AppVimeo> = ({ url }): JSX.Element => (
    <Vimeo video={url} autoplay width={640} height={360} />
);
