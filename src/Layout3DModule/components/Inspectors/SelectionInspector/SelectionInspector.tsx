import React, { FC, Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
    AppButton,
    AppCard,
    AppFormInput,
} from "../../../../AppModule/components";
import { PanelInterfaceProps, RoomProps } from "../../Types/Interfaces";

export interface SelectionInspectorProps {
    rooms: RoomProps[];
    currentRoom: number;
    selectedPanel: PanelInterfaceProps;
    name: string;
    type: string;
    // setPanel: (panel: PanelInterfaceProps) => void;
}

export const SelectionInspector: FC<SelectionInspectorProps> = ({
    rooms,
    currentRoom,
    selectedPanel,
    // name,
    // type,
}): JSX.Element => {
    const [roomDetails, setRoomDetails] = useState<RoomProps>(
        rooms[currentRoom]
    );
    const [roomName, setRoomName] = useState<string>(rooms[currentRoom].name);
    const [
        currentSelectedPanel,
        setCurrentSelectedPanel,
    ] = useState<PanelInterfaceProps>(null!);

    const { control } = useForm({
        // resolver: yupResolver(schema),
        // mode: "all",
    });

    const onSwitchRoom = (i: number) => {
        setRoomDetails(rooms[i]);
        setRoomName(rooms[i].name);
    };

    useEffect(() => {
        // if (selectedPanel && selectedPanel.)
        setCurrentSelectedPanel(selectedPanel);
    }, [selectedPanel]);

    return (
        <Fragment>
            <div style={{ zIndex: 1000, position: "relative" }}>
                <AppCard>
                    <>Rooms:</>
                    <Row>
                        {rooms.map((room, i) => {
                            return (
                                <Col key={i}>
                                    <AppButton
                                        style={{ maxWidth: 250 }}
                                        variant={"secondary"}
                                        className="justify-content-center p-1"
                                        block
                                        onClick={() => {
                                            onSwitchRoom(i);
                                        }}
                                        // control={null}
                                    >
                                        {room.name}
                                    </AppButton>
                                </Col>
                            );
                        })}
                    </Row>
                    <Row>
                        <AppCard>
                            <Row>
                                <Col>
                                    <Row>
                                        {roomName && (
                                            <AppFormInput
                                                lg={12}
                                                xl={12}
                                                md={12}
                                                name={"roomName"}
                                                label={"Room Name"}
                                                defaultValue={roomName}
                                                required={true}
                                                // {...validation(
                                                //     "firstName",
                                                //     formState,
                                                //     isEditMode
                                                // )}
                                                // errorMessage={errors.firstName?.message}
                                                control={control}
                                            />
                                        )}
                                    </Row>
                                </Col>
                                <Col md={6}>
                                    <p>Camera rotation:</p>
                                    <Row>
                                        <Col>
                                            <AppFormInput
                                                md={12}
                                                lg={12}
                                                xl={12}
                                                name={"X"}
                                                label={"X"}
                                                defaultValue={String(
                                                    roomDetails.camera.rotation
                                                        .x
                                                )}
                                                required={true}
                                                // {...validation(
                                                //     "firstName",
                                                //     formState,
                                                //     isEditMode
                                                // )}
                                                // errorMessage={errors.firstName?.message}
                                                control={control}
                                            />
                                        </Col>
                                        <Col>
                                            <AppFormInput
                                                md={12}
                                                lg={12}
                                                xl={12}
                                                name={"Y"}
                                                label={"Y"}
                                                defaultValue={String(
                                                    roomDetails.camera.rotation
                                                        .y
                                                )}
                                                required={true}
                                                // {...validation(
                                                //     "firstName",
                                                //     formState,
                                                //     isEditMode
                                                // )}
                                                // errorMessage={errors.firstName?.message}
                                                control={control}
                                            />
                                        </Col>
                                        <Col>
                                            <AppFormInput
                                                md={12}
                                                lg={12}
                                                xl={12}
                                                name={"Z"}
                                                label={"Z"}
                                                defaultValue={String(
                                                    roomDetails.camera.rotation
                                                        .z
                                                )}
                                                required={true}
                                                // {...validation(
                                                //     "firstName",
                                                //     formState,
                                                //     isEditMode
                                                // )}
                                                // errorMessage={errors.firstName?.message}
                                                control={control}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </AppCard>
                    </Row>
                    <>Panels:</>
                    <Row>
                        {roomDetails.panels.map((panel, i) => {
                            return (
                                <Col key={i}>
                                    <AppButton
                                        style={{ maxWidth: 250 }}
                                        variant={"secondary"}
                                        className="justify-content-center p-1"
                                        block
                                        // onClick={onCreateNew}
                                    >
                                        {panel.panelName}
                                    </AppButton>
                                </Col>
                            );
                        })}
                    </Row>
                    {currentSelectedPanel && (
                        <AppCard>
                            <Row>
                                <AppFormInput
                                    lg={12}
                                    xl={12}
                                    md={12}
                                    name={"panelName"}
                                    label={"Panel Name"}
                                    defaultValue={
                                        currentSelectedPanel.panelName
                                    }
                                    required={true}
                                    control={control}
                                />
                            </Row>
                        </AppCard>
                    )}
                </AppCard>
            </div>
        </Fragment>
    );
};
