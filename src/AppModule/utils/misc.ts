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
