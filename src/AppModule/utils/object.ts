export const getFirstKey = <T>(object: T): string => {
    const keys = Object.keys(object);
    if (keys.length === 0) {
        throw new Error("Empty object is passed");
    }

    return keys[0];
};

export const getFirstValue = <T>(object: T): any => {
    const keys = Object.keys(object);
    if (keys.length === 0) {
        throw new Error("Empty object is passed");
    }
    const firstKey = keys[0] as keyof T;

    return object[firstKey];
};
