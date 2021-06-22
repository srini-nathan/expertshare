import { ThreeEvent, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
    Mesh,
    MeshBasicMaterial,
    TextureLoader,
    BackSide,
    EquirectangularRefractionMapping,
    sRGBEncoding,
} from "three";
import { useSpring, a } from "@react-spring/three";
import { easeQuadInOut } from "d3-ease";
import { ROOM_FADE_DURATION } from "../../Helpers/Utils";

interface SkyProps {
    props?: JSX.IntrinsicElements["mesh"];
    textureImage: string;
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
    const { gl } = useThree();
    const material = useRef<MeshBasicMaterial>(null!);
    const [localActive, setLocalActive] = useState<boolean>(false);
    const [currentActive, setCurrentActive] = useState<boolean>(active);
    const url: string = textureImage;
    const texture = useLoader(TextureLoader, url);
    useEffect(() => {
        if (texture) {
            texture.mapping = EquirectangularRefractionMapping;
            texture.encoding = sRGBEncoding;
            // texture.flipY = true;
            texture.needsUpdate = true;
        }
    }, [texture, gl]);

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
        if (active !== localActive) setLocalActive(active);
    }, [active]);

    // useEffect(() => {
    //     mesh.current.scale.x = 1;
    //     mesh.current.updateMatrix();
    // }, [mesh]);

    return (
        <>
            <Suspense fallback={null}>
                <mesh
                    {...props}
                    ref={mesh}
                    onClick={onClick}
                    scale={[1, 1, 1]}
                    visible={localActive || currentActive}
                >
                    <sphereBufferGeometry
                        attach="geometry"
                        args={[50, 64, 32]}
                    />
                    {texture && (
                        <a.meshLambertMaterial
                            envMap={texture}
                            side={BackSide}
                            opacity={fadeInOut.opacity}
                            reflectivity={1}
                            ref={material}
                            attach={"material"}
                        />
                    )}
                </mesh>
            </Suspense>
        </>
    );
};
