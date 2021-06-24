/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import "./assets/scss/layout3d/style.scss";
import { Object3D } from "three";
import { SceneCanvas } from "./components/SceneCanvas";
import { Layout3DApi } from "../AdminModule/apis";
import { AuthState } from "../SecurityModule/models/context/AuthState";
import { AuthContext } from "../SecurityModule/contexts";
import { SelectionInspector } from "./components/Inspectors/SelectionInspector";
import { useBuildAssetPath } from "../AppModule/hooks";
import { CONSTANTS } from "../config";
import { mainMessageTabs } from "../AppModule/containers/AppMessageBox/tabs-configurator";
import { PanelInterfaceProps } from "./components/Types/Interfaces";
import { FileTypeInfo } from "../AppModule/models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    //   FILETYPE: { FILETYPE_CONTAINER_POSTER },
    FILETYPEINFO: {
        FILETYPEINFO_AFRAMEROOM_MEDIA,
        FILETYPEINFO_AFRAMEPANEL_MEDIA,
    },
} = UPLOAD;

export const Layout3D: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { containerId, clientId } = state as AuthState;

    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Object3D>(null!);
    const [roomsData, setRoomsData] = useState(null!);
    const [mainRoom, setMainRoom] = useState<number>(null!);
    const [selectedLocale] = useState<string>("");

    const [selectedPanel, setSelectedPanel] = useState<PanelInterfaceProps>(
        null!
    );

    const pathRoom = FILETYPEINFO_AFRAMEROOM_MEDIA.path;
    const pathPanel = FILETYPEINFO_AFRAMEPANEL_MEDIA.path;

    const imgPath = useBuildAssetPath(
        FILETYPEINFO_AFRAMEROOM_MEDIA as FileTypeInfo
    );
    const panelPath = useBuildAssetPath(
        FILETYPEINFO_AFRAMEPANEL_MEDIA as FileTypeInfo
    );

    const [ROOM_ASSETS_PATH] = useState<string>(imgPath);
    const [PANEL_ASSETS_PATH] = useState<string>(panelPath);

    const onKeyPressed = (e: KeyboardEvent) => {
        if (e.keyCode === 101) {
            setEditMode(!editMode);
        }
    };

    const onItemSelected = (item: Object3D) => {
        if (item && item.userData && item.userData.panel) {
            setSelectedPanel(item.userData.panel);
        }
        // console.log("selecting item: ", item);
        setSelectedItem(item);
    };

    useEffect(() => {
        // console.log(
        //     "make request with: clientId: ",
        //     clientId,
        //     "\n containerId: ",
        //     containerId,
        //     selectedLocale
        // );
        Layout3DApi.exportLayout3DData(
            containerId as number,
            selectedLocale
        ).then((response) => {
            console.log("response: ", response);
            // response.forEach(room:any => {
            //     if (room.isE)
            // });
            setMainRoom(0);
            setRoomsData(response);
        });
        // fetch("https://esrapidev1.expertshare.me/api/aframe/a3d?page=1").then(
        //     (response) => {
        //         console.log("response: ", response, rooms);
        //         setRooms(response as any);
        //     }
        // );
    }, []);

    useEffect(() => {
        window.addEventListener("keypress", onKeyPressed);

        return () => {
            window.removeEventListener("keypress", onKeyPressed);
        };
    });

    return (
        <>
            <div className={"canvas-3d"}>
                {roomsData && (
                    <SceneCanvas
                        editMode={editMode}
                        roomsData={roomsData}
                        onItemSelected={onItemSelected}
                        currentMainRoom={mainRoom}
                        paths={{
                            ROOM_ASSETS_PATH,
                            PANEL_ASSETS_PATH,
                        }}
                    />
                )}
            </div>
            {/* {selectedItem && (
                <SelectionInspector
                    name={"name"}
                    type={"type"}
                    selectedPanel={selectedPanel}
                    rooms={roomsData}
                    currentRoom={mainRoom}
                />
            )} */}
        </>
    );
};
