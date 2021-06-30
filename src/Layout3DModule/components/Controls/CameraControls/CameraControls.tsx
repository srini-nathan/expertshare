/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import {
    extend,
    ReactThreeFiber,
    ThreeEvent,
    useFrame,
    useThree,
} from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import {
    CameraHelper,
    Euler,
    Object3D,
    PerspectiveCamera as PerspectiveCameraOriginal,
    Vector3,
    LinearEncoding,
    sRGBEncoding,
} from "three";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    easeCubicInOut,
    easeQuadInOut,
    easeCubic,
    easeElasticOut,
} from "d3-ease";

import { OrbitControls, TransformControls } from "three-stdlib";
import { useHelper, PerspectiveCamera } from "@react-three/drei";

import { useSpring } from "@react-spring/three";
import {
    applyRotationToCamera,
    normalizeRotation,
    setParamsToOrbitControls,
    ROOM_FADE_DURATION,
    FOV_ANIMATION_DURATION,
    inverseUpsideDownCamera,
    PANEL_ANIMATION_DURATION,
} from "../../Helpers/Utils";

import {
    VideoSpheresDataProps,
    RoomProps,
    PanelInterfaceProps,
    Video360Props,
} from "../../Types/Interfaces";
import { Video360 } from "../../Elements/Video360";
import { PanelTypes } from "../../Types/SceneTypes";

import * as texture360Video from "../../../assets/images/rooms/Komp_1_res1.mp4";

extend({ OrbitControls, TransformControls });

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Object3DNode<
                OrbitControls,
                typeof OrbitControls
            >;
        }
    }
}

interface OrbitControlsProps
    extends ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls> {
    controlsEnabled: boolean;
    onOrbitDrag: () => void;
    onClickObject: (arg0: Object3D) => void;
    changeRoomNow: (arg0: number) => void;
    editMode: boolean;
    isTransitionEnabled: boolean;
    targetData: {
        duration: number;
        fromPosition: Vector3;
        toPosition: Vector3;
        toRotation: Euler;
        video: Video360Props;
    };
    currentRoom: number;
    initialCameraRotation: Euler;
    initialCameraPosition: any;
    rooms: RoomProps[];
}

