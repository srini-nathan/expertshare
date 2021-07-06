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
