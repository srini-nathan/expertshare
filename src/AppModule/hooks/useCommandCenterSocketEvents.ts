import { PUser } from "../../AdminModule/models";
import { CommandType, postNewCommand } from "../socket";
import { PrimitiveObject } from "../models";
import { errorToast, showIncomingCall, successToast } from "../utils";

type CommandCenterSocketEventsType = {
    makeAudioCall: (from: PUser, to: PUser, payload?: PrimitiveObject) => void;
    makeVideoCall: (from: PUser, to: PUser, payload?: PrimitiveObject) => void;
    declineCall: (
        from: PUser,
        to: PUser,
        payload?: PrimitiveObject,
        isVideoCall?: boolean
    ) => void;
    acceptCall: (
        from: PUser,
        to: PUser,
        payload?: PrimitiveObject,
        isVideoCall?: boolean
    ) => void;
    handler: (
        from: PUser,
        to: PUser,
        type: CommandType,
        payload: PrimitiveObject
    ) => void;
};

export function useCommandCenterSocketEvents(): CommandCenterSocketEventsType {
    const makeAudioCall = (
        from: PUser,
        to: PUser,
        payload: PrimitiveObject = {}
    ): void => {
        postNewCommand(from, to, CommandType.NEW_AUDIO_CALL, payload);
    };

    const makeVideoCall = (
        from: PUser,
        to: PUser,
        payload: PrimitiveObject = {}
    ): void => {
        postNewCommand(from, to, CommandType.NEW_VIDEO_CALL, payload);
    };

    const declineCall = (
        from: PUser,
        to: PUser,
        payload: PrimitiveObject = {},
        isVideoCall = false
    ): void => {
        if (isVideoCall) {
            postNewCommand(from, to, CommandType.DECLINED_VIDEO_CALL, payload);
        } else {
            postNewCommand(from, to, CommandType.DECLINED_AUDIO_CALL, payload);
        }
    };

    const acceptCall = (
        from: PUser,
        to: PUser,
        payload: PrimitiveObject = {},
        isVideoCall = false
    ): void => {
        if (isVideoCall) {
            postNewCommand(from, to, CommandType.ACCEPT_VIDEO_CALL, payload);
        } else {
            postNewCommand(from, to, CommandType.ACCEPT_AUDIO_CALL, payload);
        }
    };

    const handler = (
        frm: PUser,
        to: PUser,
        type: CommandType,
        payload: PrimitiveObject = {}
    ): void => {
        // eslint-disable-next-line no-console
        console.log(payload);
        switch (type) {
            case CommandType.NEW_AUDIO_CALL:
                showIncomingCall("Receiving audio call...").then((res) => {
                    if (res.isConfirmed) {
                        successToast("picked up call");
                        acceptCall(to, frm, {}, false);
                    }
                    if (res.isDenied) {
                        errorToast("call declined");
                        declineCall(to, frm, {}, false);
                    }
                });
                break;
            case CommandType.NEW_VIDEO_CALL:
                showIncomingCall("Receiving video call...").then((res) => {
                    if (res.isConfirmed) {
                        successToast("picked up call");
                        acceptCall(to, frm, {}, true);
                    }
                    if (res.isDenied) {
                        errorToast("call declined");
                        declineCall(to, frm, {}, true);
                    }
                });
                break;
            case CommandType.ACCEPT_AUDIO_CALL:
            case CommandType.ACCEPT_VIDEO_CALL:
                successToast("Call accepted");
                break;
            case CommandType.DECLINED_AUDIO_CALL:
            case CommandType.DECLINED_VIDEO_CALL:
                errorToast("Call declined");
                break;
            default:
                errorToast("No default");
        }
    };

    return {
        makeAudioCall,
        makeVideoCall,
        handler,
        declineCall,
        acceptCall,
    };
}
