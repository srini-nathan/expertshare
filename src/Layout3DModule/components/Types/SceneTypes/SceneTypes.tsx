export const PanelTypes = {
    DOOR: "door", // contains target room -> change to that target room
    SCREEN: "screen", // used to be only image?
    BILLBOARD: "billboard", // contains content - HTML encrypted. -> send to iframe
    PROJECTOR: "projector", // contains video -> play pause it
    IFRAME: "iframe", // contains url -> open in another iframe - element type is screen
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TargetTypes = {
    ROOM: "room",
    IFRAME: "iframe",
    PROJECTOR: "projector",
    BILLBOARD: "billboard",
};

export const SourceTypes = {
    YOUTUBE: "YOUTUBE",
    VIMEO: "VIMEO",
    SWISSCOM: "SWISSCOM",
    DACAST: "DACAST",
};
