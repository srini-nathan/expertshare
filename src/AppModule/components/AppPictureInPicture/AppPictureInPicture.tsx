import React, { useEffect } from "react";
import Draggable from "react-draggable";
import { SessionType } from "../../contexts";
import { SessionContext } from "../../contexts/SessionContext";
import { renderStreams } from "../AppStreamManager";
import "./assets/scss/style.scss";

export const AppPictureInPicture = (): JSX.Element => {
    const { state, dispatch } = React.useContext(SessionContext);

    const { isLive, streamType, streamUrl } = state;

    const [showDraggable, setShowDraggable] = React.useState(isLive);

    useEffect(() => {
        setShowDraggable(isLive);
    }, [isLive]);

    const closeDraggable = () => {
        dispatch({
            type: SessionType.REMOVE,
        });
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
                            <i className="fas fa-arrows-alt"></i>
                        </span>
                        <span
                            className="close-btn icon-btn"
                            onClick={closeDraggable}
                        >
                            <i className="fas fa-times"></i>
                        </span>
                        {renderStreams(streamType, streamUrl)}
                    </div>
                </Draggable>
            )}
        </>
    );
};
