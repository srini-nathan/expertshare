import { PUser } from "../../AdminModule/models";
import { CommandType, postNewCommand, socket } from "../socket";
import { SocketCommandPayload } from "../models";
import { errorToast, showIncomingCall, successToast } from "../utils";
import { useCallOneToOneHelper } from "./useCallOneToOneHelper";

type CommandCenterSocketEventsType = {
    makeAudioCall: (
        from: PUser,
        to: PUser,
        payload?: SocketCommandPayload
    ) => void;
    makeVideoCall: (
        from: PUser,
        to: PUser,
        payload?: SocketCommandPayload
    ) => void;
    declineCall: (
        from: PUser,
        to: PUser,
        payload?: SocketCommandPayload,
        isVideoCall?: boolean
    ) => void;
    acceptCall: (
        from: PUser,
        to: PUser,
        payload?: SocketCommandPayload,
        isVideoCall?: boolean
    ) => void;
    startCall: (from: PUser, to: PUser, payload?: SocketCommandPayload) => void;
    endCall: (from: PUser, to: PUser, payload?: SocketCommandPayload) => void;
    joinCall: (from: PUser, to: PUser, payload?: SocketCommandPayload) => void;
    handler: (
        from: PUser,
        to: PUser,
        type: CommandType,
        payload: SocketCommandPayload
    ) => void;
};

export function useCommandCenterSocketEvents(): CommandCenterSocketEventsType {
    const { set } = useCallOneToOneHelper();
    const makeAudioCall = (
        from: PUser,
        to: PUser,
        payload: SocketCommandPayload = {}
    ): void => {
        if (socket.connected) {
            postNewCommand(from, to, CommandType.NEW_AUDIO_CALL, payload);
            set({
                from,
                to,
                isVideoCall: false,
                isIncomingCall: false,
            });
        }
    };

    const makeVideoCall = (
        from: PUser,
        to: PUser,
        payload: SocketCommandPayload = {}
    ): void => {
        if (socket.connected) {
            postNewCommand(from, to, CommandType.NEW_VIDEO_CALL, payload);
            set({
                from,
                to,
                isVideoCall: true,
                isIncomingCall: false,
            });
        }
    };

    const declineCall = (
        from: PUser,
        to: PUser,
        payload: SocketCommandPayload = {},
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
        payload: SocketCommandPayload = {},
        isVideoCall = false
    ): void => {
        if (isVideoCall) {
            postNewCommand(from, to, CommandType.ACCEPT_VIDEO_CALL, payload);
        } else {
            postNewCommand(from, to, CommandType.ACCEPT_AUDIO_CALL, payload);
        }
        set({
            from,
            to,
            isVideoCall,
            isIncomingCall: true,
        });
    };

    const handler = (
        frm: PUser,
        to: PUser,
        type: CommandType,
        payload: SocketCommandPayload = {}
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
        }
    };

    const startCall = (
        from: PUser,
        to: PUser,
        payload: SocketCommandPayload = {}
    ): void => {
        postNewCommand(from, to, CommandType.START_CALL_STREAM, payload);
    };

    const endCall = (
        from: PUser,
        to: PUser,
        payload: SocketCommandPayload = {}
    ): void => {
        postNewCommand(from, to, CommandType.END_CALL_STREAM, payload);
    };

    const joinCall = (
        from: PUser,
        to: PUser,
        payload: SocketCommandPayload = {}
    ): void => {
        postNewCommand(from, to, CommandType.JOINED_CALL_STREAM, payload);
    };

    return {
        makeAudioCall,
        makeVideoCall,
        handler,
        declineCall,
        acceptCall,
        startCall,
        endCall,
        joinCall,
    };
}
