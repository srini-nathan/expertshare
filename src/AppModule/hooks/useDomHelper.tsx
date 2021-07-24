export const useDomHelper = () => {
    const setFavicon = (href: string) => {
        const link: HTMLLinkElement =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = href;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    const setStyle = (css: string) => {
        const styleTag = document.createElement("style");
        styleTag.id = "dynamic-css";
        styleTag.appendChild(document.createTextNode(css));
        document.head.appendChild(styleTag);
    };

    return {
        setFavicon,
        setStyle,
    };
};
