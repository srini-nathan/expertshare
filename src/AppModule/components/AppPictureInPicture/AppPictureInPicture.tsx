import React, { FC } from "react";
import Draggable, { DraggableProps } from "react-draggable";

import "./assets/scss/style.scss";

interface AppPictureInPictureProps extends Partial<DraggableProps> {
    show?: boolean;
    width?: string | number;
    height?: string | number;
}

export const AppPictureInPicture: FC<AppPictureInPictureProps> = ({
    show = true,
    width = 336,
    height = 192,
    children,
    ...others
}): JSX.Element => {
    const [showDraggable, setShowDraggable] = React.useState(true);

    React.useEffect(() => {
        setShowDraggable(show);
    }, []);

    const closeDraggable = () => {
        setShowDraggable(false);
    };

    return (
        <>
            {showDraggable && (
                <Draggable
                    axis="both"
                    handle=".handle"
                    scale={1}
                    defaultClassName="draggable-container"
                    {...others}
                >
                    <div className="box" style={{ width, height }}>
                        <span className="handle icon-btn move-btn">
                            <i className="fas fa-arrows-alt"></i>
                        </span>
                        <span
                            className="close-btn icon-btn"
                            onClick={closeDraggable}
                        >
                            <i className="fas fa-times"></i>
                        </span>
                        {children}
                    </div>
                </Draggable>
            )}
        </>
    );
};
