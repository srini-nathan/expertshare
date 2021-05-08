import React, { FC, CSSProperties } from "react";
import { Helmet } from "react-helmet";

export interface AppKnovioPlayerProps {
    linkUrl: string;
    height: number;
    width: number;
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
