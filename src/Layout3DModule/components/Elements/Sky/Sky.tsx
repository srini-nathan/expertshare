/* eslint-disable no-console */
import { ThreeEvent, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Mesh, MeshBasicMaterial, TextureLoader } from "three";
import { useSpring, a } from "@react-spring/three";
import { easeQuadInOut } from "d3-ease";
import { ROOM_FADE_DURATION } from "../../Helpers/Utils";

interface SkyProps {
    props?: JSX.IntrinsicElements["mesh"];
    textureImage: any;
    active: boolean;
    onClick: (e: ThreeEvent<MouseEvent>) => void;
    textureUrl?: string;
    setGroupActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sky = ({
    props,
    active,
    textureImage,
    onClick,
    setGroupActive,
}: // textureUrl,
SkyProps): JSX.Element => {
    const mesh = useRef<Mesh>(null!);
    const material = useRef<MeshBasicMaterial>(null!);
    // const texture = useRef<MeshBasicMaterial>
    const [localActive, setLocalActive] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentActive, setCurrentActive] = useState<boolean>(active);
    // console.log("loading sky: ", textureImage);
    const url: string = textureImage;
    const texture = useLoader(TextureLoader, url);

    const fadeInOut = useSpring({
        opacity: active ? 1 : 0,
        delay: active ? ROOM_FADE_DURATION : 0,
        config: {
            duration: active ? ROOM_FADE_DURATION : ROOM_FADE_DURATION,
            easing: easeQuadInOut,
        },
        onChange: () => {
            if (material) {
                // material.current.transparent = true;
                // material.current.needsUpdate = true;
            }
        },
        onStart: (v) => {
            if (v.value.opacity <= 0.5) {
                material.current.transparent = true;
                material.current.visible = true;
            } else {
                material.current.transparent = true;
            }
        },
        onRest: (v) => {
            if (v.value.opacity <= 0.5) {
                material.current.transparent = true;
                material.current.visible = false;
            } else {
                material.current.transparent = false;
            }
            setGroupActive(active);
            setCurrentActive(active);
        },
    });

    useEffect(() => {
        // eslint-disable-next-line no-console
        // console.log("this room is active: ", localActive, currentActive);
        if (active !== localActive) setLocalActive(active);
    }, [active]);

    return (
        <>
            <Suspense fallback={null}>
                <mesh
                    {...props}
                    ref={mesh}
                    onClick={onClick}
                    visible={localActive || currentActive}
                >
                    <sphereBufferGeometry args={[50, 32, 32]} />

                    {texture && (
                        <a.meshBasicMaterial
                            side={THREE.BackSide}
                            ref={material}
                            attach={"material"}
                            opacity={fadeInOut.opacity}
                            map={texture}
                            visible={localActive || currentActive}
                            transparent={false}
                        />
                    )}
                </mesh>
            </Suspense>
        </>
    );
};
