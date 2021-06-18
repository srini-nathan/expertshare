import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { AFramePanelApi } from "../../apis";
import { CONSTANTS } from "../../../config";

export class AFramePanel extends BaseEntity {
    image?: string;

    height: string;

    width: string;

    depth: string;

    padding: string;

    color: string;

    opacity: string;

    pX: string;

    pY: string;

    pZ: string;

    rX: string;

    rY: string;

    rZ: string;

    sX: string;

    sY: string;

    sZ: string;

    isRemoteDisabled?: boolean;

    remoteImage?: string;

    remotePosX?: string;

    remotePosY?: string;

    remotePosZ?: string;

    remoteScaX?: string;

    remoteScaY?: string;

    remoteScaZ?: string;

    remoteRotX?: string;

    remoteRotY?: string;

    remoteRotZ?: string;

    isRemoteAnimationDisabled?: boolean;

    remoteAnimationType?: string;

    remoteAnimationSpeed?: number;

    isTextDisabled?: boolean;

    textValue?: string;

    textColor?: string;

    textWidth?: string;

    textPosX?: string;

    textPosY?: string;

    textPosZ?: string;

    textScaX?: string;

    textScaY?: string;

    textScaZ?: string;

    textRotX?: string;

    textRotY?: string;

    textRotZ?: string;

    targetType?: string;

    targetAction?: string;

    targetId?: number;

    type: string;

    targetUrl?: string;

    source?: string;

    transitionVideo?: string;

    content?: string;

    isTransitionEnabled?: boolean;

    container?: string;

    aFrameRoom?: string;

    constructor({
        image,
        height = "",
        width = "",
        depth = "",
        padding = "",
        color = "",
        opacity = "",
        pX = "",
        pY = "",
        pZ = "",
        rX = "",
        rY = "",
        rZ = "",
        sX = "",
        sY = "",
        sZ = "",
        isRemoteDisabled,
        remoteImage,
        remotePosX,
        remotePosY,
        remotePosZ,
        remoteScaX,
        remoteScaY,
        remoteScaZ,
        remoteRotX,
        remoteRotY,
        remoteRotZ,
        isRemoteAnimationDisabled,
        remoteAnimationType,
        remoteAnimationSpeed,
        isTextDisabled,
        textValue,
        textColor,
        textWidth,
        textPosX,
        textPosY,
        textPosZ,
        textScaX,
        textScaY,
        textScaZ,
        textRotX,
        textRotY,
        textRotZ,
        targetType,
        targetAction,
        targetId,
        type = CONSTANTS.AFramePanel.TYPE.TYPE_DOOR,
        targetUrl,
        source,
        transitionVideo,
        content,
        isTransitionEnabled,
        container,
        aFrameRoom,
        id,
        createdAt,
        updatedAt,
    }: Partial<AFramePanel> = {}) {
        super(id, createdAt, updatedAt);
        this.image = image;
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.padding = padding;
        this.color = color;
        this.opacity = opacity;
        this.pX = pX;
        this.pY = pY;
        this.pZ = pZ;
        this.rX = rX;
        this.rY = rY;
        this.rZ = rZ;
        this.sX = sX;
        this.sY = sY;
        this.sZ = sZ;
        this.isRemoteDisabled = isRemoteDisabled;
        this.remoteImage = remoteImage;
        this.remotePosX = remotePosX;
        this.remotePosY = remotePosY;
        this.remotePosZ = remotePosZ;
        this.remoteScaX = remoteScaX;
        this.remoteScaY = remoteScaY;
        this.remoteScaZ = remoteScaZ;
        this.remoteRotX = remoteRotX;
        this.remoteRotY = remoteRotY;
        this.remoteRotZ = remoteRotZ;
        this.isRemoteAnimationDisabled = isRemoteAnimationDisabled;
        this.remoteAnimationType = remoteAnimationType;
        this.remoteAnimationSpeed = remoteAnimationSpeed;
        this.isTextDisabled = isTextDisabled;
        this.textValue = textValue;
        this.textColor = textColor;
        this.textWidth = textWidth;
        this.textPosX = textPosX;
        this.textPosY = textPosY;
        this.textPosZ = textPosZ;
        this.textScaX = textScaX;
        this.textScaY = textScaY;
        this.textScaZ = textScaZ;
        this.textRotX = textRotX;
        this.textRotY = textRotY;
        this.textRotZ = textRotZ;
        this.targetType = targetType;
        this.targetAction = targetAction;
        this.targetId = targetId;
        this.type = type;
        this.targetUrl = targetUrl;
        this.source = source;
        this.transitionVideo = transitionVideo;
        this.content = content;
        this.isTransitionEnabled = isTransitionEnabled;
        this.container = container;
        this.aFrameRoom = aFrameRoom;
    }

    toString(): string {
        return AFramePanelApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            image: this.image,
            height: this.height,
            width: this.width,
            depth: this.depth,
            padding: this.padding,
            color: this.color,
            opacity: this.opacity,
            pX: this.pX,
            pY: this.pY,
            pZ: this.pZ,
            rX: this.rX,
            rY: this.rY,
            rZ: this.rZ,
            sX: this.sX,
            sY: this.sY,
            sZ: this.sZ,
            isRemoteDisabled: this.isRemoteDisabled,
            remoteImage: this.remoteImage,
            remotePosX: this.remotePosX,
            remotePosY: this.remotePosY,
            remotePosZ: this.remotePosZ,
            remoteScaX: this.remoteScaX,
            remoteScaY: this.remoteScaY,
            remoteScaZ: this.remoteScaZ,
            remoteRotX: this.remoteRotX,
            remoteRotY: this.remoteRotY,
            remoteRotZ: this.remoteRotZ,
            isRemoteAnimationDisabled: this.isRemoteAnimationDisabled,
            remoteAnimationType: this.remoteAnimationType,
            remoteAnimationSpeed: this.remoteAnimationSpeed,
            isTextDisabled: this.isTextDisabled,
            textValue: this.textValue,
            textColor: this.textColor,
            textWidth: this.textWidth,
            textPosX: this.textPosX,
            textPosY: this.textPosY,
            textPosZ: this.textPosZ,
            textScaX: this.textScaX,
            textScaY: this.textScaY,
            textScaZ: this.textScaZ,
            textRotX: this.textRotX,
            textRotY: this.textRotY,
            textRotZ: this.textRotZ,
            targetType: this.targetType,
            targetAction: this.targetAction,
            targetId: this.targetId,
            type: this.type,
            targetUrl: this.targetUrl,
            source: this.source,
            transitionVideo: this.transitionVideo,
            content: this.content,
            isTransitionEnabled: this.isTransitionEnabled,
            container: this.container,
            aFrameRoom: this.aFrameRoom,
        };
    }
}

export type PAFramePanel = Partial<AFramePanel>;
