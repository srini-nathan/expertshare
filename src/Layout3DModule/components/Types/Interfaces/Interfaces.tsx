export interface VideoSpheresDataProps {
    visible: boolean;
    panelId: number;
    roomId: number;
    targetId: number;
    videoUrl: string;
    tempUrl: string;
}

export interface PositionProps {
    x: number;
    y: number;
    z: number;
}

export interface RotationProps {
    x: number;
    y: number;
    z: number;
}

export interface ScaleProps {
    x: number;
    y: number;
    z: number;
}

export interface CameraProps {
    position: PositionProps;
    rotation: RotationProps;
}

export interface LabelProps {
    color: string;
    disable: boolean;
    position: PositionProps;
    rotation: RotationProps;
    scale: ScaleProps;
    value: string;
    width: number;
}

export interface RemoteProps {
    animationDisable: boolean;
    animationImageId: string; // TODO change to URL
    animationSpeed: number;
    animationType: string;
    assetId: string; // TODO change to URL?
    disable: boolean;
    position: PositionProps;
    remoteModelId: string; // TODO not needed anymore?
    rotation: RotationProps;
    scale: ScaleProps;
}

export interface TargetProps {
    action: string;
    id: number;
    panelName: string;
    type: string;
    url: string; // NEW!!
}

export interface Video360Props {
    assetId: string;
    assetUrl: string; // TODO add this in back-end
}

export interface SkyProps {
    assetId: string;
    assetUrl: string; // TODO add this in back-end
}

export interface PanelInterfaceProps {
    id: number;
    color: string;
    content: string;
    depth: number;
    height: number;
    image: {
        assetId: string;
        url: string;
    };
    isTransitionEnabled: boolean;
    label: LabelProps;
    opacity: number;
    padding: string;
    panelName: string;
    position: PositionProps;
    remote: RemoteProps;
    rotation: RotationProps;
    scale: ScaleProps;
    target: TargetProps;
    type: string;
    video: Video360Props;
    source: { assetId: string };
    width: number;
}

export interface RoomProps {
    id: number;
    name: string;
    camera: CameraProps;
    panels: PanelInterfaceProps[];
    sky: SkyProps;
}

export interface ParentProps {
    width: number;
    height: number;
    depth: number;
}
