/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";
import React, { useEffect, useRef, useState } from "react";
import { Euler, Group, Vector3 } from "three";
import * as THREE from "three";

import { easeElasticOut, easeSinIn } from "d3-ease";
import * as ifameImage from "../../../assets/images/rooms/school-159617.jpeg";
import * as screenImage from "../../../assets/images/rooms/pexels-3764958.jpeg";
import * as projectorImage from "../../../assets/images/rooms/pexels-821668.jpeg";
import * as billBoardImage from "../../../assets/images/rooms/billboard-101276-12.jpeg";
import * as doorImage from "../../../assets/images/rooms/door.png";
import * as defaultImage from "../../../assets/images/rooms/pexels-128299.jpeg";
import * as defaultVideo from "../../../assets/images/rooms/video/file_example_MP4_640_3MG.mp4";

import { Remote } from "../Remote";
import { Image } from "../Image";
import { Label } from "../Label";
import { VideoPanel } from "../VideoPanel";

import { degToRad, ROOM_FADE_DURATION } from "../../Helpers/Utils";
import { PanelTypes, TargetTypes } from "../../Types/SceneTypes";
import {
    PanelInterfaceProps,
    Video360Props,
    ParentProps,
} from "../../Types/Interfaces";

interface PanelProps {
    props: JSX.IntrinsicElements["mesh"];
    size: THREE.Vector2;
    color: string;
    textureImage: string;
    isVisible: boolean;
    panelData: PanelInterfaceProps;
    panelsPath: string;
    editMode: boolean;
    onClick: (arg0: any) => void;
    changeRoom: (
        arg0: number,
        arg1: boolean,
        arg2: Vector3,
        arg3: Video360Props,
        arg4: number
    ) => void;
    // changeRoomNow: (arg0: number) => void;
    setIframeVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setSrcUrl: React.Dispatch<
        React.SetStateAction<{
            url: string;
            content: string;
        }>
    >;
}

