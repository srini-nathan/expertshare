import React from "react";
import { Euler, Vector2, Vector3 } from "three";

import * as textureDoor from "../../../assets/images/rooms/door.png";
import { Panel } from "../../Elements/Panel";
import { degToRad } from "../../Helpers/Utils";
import { Video360Props } from "../../Types/Interfaces";

interface PanelBuilderParams {
    // props: JSX.IntrinsicElements["mesh"];
    panels: any[];
    panelsPath: string;
    active: boolean;
    editMode: boolean;
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

export const PanelBuilder = ({
    // props,
    panels,
    panelsPath,
    active,
    editMode,
    onClickPanel,
    changeRoom,
    // changeRoomNow,
    setIframeVisible,
    setSrcUrl,
    onPageChange,
}: PanelBuilderParams): JSX.Element => {
    return (
        <>
            {panels.map((panel, i) => {
                const image = panels[i].image.assetId
                    ? `${panelsPath}/${panels[i].image.assetId}`
                    : textureDoor.default;
                return (
                    <Panel
                        key={i}
                        panelData={panel}
                        panelsPath={panelsPath}
                        size={new Vector2(panel.width, panel.height)}
                        props={{
                            position: new Vector3(
                                parseFloat(panel.position.x),
                                parseFloat(panel.position.y),
                                parseFloat(panel.position.z)
                            ),
                            rotation: new Euler(
                                degToRad(parseFloat(panel.rotation.x)),
                                degToRad(parseFloat(panel.rotation.y)),
                                degToRad(parseFloat(panel.rotation.z))
                            ),
                            scale: new Vector3(
                                parseFloat(panel.scale.x),
                                parseFloat(panel.scale.y),
                                parseFloat(panel.scale.z)
                            ),
                        }}
                        color={panel.color}
                        isVisible={active}
                        editMode={editMode}
                        textureImage={
                            panel.image !== "" ? image : textureDoor.default
                        }
                        onClick={onClickPanel}
                        changeRoom={changeRoom}
                        // changeRoomNow={changeRoomNow}
                        setIframeVisible={setIframeVisible}
                        setSrcUrl={setSrcUrl}
                        onPageChange={onPageChange}
                    />
                );
            })}
        </>
    );
};
