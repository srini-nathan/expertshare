import React, { FC } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import { useLocation } from "@reach/router";

import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { ZOOM_API_KEY } from "../../config/app-env";

export interface AppZoom {
    meetNumber: string;
    signature: string;
}

export const AppZoomFrame: FC<AppZoom> = ({
    meetNumber,
    signature,
}): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const location = useLocation();

    const apiKeyValue = `${ZOOM_API_KEY}`;
    const leaveUrl = location.pathname;

    const initiateMeeting = () => {
        ZoomMtg.init({
            leaveUrl,
            isSupportAV: true,
            success: () => {
                ZoomMtg.join({
                    signature,
                    meetingNumber: meetNumber,
                    userName: `${user?.firstName} ${user?.lastName}` || "",
                    apiKey: apiKeyValue,
                    success: (s: any) => {
                        console.log(s);
                    },
                    error: (error: any) => {
                        console.log(error);
                    },
                });
            },
            error: (error: unknown) => {
                console.log(error);
            },
        });
    };

    const showZoomDiv = () => {
        const { document } = window;
        if (document && document !== null) {
            const meet = document?.getElementById("zmmtg-root");
            if (meet !== null) {
                meet.style.display = "block";
            }
        }
    };

    React.useEffect(() => {
        showZoomDiv();
        ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.8/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
        initiateMeeting();
    }, []);

    return <></>;
};
