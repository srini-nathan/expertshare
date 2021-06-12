import React, { FC } from "react";
import { Link } from "@reach/router";
import { Col } from "react-bootstrap";
import { PAFrameRoom } from "../../../AdminModule/models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import "./assets/scss/style.scss";
import placeholder from "./assets/images/imgthumb.svg";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_AFRAMEROOM_MEDIA },
} = UPLOAD;

export interface AppAFrameRoomCardProps {
    aframeroom: PAFrameRoom;
    isGrantedControl?: boolean;
    handleDelete: (id: number) => void;
}

export const AppAFrameRoomCard: FC<AppAFrameRoomCardProps> = ({
    aframeroom,
    handleDelete,
    isGrantedControl,
}): JSX.Element => {
    const {
        id,
        name,
        image,
        camPosX,
        camPosY,
        camPosZ,
        camRotX,
        camRotY,
        camRotZ,
        isEntryRoom = true,
    } = aframeroom;
    const imagePath = useBuildAssetPath(
        FILETYPEINFO_AFRAMEROOM_MEDIA as FileTypeInfo,
        image
    );
    const style = image
        ? {
              backgroundImage: `url(${imagePath})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };

    return (
        <Col md={12} lg={4} xl={4} className="events-grid--container--item">
            <Col className="inner-container p-0">
                <Col className="inner-container--banner p-0" style={style}>
                    <div className="inner-container--banner--icons ">
                        {isGrantedControl && (
                            <>
                                <Link to={`/aframeroom/${id}`}>
                                    <i className="fak fa-pen-regular"></i>
                                </Link>
                                <span
                                    onClick={() => handleDelete(id as number)}
                                >
                                    <i className="fak fa-trash-light"></i>
                                </span>
                            </>
                        )}
                    </div>
                </Col>

                <Col className="inner-container--det p-3 mx-2">
                    <Col className="inner-container--det--name p-0">
                        <Link to={`/aframeroom/${id}`}>
                            <h2>{`Name: ${name}`}</h2>
                        </Link>
                    </Col>
                    <br />
                    <Col className="description p-0">{`Cameral Position X: ${camPosX}`}</Col>
                    <Col className="description p-0">{`Cameral Position Y: ${camPosY}`}</Col>
                    <Col className="description p-0">{`Cameral Position Z: ${camPosZ}`}</Col>
                    <Col className="description p-0">{`Cameral Rotation X: ${camRotX}`}</Col>
                    <Col className="description p-0">{`Cameral Rotation Y: ${camRotY}`}</Col>
                    <Col className="description p-0">{`Cameral Rotation Z: ${camRotZ}`}</Col>
                    <Col className="description p-0">{`Is Entry Room? ${
                        isEntryRoom ? "Yes" : "No"
                    }`}</Col>
                </Col>
            </Col>
        </Col>
    );
};
