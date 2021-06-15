import { useState } from "react";

export function useWindowLocation() {
    const [location] = useState<string>(window.location.pathname);
    return { location };
}
