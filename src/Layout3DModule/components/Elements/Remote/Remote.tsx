/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
// import { useFrame, ReactThreeFiber } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Ring } from "@react-three/drei";
import {
    DoubleSide,
    TextureLoader,
    BufferGeometry,
    Group,
    Vector3,
    //  Vector3,
} from "three";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";

import { Image } from "../Image";

import * as textureGlow from "../../../assets/images/rooms/glow.png";
// import * as testTexture from "../../../assets/images/rooms/door.png";
import * as bananaTexture from "../../../assets/images/rooms/banana.gif";

import { ParentProps } from "../../Types/Interfaces";

const AnimationType = {
    GLOWING: "glowing",
    BLINKING: "blinking",
    SHAKING: "shaking",
};

interface RemoteProps {
    props: JSX.IntrinsicElements["mesh"];
    disable: boolean;
    animationDisable: boolean;
    animationType: string;
    target: any;
    image: string;
    visible: boolean;
    onRemoteClick: (arg0: ThreeEvent<MouseEvent>) => void;
    onRemoteMissed: () => void;
}

export const Remote = ({
    props,
    disable,
    animationDisable,
    animationType,
    image,
    visible = false,
    onRemoteClick,
    onRemoteMissed,
}: RemoteProps): JSX.Element => {
    // const mesh = useRef<Mesh>(null!);
    const group = useRef<Group>(null!);
    const geom = useRef<BufferGeometry>(null!);
    // const [active, setActive] = useState(false);

    const [loop, setLoop] = useState(false);
    const [loop1, setLoop1] = useState(false);
    const [loop2, setLoop2] = useState(false);

    const [imageUrl, setImageUrl] = useState<string>(null!);

    const scaleGlowing = useSpring({
        scale: loop ? [1.2, 1.2, 1] : [0.3, 0.3, 1],
        onRest: () => {
            if (setLoop) setLoop(!loop);
        },
        config: { duration: 800 },
    });

    const scaleBlinking = useSpring({
        scale: loop1 ? [1.2, 1.2, 1] : [0, 0, 1],
        onResolve: () => {
            if (setLoop1) setLoop1(!loop1);
        },
        config: { duration: 100 },
    });

    const positionShake = useSpring({
        position: loop2 ? [-0.05, -0.04, 0] : [0.04, 0.05, 0],
        onResolve: () => {
            if (setLoop2) setLoop2(!loop2);
        },
        config: { duration: 300, mass: 1, tension: 180, friction: 12 },
    });

    const rotationProps = props.rotation as any;
    const positionProps = props.position as any;
    const scaleProps = props.scale as any;

    let animScale: any;
    if (animationType === AnimationType.GLOWING) animScale = scaleGlowing;
    else if (animationType === AnimationType.BLINKING)
        animScale = scaleBlinking;
    else animScale = { scale: new Vector3(0.7, 0.7, 0.7) };

    const animPosi =
        animationType === AnimationType.SHAKING
            ? positionShake
            : { position: new Vector3(0, 0, 0) };

    const url: string = textureGlow.default;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const texture = useLoader(TextureLoader, url);

    const parent: ParentProps = {
        width: 0.35,
        height: 0.35,
        depth: 0,
    };

    const onClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        // console.log("clicked on remote event: ", e.object);
        onRemoteClick(e);
        // setActive(true);
    };

    useEffect(() => {
        if (image && image === "url") {
            setImageUrl(image);
        }
    }, [image]);

    useEffect(() => {
        if (geom.current) {
            geom.current.translate(0, 0, -0.015);
            // console.log("geom: ", geom.current, animScale.scale as any);
        }
        return () => {
            geom.current = null!;
        };
    }, [geom]);

    // useEffect(() => {
    //     console.log("animationDisable : ", animationDisable);
    // }, [animationDisable]);

    return (
        <>
            <group
                ref={group}
                position={positionProps}
                rotation={[
                    rotationProps!.x,
                    rotationProps!.y,
                    rotationProps!.z,
                ]}
                visible={visible}
                scale={scaleProps}
                onClick={onClick}
                onPointerMissed={() => {
                    // setActive(false);
                    onRemoteMissed();
                }}
            >
                {!disable && !imageUrl && (
                    <Ring args={[0.18, 0.25, 64]} name={"Remote"}>
                        <meshBasicMaterial
                            color={0xffffff}
                            //  {active ? "black" : 0xffffff}
                            side={DoubleSide}
                            toneMapped={false}
                        />
                    </Ring>
                )}

                {imageUrl && (
                    <Image
                        props={{ position: [0, 0, 0.02] }}
                        textureUrl={bananaTexture.default}
                        parent={parent}
                        padding={0}
                        side={DoubleSide}
                        transparent={true}
                        alphaTest={0.3}
                    />
                )}

                {!animationDisable && (
                    <a.mesh
                        scale={animScale.scale as Vector3}
                        position={animPosi.position as Vector3}
                    >
                        <planeBufferGeometry args={[0.7, 0.7]} ref={geom} />
                        <meshBasicMaterial
                            side={DoubleSide}
                            map={texture}
                            transparent={true}
                            color={"#666666"}
                            toneMapped={false}
                            depthWrite={false}
                            depthTest={true}
                            // alphaTest={0.1}
                        />
                    </a.mesh>
                )}
            </group>
        </>
    );
};
