import React, { useEffect } from "react";
import Draggable from "react-draggable";
import { useRecoilState } from "recoil";
import { renderStreams } from "../AppStreamManager";
import "./assets/scss/style.scss";
import { appPipPlayer, AppPipPlayerType } from "../../atoms";

export const AppPictureInPicture = (): JSX.Element => {
    const [value, setValue] = useRecoilState<AppPipPlayerType | null>(
        appPipPlayer
    );

    const [showDraggable, setShowDraggable] = React.useState(value !== null);

    useEffect(() => {
        if (value !== null) {
            setShowDraggable(value.isLive);
        }
    }, [value]);

    if (value === null) {
        return <></>;
    }

    const { streamType, streamUrl, zoomMeeting, zoomSignature } = value;

    const closeDraggable = () => {
        setValue(null);
    };

    return (
        <>
            {showDraggable && (
                <Draggable
                    axis="both"
                    handle=".handle"
                    scale={1}
                    defaultClassName="draggable-container"
                >
                    <div className="box">
                        <span className="handle icon-btn move-btn">
                            <i className="fak fa-arrows-light"></i>
                        </span>
                        <span
                            className="close-btn icon-btn"
                            onClick={closeDraggable}
                        >
                            <i className="fas fa-times"></i>
                        </span>
                        {renderStreams(streamType, streamUrl, zoomMeeting, zoomSignature)}
                    </div>
                </Draggable>
            )}
        </>
    );
};
