import React, { FC } from "react";

export interface AppGridNoRowsOverlayProps {
    noRowsMessageFunc: () => string;
}

export const AppGridNoRowsOverlay: FC<AppGridNoRowsOverlayProps> = ({
    noRowsMessageFunc,
}) => (
    <div className="ag-overlay-no-rows-wrapper">
        <div className="alert alert-danger" role="alert">
            {noRowsMessageFunc()}
        </div>
    </div>
);
