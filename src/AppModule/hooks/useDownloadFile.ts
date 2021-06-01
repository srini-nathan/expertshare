import { useState, useEffect } from "react";

interface LinkProps {
    name: string;
    file: any;
    type: string;
}

export function useDownloadFile() {
    const [link, setLink] = useState<LinkProps>();

    useEffect(() => {
        if (link) {
            const l = document.createElement("a");
            l.target = "_blank";
            l.download = link.name;
            l.href = URL.createObjectURL(
                new Blob([link.file], { type: link.type })
            );
            document.body.appendChild(l);
            l.click();
            document.body.removeChild(l);
        }
    }, [link]);

    const updateLink = (props: LinkProps) => {
        setLink(props);
    };
    return [updateLink];
}
