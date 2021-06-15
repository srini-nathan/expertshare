import React, { FC } from "react";
import { usePlayer, OVPProvider } from "use-player";

export interface AppDacastFrameProps {
    id: string;
    provider: OVPProvider;
    width: number | null;
    height: number | null;
    configuration?: any;
}

export const AppDacastFrame: FC<AppDacastFrameProps> = ({
    id,
    width,
    height,
    configuration,
}): JSX.Element => {
    const playerRef = React.useRef(null);
    const playerOptions: any = {
        autoplay: false,
        provider: "dacast",
        width,
        height,
        ...configuration,
    };
    usePlayer(playerRef, id, playerOptions);

    return <div ref={playerRef}></div>;
};
