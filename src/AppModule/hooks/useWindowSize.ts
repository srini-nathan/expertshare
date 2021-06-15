import { useEffect, useState } from "react";

export function useWindowSize() {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [height, setHeight] = useState<number>(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
            setHeight(window.innerHeight);
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });

    return { width, height };
}
