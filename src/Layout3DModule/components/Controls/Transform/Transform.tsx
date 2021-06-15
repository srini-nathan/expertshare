/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import { extend, ReactThreeFiber, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TransformControls } from "three-stdlib";

extend({ TransformControls });

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            transformControls: ReactThreeFiber.Object3DNode<
                TransformControls,
                typeof TransformControls
            >;
        }
    }
}

interface TransformControlsProps
    extends ReactThreeFiber.Object3DNode<
        TransformControls,
        typeof TransformControls
    > {
    controlsEnabled: boolean;
    selected: any;
    transformType: string;
    setOrbitControls: (arg0: boolean) => void;
}

export const Transform: any = (props: TransformControlsProps) => {
    const {
        camera,
        gl: { domElement },
    } = useThree();

    const [currentSelected, setCurrentSelected] = useState<THREE.Object3D>(
        null!
    );
    // const [dragging, setDragging] = useState<boolean>(false);
    const dragging = useRef<boolean>(true);
    const { transformType, setOrbitControls } = props;
    const selected = useRef(props.selected);
    const [transforming, setTransforming] = useState(false);
    const transform = useRef<TransformControls>(null!);

    useEffect(() => {
        selected.current = props.selected;
        setCurrentSelected(props.selected);
    }, [props.selected]); // Only re-run the effect if count changes

    useEffect(() => {
        if (transform.current) {
            const { current: controls } = transform;
            controls.setSpace("world");
            // @ts-ignore
            controls.showZ = true;
            switch (transformType) {
                case "rotate":
                    controls.setMode("rotate");
                    controls.setSpace("world");
                    // @ts-ignore
                    controls.showZ = false;
                    break;
                case "scale":
                    controls.setMode("scale");
                    break;
                case "translate":
                default:
                    controls.setMode("translate");
            }
            const callback = (event: any) => {
                // console.log("setting orbit change: ", event.value);
                setOrbitControls(!event.value);
            };
            controls.addEventListener("dragging-changed", callback);

            return () => {
                controls.removeEventListener("dragging-changed", callback);
            };
        }
        return () => null;
    });

    return (
        <>
            {currentSelected && (
                <transformControls
                    ref={transform}
                    args={[camera, domElement]}
                    onPointerDown={() => {
                        dragging.current = true;
                    }}
                    onUpdate={(self) => {
                        if (currentSelected) {
                            // e.stopPropagation();
                            self.attach(currentSelected);
                            if (!transforming && dragging.current) {
                                setTransforming(true);
                                // setOrbitControls(false);
                            }
                        } else {
                            self.detach();
                        }
                    }}
                    onPointerUp={(e) => {
                        e.stopPropagation();
                        // console.log("dragggggging --- onPinterUp: ", dragging.current);
                        dragging.current = false;
                        if (transforming && dragging.current) {
                            setTransforming(false);
                        }
                    }}
                />
            )}
        </>
    );
};
