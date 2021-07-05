import { CONSTANTS } from "../../config";

const { AFramePanel } = CONSTANTS;

interface Use3DHelperType {
    buildPageUrl: (elementType: string, elementId: number) => string;
}

const BASE_PATH = "/a3d";

export function use3DHelper(): Use3DHelperType {
    const buildPageUrl = (elementType: string, elementId: number): string => {
        let type = elementType;
        if (elementType === AFramePanel.TARGETTYPE.TARGETTYPE_IFRAME) {
            type = "screen";
        }

        if (elementType === AFramePanel.TARGETTYPE.TARGETTYPE_BILLBOARD) {
            type = "html";
        }

        if (elementType === AFramePanel.TARGETTYPE.TARGETTYPE_PROJECTOR) {
            type = "video";
        }

        return `${BASE_PATH}/${type}/${elementId}`;
    };

    return {
        buildPageUrl,
    };
}
