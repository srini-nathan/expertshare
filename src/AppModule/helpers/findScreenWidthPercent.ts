export const findPercent = (width: number): number => {
    if (width < 767) {
        return 100;
    }
    if (width <= 768 && width > 767) {
        return 25;
    }
    if (width <= 992 && width > 768) {
        return 20;
    }
    if (width <= 1200 && width > 993) {
        return 18;
    }
    if (width <= 1371 && width > 1201) {
        return 17;
    }
    if (width <= 1980 && width > 1371) {
        return 16;
    }
    if (width <= 2220 && width > 1981) {
        return 13;
    }
    if (width <= 2800 && width > 2201) {
        return 10;
    }
    return 8;
};
