import React, { FC, useEffect, CSSProperties } from "react";
import "./assets/scss/style.scss";

export interface AppKnovioPlayerProps {
    linkUrl: string;
    height: number;
    width: number;
}

const useScript = (url: string) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = url;
        script.type = "text/javascript";

        document.body.appendChild(script);
        return () => {
            document.removeChild(script);
        };
    }, [url]);
};

export const AppKnovioPlayer: FC<AppKnovioPlayerProps> = ({
    linkUrl,
    ...props
}): JSX.Element => {
    const baseUrl = "https://view.knowledgevision.com/presentation/";
    const id = linkUrl.split("/")[4];
    const myStyles: CSSProperties = {
        ...props,
    };
    useScript(`${baseUrl}embed/${id}.js`);
    return (
        <div style={myStyles}>
            <div
                id={`KnowledgeVisionEmbeddedContent${id}`}
                className="KnowledgeVisionEmbeddedContent"
            ></div>
        </div>
    );
};
