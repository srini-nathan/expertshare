import { DesignConfiguration } from "../../AdminModule/models/entities/DesignConfiguration";
import { PrimitiveObject } from "../models";
import { Configuration } from "../../AdminModule/models/entities/Configuration";

export const parseIdFromResourceUrl = (resourceUrl: string): number | null => {
    const parts = resourceUrl.split("/");
    if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        return parseInt(lastPart, 10);
    }

    return null;
};

export const isAppLoadedInIFrame = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};

export const requestMediaPermission = async (
    constraints?: MediaStreamConstraints
): Promise<MediaStream | null> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        return stream;
    } catch (error) {
        return new Promise<null>((resolve) => resolve(null));
    }
};

export const parseDesign = (container: any): DesignConfiguration => {
    let design: DesignConfiguration = new DesignConfiguration();
    if (container.designConfiguration) {
        design = { ...design, ...container.designConfiguration };
    }

    return design;
};

export const getBGStyle = (
    basePath: string,
    image: string
): PrimitiveObject => {
    if (image !== "") {
        return {
            backgroundImage: `url(${basePath}/${image})`,
        };
    }
    return {};
};

export const parseConfiguration = (container: any): Configuration => {
    let configuration: Configuration = new Configuration();
    if (container.configuration) {
        configuration = { ...configuration, ...container.configuration };
    }

    return configuration;
};