export const Panel = ({
    props,
    size,
    color,
    isVisible,
    editMode,
    panelData,
    panelsPath,
    textureImage,
    changeRoom,
    onClick,
    setIframeVisible,
    setSrcUrl,
}: PanelProps): JSX.Element => {
    let { position, rotation, scale } = props;
    // const position = {
    //     x: parseFloat(String(props!.position.x)),
    // };
    position = position as Vector3;
    position = new Vector3(
        parseFloat(String(position.x)),
        parseFloat(String(position.y)),
        parseFloat(String(position.z))
    );
    rotation = rotation as Euler;
    rotation = new Euler(
        parseFloat(String(rotation.x)),
        parseFloat(String(rotation.y)),
        parseFloat(String(rotation.z))
    );
    scale = scale as Vector3;
    scale = new Vector3(
        parseFloat(String(scale.x)),
        parseFloat(String(scale.y)),
        parseFloat(String(scale.z))
    );
    const { type, target, remote, label, content } = panelData;
    const opacity = parseFloat(String(panelData.opacity));
    const padding = parseFloat(String(panelData.padding));
    const depth = parseFloat(String(panelData.depth));
    const labelEnabled = !label.disable;
    const labelColor = label.color;
    const labelText = label.value;
    const labelFontSize = label.width;

    const DEFAULT_DURATION = 3000;
    // console.log("panel data: ", panelData);

    // const mesh = useRef<THREE.Mesh>(null!);
    const group = useRef<Group>(null!);
    const positionDyn = useRef<Vector3>(position);
    const rotationDyn = useRef(rotation);
    const scaleDyn = useRef<Vector3>(scale);

    const [remotePosition, setRemotePosition] = useState<Vector3>(
        new Vector3(0, 0, 0)
    );
    const [remoteRotation, setRemoteRotation] = useState(new Euler(0, 0, 0));
    const [remoteScale, setRemoteScale] = useState(scale);

    const [active, setActive] = useState<boolean>(false);
    const [remoteActive, setRemoteActive] = useState<boolean>(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
    const [isVisibleNow, setIsVisibleNow] = useState<boolean>(false);
    const [remoteVisible, setRemoteVisible] = useState<boolean>(false);
    const [iframe] = useState(() => {
        const ifram = document.createElement("iframe");
        // document.body.appendChild(iframe);
        return ifram;
    });

    const scaleGropu = useSpring({
        scale: isVisible
            ? [scaleDyn.current.x, scaleDyn.current.y, scaleDyn.current.z]
            : [0, 0, 0],
        delay: isVisible ? ROOM_FADE_DURATION * 2 : 0,
        config: {
            duration: !isVisible ? 300 : 500,
            easing: !isVisible ? easeSinIn : easeElasticOut,
        },
        onResolve: () => {
            if (!isVisible) setIsVisibleNow(isVisible);
            else setRemoteVisible(true);
        },
    });

    const isDoor = type === PanelTypes.DOOR;
    const isScreen = type === PanelTypes.SCREEN;
    const isProjector = type === PanelTypes.PROJECTOR;
    const isBillboard = type === PanelTypes.BILLBOARD;
    const isIframe = type === PanelTypes.IFRAME;

    const defaultVideoUrl =
        panelData.source.assetId !== ""
            ? `${panelsPath}/${panelData.source.assetId}`
            : defaultVideo.default;
    const defaultImageUrl = textureImage; // defaultImage.default;
    // if (isDoor) defaultImageUrl = doorImage.default;
    // else if (isScreen) defaultImageUrl = screenImage.default;
    // else if (isProjector) defaultImageUrl = projectorImage.default;
    // else if (isIframe) defaultImageUrl = ifameImage.default;
    // else if (isBillboard) defaultImageUrl = billBoardImage.default;

    // console.log("panel: ", panelData, position, rotation, scale);

    const parent: ParentProps = {
        width: parseFloat(String(size.x)),
        height: parseFloat(String(size.y)),
        depth,
    };

    const videoClicked = (b: boolean) => {
        setIsVideoPlaying(b);
    };

    const iframeClicked = () => {
        iframe.src = target ? target.url : "";
        setIframeVisible(true);
        setSrcUrl({ url: target.url, content: "" });
    };

    const billboardClicked = () => {
        if (content) {
            const decoded = window.atob(content);
            setIframeVisible(true);

            setSrcUrl({ url: "", content: decoded });
        }
    };

    const panelCliked = () => {
        const { isTransitionEnabled, video } = panelData;
        const positionPanel = group.current.position.clone();
        // console.log("current panel: ", group.current.position, panelData);
        switch (target.type) {
            case TargetTypes.ROOM:
                // console.log("change door to: ", target.id);
                changeRoom(
                    target.id,
                    isTransitionEnabled,
                    positionPanel,
                    video,
                    DEFAULT_DURATION
                );
                break;
            case TargetTypes.PROJECTOR:
                videoClicked(!isVideoPlaying);
                break;
            case TargetTypes.IFRAME:
                iframeClicked();
                break;
            case TargetTypes.BILLBOARD:
                billboardClicked();
                break;
            default:
        }
    };

    const onRemoteClick = (e: ThreeEvent<MouseEvent>) => {
        if (isVisible) {
            e.stopPropagation();
            if (editMode) {
                onClick(e.object);
            } else {
                panelCliked();
            }
        }
    };

    const groupClicked = (e: ThreeEvent<MouseEvent>) => {
        if (isVisible) {
            e.stopPropagation();
            if (editMode) {
                // console.log("event triggered by: ", e.object);
                if (!active) {
                    setActive(true);
                    onClick(group.current);
                }
            } else {
                panelCliked();
            }
        } else {
            // not visible it's probably from a different room
        }
    };

    useEffect(() => {
        if (isVisible) setIsVisibleNow(true);
        else setRemoteVisible(false);
    }, [isVisible]);

    useEffect(() => {
        if (group.current) {
            // const pos = group.current.localToWorld(new Vector3(0, 0, 0));
            setRemotePosition(
                new Vector3(positionDyn.current.x, 0, positionDyn.current.z)
            );
            // setRemoteRotation(
            //     new Euler(
            //         degToRad(parseFloat(String(panelData.remote.rotation.x))),
            //         degToRad(parseFloat(String(panelData.remote.rotation.y))),
            //         degToRad(parseFloat(String(panelData.remote.rotation.z)))
            //     )
            // );
            // setRemoteScale(
            //     new Vector3(
            //         parseFloat(String(panelData.remote.scale.x)),
            //         parseFloat(String(panelData.remote.scale.y)),
            //         parseFloat(String(panelData.remote.scale.z)),
            //     )
            // );
            // console.log(
            //     "setting values to: ",
            //     panelData.remote.scale,
            //     panelData.remote.rotation
            // );
        }
        // if (isVisible) setIsVisibleNow(true);
    }, [group, isVisible]);

    useEffect(() => {
        if (group.current) group.current.userData = { panel: panelData };
        // console.log("group.current: ", group.current);
    }, [group.current]);

    useEffect(() => {
        setRemoteScale(
            new Vector3(
                parseFloat(String(panelData.remote.scale.x)),
                parseFloat(String(panelData.remote.scale.y)),
                parseFloat(String(panelData.remote.scale.z))
            )
        );
    }, [panelData.remote.scale]);

    useEffect(() => {
        setRemoteRotation(
            new Euler(
                degToRad(parseFloat(String(panelData.remote.rotation.x))),
                degToRad(parseFloat(String(panelData.remote.rotation.y))),
                degToRad(parseFloat(String(panelData.remote.rotation.z)))
            )
        );
    }, [panelData.remote.rotation]);

    useFrame(() => {
        if (remotePosition && group.current && group.current.position) {
            // if group position is different than remote position, and remote is not active, set remote position
            if (
                (remotePosition.x !== group.current.position.x ||
                    remotePosition.z !== group.current.position.z) &&
                !remoteActive
            ) {
                setRemotePosition(
                    new Vector3(
                        group.current.position.x,
                        0,
                        group.current.position.z
                    )
                );
            }
        }
    });

    return (
        <>
            {isVisibleNow && (
                <>
                    <a.group
                        position={positionDyn.current}
                        rotation={rotationDyn.current}
                        scale={(scaleGropu.scale as unknown) as Vector3} // {scaleDyn.current}
                        ref={group}
                        onClick={groupClicked}
                        onPointerMissed={() => {
                            if (isVisible && editMode) setActive(false);
                        }}
                    >
                        {/* LABEL HERE */}
                        {labelEnabled && (
                            <Label
                                props={{
                                    position: label.position
                                        ? new Vector3(
                                              Number(String(label.position.x)),
                                              Number(String(label.position.y)),
                                              Number(String(label.position.z))
                                          )
                                        : new Vector3(0, 1, 1),
                                    rotation: new Euler(
                                        Number(String(label.rotation.x)),
                                        Number(String(label.rotation.y)),
                                        Number(String(label.rotation.z))
                                    ),
                                    scale: new Vector3(
                                        Number(String(label.scale.x)),
                                        Number(String(label.scale.y)),
                                        Number(String(label.scale.z))
                                    ),
                                }}
                                fontSize={labelFontSize}
                                color={labelColor}
                                text={labelText}
                                parent={parent}
                            />
                        )}
                        {/* SCREEN IMAGE */}
                        {!isVideoPlaying && (
                            <Image
                                props={{ position: [0, 0, 0.02] }}
                                textureUrl={defaultImageUrl}
                                padding={padding}
                                parent={parent}
                            />
                        )}
                        {/* SCREEN VIDEO */}
                        {isProjector && (
                            <VideoPanel
                                padding={padding}
                                parent={parent}
                                defaultVideoUrl={defaultVideoUrl}
                                editMode={editMode}
                                isVideoPlaying={isVideoPlaying}
                            />
                        )}
                        {/* SCREEN BACKGROUND */}
                        <mesh>
                            <boxBufferGeometry args={[size.x, size.y, depth]} />
                            <meshBasicMaterial
                                color={color}
                                toneMapped={false}
                                transparent={true}
                                opacity={opacity}
                            />
                        </mesh>
                    </a.group>
                    {/* REMOTE ITEM */}
                    <Remote
                        props={{
                            position: remotePosition,
                            rotation: remoteRotation,
                            scale: isVisible ? remoteScale : [0, 0, 0],
                        }}
                        visible={remoteVisible}
                        disable={remote.disable}
                        animationDisable={remote.animationDisable}
                        animationType={remote.animationType}
                        image={remote.assetId}
                        onRemoteClick={onRemoteClick}
                        target={target}
                        onRemoteMissed={() => setRemoteActive(false)}
                    />
                </>
            )}
        </>
    );
};