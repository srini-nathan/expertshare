/* eslint-disable no-console */
// import { useFrame, ReactThreeFiber } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { TextureLoader, Vector3, FrontSide, Side, Texture } from "three";
import GifLoader from "three-gif-loader";
// import GifMaterial from "three-gif-material";
import { ParentProps } from "../../Types/Interfaces";

// extend({ GifLoader });

interface ImageProps {
    props?: JSX.IntrinsicElements["mesh"];
    textureUrl: string;
    percent?: number;
    padding: number;
    parent?: ParentProps;
    ownDepth?: number;
    side?: Side;
    transparent?: boolean;
    alphaTest?: number;
}

export const Image = ({
    props,
    textureUrl,
    padding,
    parent,
    percent = 0,
    ownDepth = 0,
    side = FrontSide,
    transparent = false,
    alphaTest = 1,
}: ImageProps): JSX.Element => {
    const mesh = useRef<THREE.Mesh>(null!);
    const matgif = useRef<any>(null!);
    // const [active, setActive] = useState(false);

    const [scaleSt, setScaleSt] = useState(new Vector3(1, 1, 1));
    const [positionSt, setPositionSt] = useState(new Vector3(0, 0, 0));

    // const loader =
    //     textureUrl.indexOf("gif") >= 0 ? TextureLoader : TextureLoader;
    const texture = useLoader(TextureLoader, textureUrl);

    const calculateFixedRatio = () => {
        const { height, width, depth } = parent!;
        const using = height < width ? height * percent : width * percent;
        setScaleSt(new Vector3(using, using, 1));
        setPositionSt(new Vector3(0, 0, depth + ownDepth));
    };

    const reCalculateSize = () => {
        const { height, width, depth } = parent!;
        const h = height - padding * 2;
        const w = width - padding * 2;
        setScaleSt(new Vector3(w, h, 1));
        setPositionSt(new Vector3(0, 0, depth));
    };

    useEffect(() => {
        if (percent) calculateFixedRatio();
        else reCalculateSize();
        const gifLoader = new GifLoader();
        let texture2: Texture = null!;

        if (textureUrl && textureUrl.indexOf("gif") >= 0 && !matgif.current) {
            texture2 = gifLoader.load(
                // resource URL
                textureUrl
            );
            // console.log("applied texture: ", texture2);
            matgif.current = texture2; // = new MeshBasicMaterial({
        }
        // console.log("in image: ", parent, padding);
        return () => {
            // matgif.current.dispose();
            matgif.current = null;
        };
    }, [textureUrl]);

    return (
        <>
            <mesh
                {...props}
                position={positionSt}
                ref={mesh}
                scale={scaleSt}
                frustumCulled={false}
            >
                <planeBufferGeometry args={[1, 1]} />
                <meshBasicMaterial
                    // color={"white"}
                    attach="material"
                    map={matgif.current ? matgif.current : (texture as Texture)}
                    transparent={transparent}
                    side={side}
                    toneMapped={false}
                    alphaTest={alphaTest}
                />
            </mesh>
        </>
    );
};
