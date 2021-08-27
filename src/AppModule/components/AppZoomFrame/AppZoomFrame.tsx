import React, { FC } from "react";
import { ZoomMtg } from "@zoomus/websdk";

import crypto from "crypto";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";
import { ZOOM_API_KEY, ZOOM_SECRET_KEY, API_HOST } from "../../config/app-env";

export interface AppZoom {
    meetNumber: string;
}

export const AppZoomFrame: FC<AppZoom> = ({ meetNumber }): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;

    const apiKeyValue = `${ZOOM_API_KEY}`;
    const apiSecretValue = `${ZOOM_SECRET_KEY}`;
    const roleValue = 0;
    const leaveUrl = "http://test2.localhost:3000/event";

    const generateSignature = (
        apiKey: string,
        apiSecret: string,
        meetingNumber: number,
        role: number
    ) => {
        const timestamp = new Date().getTime() - 30000;
        const msg = Buffer.from(
            apiKey + meetingNumber + timestamp + role
        ).toString("base64");
        const hash = crypto
            .createHmac("sha256", apiSecret)
            .update(msg)
            .digest("base64");
        const signature = Buffer.from(
            `${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`
        ).toString("base64");
        return signature;
    };

    const signature = generateSignature(
        apiKeyValue,
        apiSecretValue,
        +meetNumber,
        roleValue
    );

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
            const root = document?.getElementById("showZoomLink");
            if (meet !== null && root !== null) {
                meet.style.display = "block";
                root.append(meet);
            }
        }
    };

    React.useEffect(() => {
        ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.8/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
        initiateMeeting();
        showZoomDiv();
    }, []);

    return <></>;
};
