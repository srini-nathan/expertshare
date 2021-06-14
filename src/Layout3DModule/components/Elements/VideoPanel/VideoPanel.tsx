// import { useFrame, ReactThreeFiber } from "@react-three/fiber";
import React from "react";
import { Image } from "../Image";
import { Video } from "../Video";

import * as playButton from "../../../assets/images/rooms/play-button.png";

interface VideoProps {
    padding: number;
    parent: any;
    defaultVideoUrl: string;
    editMode: boolean;
    isVideoPlaying: boolean;
}

export const VideoPanel = ({
    padding,
    parent,
    defaultVideoUrl,
    isVideoPlaying,
}: VideoProps): JSX.Element => {
    // const mesh = useRef<THREE.Mesh>(null!);
    // const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

    // const onClickVideo = (e: ThreeEvent<MouseEvent>) => {
    //     // eslint-disable-next-line no-console
    //     console.log("editMode: ", editMode);
    //     if (!editMode) {
    //         e.stopPropagation();
    //         onClick(!isVideoPlaying);
    //         setIsVideoPlaying(!isVideoPlaying);
    //     }
    // };
    return (
        <>
            {!isVideoPlaying && (
                <Image
                    textureUrl={playButton.default}
                    padding={padding}
                    percent={0.5}
                    parent={parent}
                    ownDepth={0.1}
                />
            )}
            <Video
                props={{ position: [0, 0, 0] }}
                videoUrl={defaultVideoUrl}
                padding={padding}
                parent={parent}
                ownDepth={-0.02}
                isVideoPlaying={isVideoPlaying}
            />
        </>
    );
};
