import React, { useEffect, useState } from "react";
// import { useThree } from "@react-three/fiber";
import { Euler, Object3D, Vector3 } from "three";
import { Room } from "../../Elements/Room";

import { degToRad } from "../../Helpers/Utils";
import { TargetTypes } from "../../Types/SceneTypes";
import * as textureRoom from "../../../assets/images/rooms/10300.jpeg";
import { Video360Props } from "../../Types/Interfaces";

interface RoomBuilderParams {
    rooms: any[];
    editMode: boolean;
    changeActiveRoom: number;
    setIframeVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setSrcUrl: React.Dispatch<
        React.SetStateAction<{
            url: string;
            content: string;
        }>
    >;
    onClickScene: () => void;
    onClickObject: (arg0: Object3D) => void;
    paths: { ROOM_ASSETS_PATH: string; PANEL_ASSETS_PATH: string };
    onChangeRoom: (
        duration: number,
        arg0: boolean,
        arg1: Vector3,
        arg2: Vector3,
        arg3: number,
        arg4: Euler,
        arg5: Video360Props
    ) => void;
    setInitialCameraRotation: (arg0: Euler) => void;
    onPageChange: (pageUrl: string) => void;
}

export const RoomBuilder = ({
    rooms,
    editMode,
    paths,
    changeActiveRoom,
    onClickScene,
    onClickObject,
    setIframeVisible,
    setSrcUrl,
    onChangeRoom,
    onPageChange,
    setInitialCameraRotation,
}: RoomBuilderParams): JSX.Element => {
    const [currentRoomId, setCurrentRoomId] = useState<number>(rooms[0].id);

    const findPanelPosition = (
        currentRoom: number,
        fromRoom: number
    ): Vector3 => {
        const room = rooms.filter((r) => r.id === currentRoom);
        // console.log("current, from: ", currentRoom, fromRoom);

        const pan = room[0].panels.filter(
            (pa: { target: { type: string; id: number } }) => {
                return (
                    pa.target.type === TargetTypes.ROOM &&
                    pa.target.id === fromRoom
                );
            }
        );
        // console.log("to panel: ", pan);

        return new Vector3(
            // pan[0].position.x,
            // pan[0].position.y,
            // pan[0].position.z
            parseFloat(pan[pan.length - 1].position.x),
            parseFloat(pan[pan.length - 1].position.y),
            parseFloat(pan[pan.length - 1].position.z)
        );
    };

    const changeRoom = (
        newRoom: number,
        isTransitionEnabled: boolean,
        fromPanelPosition: Vector3,
        video: Video360Props,
        duration: number
    ) => {
        const toPanelPosition = findPanelPosition(newRoom, currentRoomId);
        const camRotation = rooms.filter((r) => {
            return r.id === newRoom;
        })[0].camera.rotation;
        const initialEuler = new Euler(
            degToRad(camRotation.x),
            degToRad(camRotation.y),
            degToRad(camRotation.z)
        );
        if (isTransitionEnabled) setInitialCameraRotation(initialEuler);

        // videoS;
        onChangeRoom(
            duration,
            isTransitionEnabled,
            fromPanelPosition,
            toPanelPosition,
            newRoom,
            initialEuler,
            video
        );
        // currentRoom.current = newRoom;
    };

    const changeRoomNow = (newRoom: number) => {
        setCurrentRoomId(newRoom);
    };

    useEffect(() => {
        // console.log("changing room? ", changeActiveRoom);
        if (changeActiveRoom && changeActiveRoom >= 0) {
            // console.log("asking for room change: ", changeActiveRoom);
            changeRoomNow(changeActiveRoom);
        } else if (changeActiveRoom && changeActiveRoom === -2) {
            changeRoomNow(-1);
        }
    }, [changeActiveRoom]);

    return (
        <>
            {rooms.map((room, i) => {
                return (
                    <Room
                        id={room.id}
                        props={{ position: [0, 0, 0] }}
                        active={room.id === currentRoomId}
                        key={i}
                        skyImage={textureRoom}
                        skyUrl={
                            room.sky.assetId
                                ? `${paths.ROOM_ASSETS_PATH}/${room.sky.assetId}`
                                : ""
                        }
                        onClickScene={onClickScene}
                        onClickPanel={onClickObject}
                        panels={room.panels}
                        panelsPath={paths.PANEL_ASSETS_PATH}
                        changeRoom={changeRoom}
                        // changeRoomNow={changeRoomNow}
                        editMode={editMode}
                        setIframeVisible={setIframeVisible}
                        setSrcUrl={setSrcUrl}
                        onPageChange={onPageChange}
                    />
                );
            })}
        </>
    );
};
