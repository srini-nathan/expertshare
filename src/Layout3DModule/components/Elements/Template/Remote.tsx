// import { useFrame, ReactThreeFiber } from "@react-three/fiber";
import React, { useRef, useState } from "react";

interface RemoteProps {
    props: JSX.IntrinsicElements["mesh"];
    setControls: (arg0: boolean) => void;
}

export const Remote = ({ props }: RemoteProps) => {
    const mesh = useRef<THREE.Mesh>(null!);
    const [active, setActive] = useState(false);

    return (
        <>
            <mesh
                {...props}
                ref={mesh}
                scale={active ? 1 : 1}
                // onClick={() => {
                onPointerDown={() => {
                    setActive(true);
                }}
                onPointerMissed={() => {
                    setActive(false);
                }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={active ? "white" : "orange"} />
            </mesh>
        </>
    );
};
