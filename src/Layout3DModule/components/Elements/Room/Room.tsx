import { ReactThreeFiber } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D, Vector3 } from "three";
import { PanelBuilder } from "../../Builders/PanelBuilder";
import { PanelInterfaceProps, Video360Props } from "../../Types/Interfaces";
import { Sky } from "../Sky";

interface RoomProps
    extends ReactThreeFiber.Object3DNode<Object3D, typeof Object3D> {
    props?: JSX.IntrinsicElements["group"];
    id: number;
    active: boolean;
    roomData?: JSON;
    skyUrl?: string;
    skyImage: any;
    initialCamera?: any;
    panels: PanelInterfaceProps[];
    panelsPath: string;
    editMode: boolean;
    onClickScene: () => void;
    onClickPanel: (arg0: THREE.Object3D) => void;
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
    onPageChange: (pageUrl: string) => void;
}

export const Room = ({
    props,
    id,
    active = false,
    skyImage,
    skyUrl = "",
    onClickScene,
    onClickPanel,
    editMode,
    panels,
    panelsPath,
    changeRoom,
    setIframeVisible,
    setSrcUrl,
    onPageChange,
}: RoomProps): JSX.Element => {
    const group = useRef<JSX.IntrinsicElements["group"]>(null!);
    const [currentActive, setCurrentActive] = useState<boolean>(active);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const roomImagePath = skyUrl !== "" ? skyUrl : skyImage.default;

    useEffect(() => {
        // console.log("group: ", group.current, "active: ", active);
        if (group.current && active) {
            group.current.visible = active;
        }
    }, [group, active]);

    useEffect(() => {
        if (group.current) {
            group.current.visible = currentActive;
        }
    }, [currentActive]);

    // const changeRoomClick = () => {};

    return (
        <>
            <group {...props} ref={group} key={id}>
                <Suspense fallback={null}>
                    <PanelBuilder
                        panels={panels}
                        panelsPath={panelsPath}
                        active={active}
                        editMode={editMode}
                        onClickPanel={onClickPanel}
                        changeRoom={changeRoom}
                        // changeRoomNow={changeRoomNow}
                        setIframeVisible={setIframeVisible}
                        setSrcUrl={setSrcUrl}
                        onPageChange={onPageChange}
                    />
                    <Sky
                        textureImage={roomImagePath}
                        active={active}
                        textureUrl={skyUrl}
                        setGroupActive={setCurrentActive}
                        onClick={editMode ? onClickScene : () => {}}
                    />
                </Suspense>
            </group>
        </>
    );
};
