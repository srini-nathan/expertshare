import React, { FC } from "react";

export interface AppSwisscomFrameProps {
    url: string;
    width: number;
    height: number;
    className?: string;
}

export const AppSwisscomFrame: FC<AppSwisscomFrameProps> = ({
    url,
    className,
}): JSX.Element => {
    return (
        <div className={className}>
            <iframe id="wbc-iframe" width="100%" src={url}></iframe>
        </div>
    );
};
