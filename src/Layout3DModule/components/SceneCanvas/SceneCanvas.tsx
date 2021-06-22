/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
import * as THREE from "three";
// import Iframe from "react-iframe";

import { Euler, Vector3 } from "three";
import { CameraControls } from "../Controls/CameraControls";
import { Transform } from "../Controls/Transform";
// import { Model } from "../Elements/Model";
import { RoomBuilder } from "../Builders/RoomBuilder";
import {
    PanelInterfaceProps,
    RoomProps,
    Video360Props,
} from "../Types/Interfaces";

import { simulatedParams } from "../Helpers/Simdata";

interface SceneProps {
    editMode: boolean;
    roomsData: any[];
    currentMainRoom: number;
    paths: { ROOM_ASSETS_PATH: string; PANEL_ASSETS_PATH: string };
    onItemSelected: (item: any) => void;
}

interface ToFromProps {
    fromPosition: Vector3;
    toPosition: Vector3;
    toRotation: Euler;
    video: Video360Props;
    duration: number;
}

export const SceneCanvas = ({
    editMode,
    onItemSelected,
    roomsData,
    currentMainRoom,
    paths,
}: SceneProps): JSX.Element => {
    const iframeWindow = useRef(null!);
    const [controlsActive, setControlsActive] = useState(true);
    const [selectedMesh, setSelectedMesh] = useState<THREE.Object3D>(null!);
    const [hasOrbited, setHasOrbited] = useState<boolean>(false);
    const [transformType, setTransformType] = useState<string>("translate");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [iframeVisible, setIframeVisible] = useState<boolean>(false);
    const [urlContent, setUrlContent] = useState({ url: "", content: "" });
    const [isTransitionEnabled, setIsTransitionEnabled] = useState<boolean>(
        false
    );
    const [initialCameraRotation, setInitialCameraRotation] = useState<Euler>(
        new Euler(
            roomsData[currentMainRoom].camera.rotation.x,
            roomsData[currentMainRoom].camera.rotation.y,
            roomsData[currentMainRoom].camera.rotation.z
        )
    );
    const [targetPosition, setTargetPosition] = useState<ToFromProps>(null!);
    const contentRef = useRef<any>(null);

    const [currentRoom, setCurrentRoom] = useState<number>(-1);
    const [currentRoomActive, setCurrentRoomActive] = useState<number>(null!);

    const selected = useRef<THREE.Object3D>(null!);

    // const { rooms } = simulatedParams;
    const rooms = roomsData;
    rooms.map((room) => {
        return (room as unknown) as PanelInterfaceProps;
    });
    // const rooms = simulatedParams.rooms as PanelProps[];
    const gridSize = 100;
    const gridDivisions = 100;

    const setOrbitControls = (b: boolean) => {
        setControlsActive(b);
    };

    const onClickObject = (object: THREE.Object3D) => {
        selected.current = object;
        console.log("set selected: ", selected.current, selectedMesh);

        if (object.type === "PerspectiveCamera") {
            setTransformType("rotate");
        } else {
            setTransformType("translate");
        }
        setSelectedMesh(object);
        onItemSelected(object);
    };

    const onClickScene = () => {
        // e: ThreeEvent<MouseEvent>
        if (hasOrbited) setHasOrbited(false);
        else {
            setSelectedMesh(null!);
            onItemSelected(null!);
        }
    };

    const onOrbitDrag = () => {
        setHasOrbited(true);
    };

    const closeIframe = () => {
        // (iframeWindow.current as any).style.display = "none";
        setIframeVisible(false);
    };

    const changeRoomNow = (n: number) => {
        setCurrentRoomActive(n);
    };

    const setCameraRotation = (r: Euler) => {
        // console.log("setting initial cam rotation: ", r);
        setInitialCameraRotation(r);
    };

    const onChangeRoom = (
        duration: number,
        isTransEn: boolean,
        tgtPos: Vector3,
        toPos: Vector3,
        roomNumber: number,
        initialCamRotation: Euler,
        video: Video360Props
    ) => {
        setCurrentRoom(roomNumber);
        setIsTransitionEnabled(isTransEn);
        console.log("from pos: ", tgtPos, " to pos: ", toPos);
        setTargetPosition({
            duration,
            fromPosition: tgtPos,
            toPosition: toPos,
            toRotation: initialCamRotation,
            video,
        });
    };

    useEffect(() => {
        const mountNode = contentRef.current?.contentDocument;

        if (urlContent.content !== "") {
            mountNode.body.innerHTML = urlContent.content;
            // mountNode.document.open("text/html", "replace");
            // mountNode.document.write(urlContent.content);
            // mountNode.document.close();
        }
    }, [urlContent]);

    return (
        <>
            <Canvas>
                <color attach="background" args={["black"]} />
                <Suspense fallback={null}>
                    <ambientLight args={["#ffffff"]} />
                    <pointLight position={[10, 10, 10]} />
                    {/* <Model /> */}
                    <RoomBuilder
                        rooms={rooms}
                        editMode={editMode}
                        paths={paths}
                        changeActiveRoom={currentRoomActive}
                        onClickObject={onClickObject}
                        onClickScene={onClickScene}
                        onChangeRoom={onChangeRoom}
                        setIframeVisible={setIframeVisible}
                        setSrcUrl={setUrlContent}
                        setInitialCameraRotation={setCameraRotation}
                    />

                    {editMode && (
                        <gridHelper args={[gridSize, gridDivisions]} />
                    )}
                    <CameraControls
                        controlsEnabled={controlsActive}
                        editMode={editMode}
                        isTransitionEnabled={isTransitionEnabled}
                        targetData={targetPosition}
                        rooms={(rooms as unknown) as RoomProps[]}
                        //    fromRoom={}
                        currentRoom={currentRoom}
                        // nextRoom={}
                        initialCameraRotation={initialCameraRotation}
                        initialCameraPosition={
                            roomsData[currentMainRoom].camera.position
                        }
                        onOrbitDrag={onOrbitDrag}
                        onClickObject={onClickObject}
                        changeRoomNow={changeRoomNow}
                    />
                    {editMode && selectedMesh && (
                        <Transform
                            // ref={transform}
                            selected={selectedMesh}
                            transformType={transformType}
                            setOrbitControls={setOrbitControls}
                        />
                    )}
                </Suspense>
            </Canvas>
            {iframeVisible && (
                <div className="iframeHolder" ref={iframeWindow}>
                    <button onClick={closeIframe}>
                        <i className="fal fa-chevron-left"></i>
                    </button>
                    <iframe
                        src={urlContent.url}
                        // url={urlContent.url}
                        width="100%"
                        height="100%"
                        id="iframeContent"
                        ref={contentRef}
                    >
                        {/* {urlContent.content !== "" &&
                            mountNode &&
                            createPortal(urlContent.content, mountNode)} */}
                    </iframe>
                </div>
            )}
        </>
    );
};
