/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from "react";

import { Text } from "@react-three/drei";
import { Color, Euler, Vector3 } from "three";
import { degToRad } from "../../Helpers/Utils";

interface LabelProps {
    props: JSX.IntrinsicElements["mesh"];
    fontSize: number;
    color: string;
    text: string;
    parent: any;
    // setControls: (arg0: boolean) => void;
}

export const Label = ({
    props,
    color,
    text,
    parent,
    fontSize = 10,
}: LabelProps) => {
    const textRef = useRef<THREE.Mesh>(null!);

    const labelPos = props.position as Vector3;
    const labelScale = props.scale as Vector3;

    const [positionSt, setPositionSt] = useState(
        labelPos ? new Vector3(labelPos.x, labelPos.y, labelPos.z) : null
        // new Vector3(0, 0, 0)
    );

    const [rotationSt, setRotationSt] = useState(
        new Euler(degToRad(0), degToRad(0), degToRad(0))
    );

    const matRef = useRef(null!);

    // console.log("adding label with props: ", customProps);

    const reCalculatePosition = () => {
        // if (positionSt) {
        const pX = -(parent.width / 2);
        const pY = parent.height / 2 + fontSize * 0.008;
        const pZ = 0;
        setPositionSt(new Vector3(pX, pY, pZ));
        // }
    };

    useEffect(() => {
        if (props.rotation) {
            const r = props.rotation as any;
            setRotationSt(
                new Euler(degToRad(r.x), degToRad(r.y), degToRad(r.z))
            );
        }
        reCalculatePosition();
        // setColorSt(color);
    }, [props]);

    return (
        <>
            {positionSt && (
                <Text
                    // props={{ position: customProps.position }}
                    position={positionSt}
                    rotation={rotationSt}
                    scale={
                        new Vector3(labelScale.x, labelScale.y, labelScale.z)
                    }
                    ref={textRef}
                    fontSize={fontSize / 18}
                    textAlign={"left"}
                    anchorX="left"
                    anchorY="bottom"
                    onPointerEnter={() => {
                        document.body.style.cursor = "pointer";
                    }}
                    onPointerLeave={() => {
                        document.body.style.cursor = "default";
                    }}
                >
                    {color && (
                        <meshBasicMaterial
                            ref={matRef}
                            attach="material"
                            color={
                                new Color(
                                    parseInt(color.replace("#", "0x"), 16)
                                )
                            }
                        />
                    )}
                    {text}
                </Text>
            )}
        </>
    );
};
