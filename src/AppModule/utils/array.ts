import { indexOf } from "lodash";

export const checkAndAdd = <T>(collection: T[], searchOrAdd: T): void => {
    const index = indexOf(collection, searchOrAdd);
    if (index === -1) {
        collection.push(searchOrAdd);
    }
};

export const checkAndRemove = <T>(collection: T[], searchOrAdd: T): void => {
    const index = indexOf(collection, searchOrAdd);
    if (index > -1) {
        collection.splice(index, 1);
    }
};