export const CameraControls = (props: OrbitControlsProps): JSX.Element => {
    const {
        camera,
        gl: { domElement },
        gl,
    } = useThree();
    // const set = useThree((state) => state.set);

    const [orbitEnabled, setOrbitEnabled] = useState(false);
    const {
        controlsEnabled,
        editMode,
        isTransitionEnabled,
        targetData,
        initialCameraRotation,
        initialCameraPosition,
        onOrbitDrag,
        onClickObject,
        currentRoom,
        changeRoomNow,
        rooms,
    } = props;

    const [startPlayingVideo, setStartPlayingVideo] = useState<boolean>(false);
    const [videoSphereData, setVideoSphereData] = useState<
        VideoSpheresDataProps[]
    >(null!);

    const orbit = useRef<OrbitControls>(null!);
    const perspectiveOrbit = useRef<Object3D>(null!);
    const perspectiveFirstPerson = useRef<Object3D>(null!);
    const perspectiveHelper = useRef<Object3D>(null!);
    const orbitCount = useRef<number>(0);

    const [zoomIn, setZoomIn] = useState<boolean>(false);

    const afterVideoReference = useRef<{
        to: Euler;
        from: Euler;
        room: number;
        duration: number;
    }>(null!);
    // const toTargetReference = useRef<Euler>(null!);
    // const fromTargetReference = useRef<Euler>(null!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firstPersonCameraRotation = useRef(initialCameraRotation.clone()); // useRef(initialCameraRotation!);
    const firtPersonCameraPosition = useRef(
        new Vector3(
            parseFloat(initialCameraPosition.x),
            parseFloat(initialCameraPosition.y),
            parseFloat(initialCameraPosition.z)
        )
    );
    // const videoSpheres = useRef<typeof Video360[]>([]);

    useHelper(perspectiveHelper, CameraHelper, "black");
    const [camSpring, setCamSpring] = useSpring(() => ({
        from: {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z,
        },
        x: camera.rotation.x,
        y: camera.rotation.x,
        z: camera.rotation.x,
        cancel: true,
        immediate: true,
    }));

    const fovSpring = useSpring({
        fov: zoomIn ? 50 : 80,
        delay: 100 + (zoomIn ? 0 : ROOM_FADE_DURATION * 6),
        config: {
            duration: FOV_ANIMATION_DURATION,
            easing: easeQuadInOut,
        },
        onChange: (fov1) => {
            const cam = perspectiveFirstPerson.current as PerspectiveCameraOriginal;
            cam.fov = (fov1.value.fov as unknown) as number;
            cam.updateProjectionMatrix();
            // console.log("cam fov: ", cam.fov, fov1.value);
        },
    });

    const getNewTarget = (cam: Object3D, distance: number): Vector3 => {
        const { position } = cam;
        // cam.updateMatrix();
        const p = position.clone();
        const direction = new Vector3();
        cam.getWorldDirection(direction);
        return p.addScaledVector(direction, distance);
    };

    const camOnClick = (e: ThreeEvent<MouseEvent>) => {
        if (editMode) {
            e.stopPropagation();
            onClickObject(e.object.parent!);
        }
    };

    const createAnimationBack = (
        to: Euler,
        from: Euler,
        duration: number,
        callback: any
    ) => {
        // console.log("from : ", to, " to : ", from);
        setZoomIn(false);
        setTimeout(() => {
            applyRotationToCamera(perspectiveFirstPerson.current, to);
        }, ROOM_FADE_DURATION * 2 + PANEL_ANIMATION_DURATION);
        setCamSpring(() => ({
            from: {
                x: to.x,
                y: to.y,
                z: to.z,
            },
            x: from.x,
            y: from.y,
            z: from.z,
            config: {
                // duration: 1500,
                // mass: 3,
                // tension: 300,
                // friction: 100,
                ease: easeCubicInOut,
                duration: duration / 2,
                // easing:
            },
            delay: ROOM_FADE_DURATION * 6,
            immediate: false,
            onStart: () => {
                // console.log(
                //     "perspecive cam rotation: ",
                //     perspectiveFirstPerson.current.rotation
                // );

                applyRotationToCamera(
                    perspectiveFirstPerson.current,
                    to as Euler
                );
                // orbit.current.enabled = true;
                // orbit.current.update();
                // orbit.current.enabled = false;
            },
            onChange: (rotation) => {
                applyRotationToCamera(
                    perspectiveFirstPerson.current,
                    rotation.value
                );
                // perspectiveFirstPerson.current.rotation.x = rotation.value.x;
                // perspectiveFirstPerson.current.rotation.y = rotation.value.y;
                // orbit.current.update();
            },
            onResolve: () => {
                orbit.current.object = perspectiveFirstPerson.current as PerspectiveCameraOriginal;
                callback();
            },
        }));
    };

    const videoEnded = () => {
        setStartPlayingVideo(false);
        videoSphereData.forEach((videoData) => {
            videoData.visible = false;
        });
        changeRoomNow(afterVideoReference.current.room);
        perspectiveFirstPerson.current.rotation.set(
            afterVideoReference.current.from.x,
            afterVideoReference.current.from.y,
            afterVideoReference.current.from.z
        );
        createAnimationBack(
            afterVideoReference.current.to,
            afterVideoReference.current.from,
            afterVideoReference.current.duration,
            () => {
                orbit.current.target = getNewTarget(
                    perspectiveFirstPerson.current,
                    0.001
                );
                orbit.current.update();
                orbit.current.enabled = true;
            }
        );
    };

    useEffect(() => {
        setOrbitEnabled(controlsEnabled);
    }, [props.controlsEnabled]); // Only re-run the effect if count changes

    useEffect(() => {
        if (perspectiveOrbit.current)
            perspectiveOrbit.current.position.set(12, 6, 8);

        if (orbit.current) orbit.current.update();
    }, [perspectiveOrbit.current]);

    useEffect(() => {
        if (perspectiveFirstPerson.current) {
            perspectiveFirstPerson.current.rotation.set(
                initialCameraRotation.x,
                initialCameraRotation.y,
                initialCameraRotation.z
            );
            perspectiveHelper.current = perspectiveFirstPerson.current;
        }

        if (orbit.current && perspectiveFirstPerson.current) {
            if (!editMode) {
                // first person mode
                perspectiveHelper.current = null!;
                const tgt = getNewTarget(perspectiveFirstPerson.current, 0.01);
                orbit.current.object = perspectiveFirstPerson.current as any;
                setParamsToOrbitControls(
                    orbit.current,
                    tgt,
                    0.4,
                    false,
                    0.01,
                    0.01,
                    0.01
                );
            } else {
                // edit mode
                perspectiveHelper.current = perspectiveFirstPerson.current;
                orbit.current.object = perspectiveOrbit.current as any;
                setParamsToOrbitControls(
                    orbit.current,
                    new Vector3(0, 1.6, 0),
                    1,
                    true,
                    1,
                    1,
                    10
                );
            }
        }
    }, [perspectiveFirstPerson.current, orbit.current]);

    useEffect(() => {
        // Changing edit mode
        // console.log("-----  USE EFFECT: editMode");
        if (orbit.current) {
            if (!editMode) {
                // first person mode
                perspectiveHelper.current = null!;
                const tgt = getNewTarget(perspectiveFirstPerson.current, 0.01);
                orbit.current.object = perspectiveFirstPerson.current as any;
                setParamsToOrbitControls(
                    orbit.current,
                    tgt,
                    0.4,
                    false,
                    0.01,
                    0.01,
                    0.01
                );
            } else {
                // edit mode
                perspectiveHelper.current = perspectiveFirstPerson.current;
                orbit.current.object = perspectiveOrbit.current as any;
                setParamsToOrbitControls(
                    orbit.current,
                    new Vector3(0, 1.6, 0),
                    1,
                    true,
                    1,
                    1,
                    10
                );
            }
        }
    }, [editMode, perspectiveFirstPerson]);

    useEffect(() => {
        let t;
        console.log("target data: ", targetData);
        // check for animation type and animation target
        if (perspectiveFirstPerson.current && targetData) {
            if (isTransitionEnabled) {
                // transition enabled, start animating camera
                orbit.current.enabled = false;
                const isVideo =
                    targetData.video &&
                    targetData.video.assetUrl &&
                    targetData.video.assetUrl !== "";
                // if (!isVideo)
                setZoomIn(true);

                const fakeCam = perspectiveFirstPerson.current.clone() as PerspectiveCameraOriginal;
                const fakeOrbit = new OrbitControls(fakeCam, undefined);
                fakeOrbit.enabled = true;
                fakeCam.lookAt(targetData.fromPosition.clone()); // look towards panel in room 1(to position), TODO: zoom in
                fakeOrbit.target = getNewTarget(fakeCam, 0.001);
                fakeOrbit.update();
                // FIX ROTATION IDEA: set rotation Z to 0 after look!
                fakeCam.updateMatrix();
                const fRotation = normalizeRotation(
                    camera.rotation.clone(),
                    fakeCam.rotation.clone()
                );
                fakeCam.rotation.set(0, 0, 0);
                fakeOrbit.update();
                fakeCam.lookAt(targetData.toPosition.clone()); // look towards panel in room 2 (from position), TODO: zoom out
                // fakeOrbit.update();
                fakeOrbit.target = getNewTarget(fakeCam, 0.001);
                fakeOrbit.update();
                fakeCam.updateMatrix();

                let tRotation = normalizeRotation(
                    targetData.toRotation.clone(),
                    fakeCam.rotation.clone()

                    // true
                );
                tRotation = inverseUpsideDownCamera(tRotation);
                // const tRotation = fakeCam.rotation.clone();

                afterVideoReference.current = {
                    to: tRotation,
                    from: targetData.toRotation.clone(),
                    room: currentRoom,
                    duration: targetData.duration,
                };
                // console.log("camera rotation: ", camera.rotation);
                console.log("to rotation: ", fRotation);
                console.log("from rotation: ", tRotation);

                // TODO: normalize rotations  - 1/2 DONE
                setCamSpring(() => ({
                    // spring towards panel position
                    from: {
                        x: camera.rotation.x,
                        y: camera.rotation.y,
                        z: camera.rotation.z,
                    },
                    x: fRotation.x,
                    y: fRotation.y,
                    z: fRotation.z,
                    config: {
                        easing: easeQuadInOut,
                        duration: targetData.duration / 2,
                    },
                    // delay: ROOM_FADE_DURATION,
                    immediate: false,
                    onChange: (rotation) => {
                        applyRotationToCamera(
                            perspectiveFirstPerson.current,
                            rotation.value
                        );
                    },
                    onRest: () => {
                        // console.log("target position: ", targetData);
                        if (
                            targetData.video &&
                            targetData.video.assetUrl &&
                            targetData.video.assetUrl !== ""
                        ) {
                            // change room with video first
                            changeRoomNow(-2);
                            videoSphereData.forEach((videoData) => {
                                if (
                                    videoData.videoUrl ===
                                    targetData.video.assetUrl
                                ) {
                                    videoData.visible = true;
                                }
                            });
                            setStartPlayingVideo(true);
                        } else {
                            // change room without video
                            changeRoomNow(currentRoom);
                            createAnimationBack(
                                tRotation,
                                targetData.toRotation.clone(),
                                targetData.duration,
                                () => {
                                    orbit.current.target = getNewTarget(
                                        perspectiveFirstPerson.current,
                                        0.001
                                    );
                                    // console.log("change room now!");
                                    changeRoomNow(currentRoom);
                                    orbit.current.update();
                                    orbit.current.enabled = true;
                                }
                            );
                        }
                    },
                }));
            } else {
                // transition not enabled
                changeRoomNow(currentRoom);

                t = setTimeout(() => {
                    camera.rotation.set(
                        targetData.toRotation.x,
                        targetData.toRotation.y,
                        targetData.toRotation.y
                    );
                    orbit.current.target = getNewTarget(
                        perspectiveFirstPerson.current,
                        0.001
                    );
                    orbit.current.update();
                }, ROOM_FADE_DURATION);
            }
        }
    }, [isTransitionEnabled, currentRoom, targetData]);

    useEffect(() => {
        if (orbit.current) {
            if (!editMode) {
                // first person mode
                perspectiveHelper.current = null!;
                const tgt = getNewTarget(perspectiveFirstPerson.current, 0.01);
                orbit.current.object = perspectiveFirstPerson.current as any;
                setParamsToOrbitControls(
                    orbit.current,
                    tgt,
                    0.4,
                    false,
                    0.01,
                    0.01,
                    0.01
                );
            } else {
                // edit mode
                perspectiveHelper.current = perspectiveFirstPerson.current;
                orbit.current.object = perspectiveOrbit.current as any;
                setParamsToOrbitControls(
                    orbit.current,
                    new Vector3(0, 1.6, 0),
                    1,
                    true,
                    1,
                    1,
                    10
                );
                orbit.current.enableDamping = true;
                orbit.current.dampingFactor = 0.2;
                orbit.current.maxDistance = 500;
            }

            // console.log("sett orbit: ", orbit.current);
        }
    }, [orbit.current]);

    useEffect(() => {
        // console.log("-----  USE EFFECT: []", editMode, orbit.current);

        gl.outputEncoding = sRGBEncoding;
        gl.gammaFactor = 2.2;
        if (orbit.current) {
            // add callbacks to stop orbit while dragging
            const { current: controls } = orbit;
            const callbackEnd = () => {
                if (orbitCount.current > 10) onOrbitDrag();
            };
            const callbackStart = () => {
                orbitCount.current = 0;
            };
            const callbackChange = () => {
                orbitCount.current += 1;
                if (orbitCount.current === 5) onOrbitDrag();
            };
            controls.addEventListener("end", callbackEnd);
            controls.addEventListener("start", callbackStart);
            controls.addEventListener("change", callbackChange);
            return () => {
                controls.removeEventListener("start", callbackStart);
                controls.removeEventListener("end", callbackEnd);
                controls.removeEventListener("change", callbackChange);
            };
        }
        return () => null;
    }, []);

    useEffect(() => {
        const vs: VideoSpheresDataProps[] = [];

        rooms.forEach((room) => {
            const { panels } = room;
            panels.forEach((panel: PanelInterfaceProps) => {
                if (panel.type === PanelTypes.DOOR) {
                    const { video, target } = panel;
                    if (video.assetUrl) {
                        vs.push({
                            visible: false,
                            panelId: panel.id,
                            roomId: room.id,
                            targetId: target.id,
                            videoUrl: video.assetUrl,
                            tempUrl: texture360Video.default,
                        });
                    }
                }
            });
        });
        if (vs.length) setVideoSphereData(vs);
    }, []);

    useFrame(() => {
        if (orbit.current && orbit.current.enabled) {
            // this is here for damping
            orbit.current.update();
        }
    });

    return (
        <>
            <PerspectiveCamera ref={perspectiveOrbit} makeDefault={editMode} />
            {perspectiveOrbit.current && (
                <>
                    <orbitControls
                        args={[perspectiveOrbit.current as any, domElement]}
                        ref={orbit}
                        enabled={orbitEnabled}
                    />
                    <PerspectiveCamera
                        args={[80, 1, 1, 10000]}
                        onClick={camOnClick}
                        ref={perspectiveFirstPerson}
                        rotation={[
                            firstPersonCameraRotation.current.x,
                            firstPersonCameraRotation.current.y,
                            firstPersonCameraRotation.current.z,
                        ]}
                        position={firtPersonCameraPosition.current}
                        makeDefault={!editMode}
                    >
                        <mesh position={[0, 0, -0.5]}>
                            <sphereBufferGeometry args={[0.5, 8]} />
                            <meshStandardMaterial
                                color={"red"}
                                visible={false}
                            />
                        </mesh>
                    </PerspectiveCamera>
                </>
            )}
            {videoSphereData &&
                videoSphereData.length &&
                videoSphereData.map((video, i) => {
                    return (
                        <Video360
                            props={{ visible: video.visible }}
                            // ref={getRef}
                            key={i}
                            roomId={video.roomId}
                            panelId={video.panelId}
                            targetId={video.targetId}
                            videoUrl={video.videoUrl}
                            tempUrl={video.tempUrl}
                            startPlaying={startPlayingVideo && video.visible}
                            onVideoEnded={videoEnded}
                        />
                    );
                })}
        </>
    );
};
