import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { AFrameRoomApi } from "../../apis";

export class AFrameRoom extends BaseEntity {
    name: string;

    image?: string;

    camPosX: string;

    camPosY: string;

    camPosZ: string;

    camRotX: string;

    camRotY: string;

    camRotZ: string;

    isEntryRoom?: boolean;

    container?: string;

    isRotateEnable?: boolean;

    constructor({
        name = "",
        image,
        camPosX = "",
        camPosY = "",
        camPosZ = "",
        camRotX = "",
        camRotY = "",
        camRotZ = "",
        isEntryRoom,
        container = "",
        isRotateEnable,
        id,
        createdAt,
        updatedAt,
    }: Partial<AFrameRoom> = {}) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.image = image;
        this.camPosX = camPosX;
        this.camPosY = camPosY;
        this.camPosZ = camPosZ;
        this.camRotX = camRotX;
        this.camRotY = camRotY;
        this.camRotZ = camRotZ;
        this.isEntryRoom = isEntryRoom;
        this.container = container;
        this.isRotateEnable = isRotateEnable;
    }

    toString(): string {
        return AFrameRoomApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            image: this.image,
            camPosX: this.camPosX,
            camPosY: this.camPosY,
            camPosZ: this.camPosZ,
            camRotX: this.camRotX,
            camRotY: this.camRotY,
            camRotZ: this.camRotZ,
            isEntryRoom: this.isEntryRoom,
            container: this.container,
            isRotateEnable: this.isRotateEnable,
        };
    }
}

export type PAFrameRoom = Partial<AFrameRoom>;
