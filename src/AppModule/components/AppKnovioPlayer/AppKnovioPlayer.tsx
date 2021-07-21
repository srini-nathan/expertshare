import React, { FC, CSSProperties, useEffect } from "react";
import { Helmet } from "react-helmet";

export interface AppKnovioPlayerProps {
    linkUrl: string;
    height: number | string;
    width: number | string;
}

export const AppKnovioPlayer: FC<AppKnovioPlayerProps> = ({
    linkUrl,
    ...props
}): JSX.Element => {
    const baseUrl = "https://view.knowledgevision.com/presentation/";
    const id = linkUrl.split("/")[4];
    const myStyles: CSSProperties = {
        ...props,
    };

    useEffect(() => {
        setTimeout(() => {
            // @TODO: dirty trick to forcefully restart knovio player
            if ((window as any).knowledgevisionLoader) {
                (window as any).knowledgevisionLoader.embeds[0].loaded = false;
                (window as any).knowledgevisionLoader.checkEmbeds();
            }
        }, 2000);
    }, []);

    return (
        <div style={myStyles}>
            <Helmet>
                <script
                    type="text/javascript"
                    src={`${baseUrl}embed/${id}.js`}
                ></script>
            </Helmet>
            <div
                id={`KnowledgeVisionEmbeddedContent${id}`}
                className="KnowledgeVisionEmbeddedContent"
            ></div>
        </div>
    );
};
