// import { useFrame, ReactThreeFiber } from "@react-three/fiber";
import React from "react";
import { Html } from "@react-three/drei";
import { Vector2 } from "three";

// import * as playButton from "../../../assets/images/rooms/play-button.png";

interface IframeProps {
    size: Vector2;
    source: string;
    // padding: number;
    // parent: any;
    // defaultVideoUrl: string;
    // editMode: boolean;
    // isVideoPlaying: boolean;
}

export const IframePanel = ({
    size,
    source,
}: // padding,
// parent,
// defaultVideoUrl,
// isVideoPlaying,
IframeProps): JSX.Element => {
    return (
        <>
            <mesh position={[0, 0, -0.3]}>
                {/* <boxBufferGeometry args={[size.x, size.y, 0.001]} /> */}
                {/* <meshStandardMaterial /> */}
                <Html transform center>
                    <iframe
                        src={source}
                        width={size.x * 40}
                        height={size.y * 40}
                    ></iframe>
                </Html>
            </mesh>

            {/* {!isVideoPlaying && (
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
            /> */}
        </>
    );
};
