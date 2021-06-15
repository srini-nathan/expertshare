import React, { FC } from "react";
import "./assets/scss/styles.scss";

interface AppFooterProps {
    copyRight?: string;
}

export const AppAuthFooter: FC<AppFooterProps> = ({ copyRight = "" }) => {
    return (
        <>
            <div
                className="auth-copyright-container pb-2"
                dangerouslySetInnerHTML={{
                    __html: copyRight,
                }}
            ></div>
        </>
    );
};
