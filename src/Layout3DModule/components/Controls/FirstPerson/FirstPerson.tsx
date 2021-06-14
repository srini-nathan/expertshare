/* eslint-disable no-console */
import {
    extend,
    ReactThreeFiber,
    useFrame,
    useThree,
} from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { FirstPersonControls } from "three-stdlib";
import { Clock } from "three";

extend({ FirstPersonControls });

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            firstPersonControls: ReactThreeFiber.Object3DNode<
                FirstPersonControls,
                typeof FirstPersonControls
            >;
        }
    }
}

type FirstPersonControlsProps = ReactThreeFiber.Object3DNode<
    FirstPersonControls,
    typeof FirstPersonControls
>;

export const FirstPerson: any = (props: FirstPersonControlsProps) => {
    const {
        camera,
        gl: { domElement },
    } = useThree();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { controlsEnabled } = props;

    const firstPerson = useRef<FirstPersonControls>(null!);
    const clock = new Clock();
    console.log("controls ", firstPerson, props);

    // useEffect(() => {
    //     // eslint-disable-next-line no-console
    //     // console.log(" --- orbit controls Enabled: ", controlsEnabled);
    //     setOrbitEnabled(controlsEnabled);
    // }, [props.controlsEnabled]); // Only re-run the effect if count changes

    useEffect(() => {
        console.log("first: ", firstPerson.current, "\ncamera: ", camera);
        // firstPerson.current.target = new Vector3(0, 1.6, 0);
        firstPerson.current.activeLook = true;
        firstPerson.current.handleResize();

        // continue from first person controls
    }, []);

    useFrame(() => {
        if (firstPerson.current) firstPerson.current.update(clock.getDelta());
    });

    return (
        <firstPersonControls args={[camera, domElement]} ref={firstPerson} />
    );
};
