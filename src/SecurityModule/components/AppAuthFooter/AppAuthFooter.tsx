import React, { FC } from "react";
import "./assets/scss/styles.scss";

export const AppAuthFooter: FC = () => {
    return (
        <>
            <div className="auth-copyright-container pb-2">
                <div className="auth-copyright-container--text-content">
                    © Copyright 2020 – Expertshare
                </div>
                <div className="auth-copyright-container--create-content">
                    Virtual event platform created by
                </div>
                <div className="auth-copyright-container--logo">
                    <a href="/">
                        <span></span>
                    </a>
                </div>
            </div>
        </>
    );
};
