/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { BackSide, RGBEFormat, sRGBEncoding } from "three";

interface Video360Props {
    props?: JSX.IntrinsicElements["mesh"];
    roomId: number;
    panelId: number;
    targetId: number;
    videoUrl: string;
    tempUrl: string;
    startPlaying: boolean;
    visible?: boolean;
    //  ref: any;
    onVideoEnded: () => void;
}

export const Video360 = ({
    props,
    roomId,
    panelId,
    targetId,
    videoUrl,
    //  ref,
    tempUrl,
    startPlaying = false,
    onVideoEnded,
}: Video360Props): JSX.Element => {
    const [play, setPlay] = useState<boolean>(false);
    // const video360ref = useRef<any>(null);

    // console.log("vid 360 details: ", roomId, panelId, targetId, videoUrl, play);
    const videoEnded = () => {
        setPlay(false);
        onVideoEnded();
    };

    const [videoTexture] = useState(() => {
        // eslint-disable-next-line no-console
        const vid = document.createElement("video");
        vid.src = videoUrl;
        vid.crossOrigin = "Anonymous";
        vid.loop = false;
        vid.onended = videoEnded;
        return vid;
    });

    useEffect(() => {
        if (startPlaying) {
            setPlay(true);
            videoTexture.currentTime = 0;
            videoTexture.play();
            // console.log("mesh containing video: ", video360ref.current);
        }
    }, [startPlaying]);

    return (
        <>
            <mesh visible={startPlaying} {...props}>
                <sphereBufferGeometry args={[49, 32, 32]} />
                <meshBasicMaterial
                    side={BackSide}
                    toneMapped={true}
                    // color={"black"}
                >
                    <videoTexture
                        attach="map"
                        args={[videoTexture]}
                        encoding={sRGBEncoding}
                        format={RGBEFormat}
                    />
                </meshBasicMaterial>
            </mesh>
        </>
    );
};
