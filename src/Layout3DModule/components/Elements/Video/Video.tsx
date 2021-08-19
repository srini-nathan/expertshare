import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

interface VideoProps {
    props: JSX.IntrinsicElements["mesh"];
    videoUrl: string;
    parcent?: number;
    ownDepth?: number;
    padding: number;
    percent?: number;
    parent?: any;
    isVideoPlaying: boolean;
}

export const Video = ({
    props,
    videoUrl,
    padding,
    percent = 0,
    parent,
    ownDepth = 0,
    isVideoPlaying = false,
}: VideoProps): JSX.Element => {
    const mesh = useRef<THREE.Mesh>(null!);
    const [scaleSt, setScaleSt] = useState(new Vector3(1, 1, 1));
    const [positionSt, setPositionSt] = useState(new Vector3(0, 0, 0));

    const [videoTexture] = useState(() => {
        const vid = document.createElement("video");
        vid.src = videoUrl;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        // vid.play();
        // eslint-disable-next-line no-console
        return vid;
    });

    const calculateFixedRatio = () => {
        const { height, width, depth } = parent!;
        const using = height < width ? height * percent : width * percent;
        setScaleSt(new Vector3(using, using, 1));
        setPositionSt(new Vector3(0, 0, depth / 2 + ownDepth));
    };

    const reCalculateSize = () => {
        const { height, width, depth } = parent;
        const h = height - padding * 2;
        const w = width - padding * 2;
        // const propsDepth = props && props.position ? props.position : null;
        // const propsZ = propsDepth ? (propsDepth as number[])[0] : 0;
        setScaleSt(new Vector3(w, h, 1));
        // eslint-disable-next-line no-console
        console.log("vide z: ", depth + ownDepth);
        setPositionSt(new Vector3(0, 0, depth / 2 + 0.01));
    };

    useEffect(() => {
        if (isVideoPlaying) videoTexture.play();
        else videoTexture.pause();
    }, [isVideoPlaying]);

    useEffect(() => {
        if (percent) calculateFixedRatio();
        else reCalculateSize();
    }, []);

    return (
        <>
            <mesh {...props} position={positionSt} scale={scaleSt} ref={mesh}>
                <planeBufferGeometry args={[1, 1]} />
                <meshStandardMaterial>
                    <videoTexture attach="map" args={[videoTexture]} />
                </meshStandardMaterial>
            </mesh>
        </>
    );
};
