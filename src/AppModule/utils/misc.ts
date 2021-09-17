import { mergeWith } from "lodash";
import { DesignConfiguration } from "../../AdminModule/models/entities/DesignConfiguration";
import { PrimitiveObject } from "../models";
import {
    Configuration,
    useDefaultOnEmpty,
} from "../../AdminModule/models/entities/Configuration";

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
    if (container?.designConfiguration) {
        design = { ...design, ...container.designConfiguration };
    }

    return design;
};

export const getBGStyle = (
    basePath: string,
    image = "",
    placeholder?: any
): PrimitiveObject => {
    if (image && image !== "") {
        return {
            backgroundImage: `url(${basePath}/${image})`,
        };
    }
    if (placeholder) {
        return {
            backgroundImage: `url(${placeholder})`,
        };
    }
    return {};
};

export const resolveImage = (
    basePath: string,
    image = "",
    placeholder: any
): string | any => {
    if (image && image !== "") {
        return `${basePath}/${image}`;
    }
    return placeholder;
};

export const parseConfiguration = (container: any): Configuration => {
    let configuration: Configuration = new Configuration();
    if (container.configuration) {
        configuration = mergeWith(
            configuration,
            container.configuration,
            (defaultVal, dbVal, key) => {
                if (useDefaultOnEmpty.indexOf(key) > -1 && !dbVal) {
                    return defaultVal;
                }
                return dbVal;
            }
        );
    }
    return configuration;
};

export const resolveImageWithStyle = (
    basePath: string,
    image = "",
    placeholder?: any
): string | any => {
    const bgStyle = getBGStyle(basePath, image, placeholder);
    const css =
        image === ""
            ? {
                  ...bgStyle,
                  backgroundSize: "inherit",
                  backgroundPosition: "center",
              }
            : bgStyle;
    return css;
};
