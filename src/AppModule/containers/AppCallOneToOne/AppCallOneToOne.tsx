import React, { FC, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Peer, { SignalData } from "simple-peer";
import {
    useAuthState,
    useBuildAssetPath,
    useCallOneToOneHelper,
    useCommandCenterSocketEvents,
} from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";
import { CONSTANTS } from "../../../config";

import "./assets/scss/style.scss";
import { FileTypeInfo, SocketCommandPayload } from "../../models";
import { requestMediaPermission } from "../../utils";
import { CommandType, EVENTS, socket } from "../../socket";
import { PUser } from "../../../AdminModule/models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export const AppCallOneToOne: FC = () => {
    const { user } = useAuthState();
    const { call, set } = useCallOneToOneHelper();
    const profilePictureBasePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );
    const { startCall, endCall, joinCall } = useCommandCenterSocketEvents();
    const [stream, setStream] = useState<MediaStream>();
    const [callerSignal, setCallerSignal] = useState<SignalData>();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);
    const [audioMuted, setAudioMuted] = useState(false);
    const [fullScreen, setFullscreen] = useState(false);
    const [callInProgress, setCallInProgress] = useState(false);
    const incomingVideo = useRef<HTMLVideoElement>(null);
    const outgoingVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance>();
    const isMe = call && user.id === call?.from.id;
    const otherUser = call && isMe ? call?.to : call?.from;
    const initCall = () => {
        setCallInProgress(true);
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        peer.on("signal", (data) => {
            if (otherUser) {
                startCall(user, otherUser, { signal: data });
            }
        });
        peer.on("close", () => {
            setCallAccepted(false);
        });

        peer.on("stream", (s) => {
            if (incomingVideo && incomingVideo.current) {
                incomingVideo.current.srcObject = s;
            }
        });
        socket.once(
            EVENTS.ON_NEW_COMMAND,
            (
                from: PUser,
                to: PUser,
                type: CommandType,
                payload: SocketCommandPayload
            ) => {
                if (type === CommandType.JOINED_CALL_STREAM) {
                    const { signal } = payload;
                    setCallAccepted(true);
                    if (signal) {
                        peer.signal(signal);
                    }
                }
            }
        );

        connectionRef.current = peer;
    };
    const answerCall = () => {
        setCallInProgress(true);
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });
        peer.on("signal", (data) => {
            if (otherUser) {
                joinCall(user, otherUser, { signal: data });
                setCallerSignal(data);
            }
        });

        peer.on("stream", (s) => {
            if (incomingVideo && incomingVideo.current)
                incomingVideo.current.srcObject = s;
        });

        peer.on("close", () => {
            setCallAccepted(false);
        });

        if (callerSignal) {
            peer.signal(callerSignal);
        }
        connectionRef.current = peer;
    };

    useEffect(() => {
        if (isMe) {
            initCall();
        } else {
            answerCall();
        }
    }, []);

    const leaveCall = () => {
        if (otherUser) {
            endCall(user, otherUser, {});
        }
        setCallEnded(true);
        setCallInProgress(false);
        if (connectionRef && connectionRef.current) {
            connectionRef.current.destroy();
            set(null);
        }
    };
    const updateMedia = (newStream: MediaStream) => {
        setStream(newStream);
        if (outgoingVideo && outgoingVideo.current) {
            outgoingVideo.current.srcObject = newStream;
        }
        if (connectionRef && connectionRef.current && stream) {
            connectionRef.current.replaceTrack(
                stream.getVideoTracks()[0],
                newStream.getVideoTracks()[0],
                stream
            );
            connectionRef.current.replaceTrack(
                stream.getAudioTracks()[0],
                newStream.getAudioTracks()[0],
                stream
            );
        }
    };

    const muteVideo = () => {
        if (stream) {
            setVideoMuted(!videoMuted);
            stream.getVideoTracks()[0].enabled = videoMuted;
            updateMedia(stream);
        }
    };

    const muteAudio = () => {
        if (stream) {
            setAudioMuted(!audioMuted);
            stream.getAudioTracks()[0].enabled = audioMuted;
            updateMedia(stream);
        }
    };

    useEffect(() => {
        const elem: any = document.getElementById("main-video-content");
        if (elem) {
            if (fullScreen && document) {
                document.exitFullscreen().catch(() => {});
            } else if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {});
            }
        }
    }, [fullScreen]);

    useEffect(() => {
        if (call) {
            requestMediaPermission({
                video: !videoMuted,
                audio: !audioMuted,
            }).then((newStream) => {
                if (!stream && newStream !== null) {
                    setStream(newStream);
                    updateMedia(newStream);
                }
                if (outgoingVideo && outgoingVideo.current) {
                    outgoingVideo.current.srcObject = newStream;
                }
            });
        }
    }, [callInProgress, callAccepted, callEnded, audioMuted, call, stream]);

    const shareScreen = () => {
        navigator.mediaDevices
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .getDisplayMedia({ cursor: true })
            .then((screenStream: MediaStream) => {
                if (connectionRef && connectionRef.current && stream) {
                    connectionRef.current.replaceTrack(
                        stream.getVideoTracks()[0],
                        screenStream.getVideoTracks()[0],
                        stream
                    );
                }
                if (outgoingVideo && outgoingVideo.current) {
                    outgoingVideo.current.srcObject = screenStream;
                }
                screenStream.getTracks()[0].onended = () => {
                    if (stream) {
                        if (connectionRef && connectionRef.current) {
                            connectionRef.current.replaceTrack(
                                screenStream.getVideoTracks()[0],
                                stream.getVideoTracks()[0],
                                stream
                            );
                        }
                        if (outgoingVideo && outgoingVideo.current) {
                            outgoingVideo.current.srcObject = stream;
                        }
                    }
                };
            });
    };

    if (!call) {
        return null;
    }

    const loginUserProfileStyle = {
        backgroundImage: user?.imageName
            ? `url(${profilePictureBasePath}/${user?.imageName})`
            : `url(${placeholder})`,
    };
    const otherUserProfileStyle = {
        backgroundImage: otherUser?.imageName
            ? `url(${profilePictureBasePath}/${otherUser?.imageName})`
            : `url(${placeholder})`,
    };

    return (
        <div className={`app-call-one-to-one`}>
            <Draggable
                axis="both"
                handle=".btn-move"
                defaultClassName="draggable-container"
            >
                <div className="call-started--box" id="main-video-content">
                    <div className="call-started--box--container">
                        <div className="call-started--box--container--header pt-4 px-2">
                            <div className="row m-0 p-0">
                                <div className="spec-call col-auto">
                                    <div className="spec-call--profile mr-2">
                                        <i style={otherUserProfileStyle}></i>
                                    </div>
                                    <div className="spec-call--det">
                                        <h2 className="spec-call--det--name mb-0">
                                            {otherUser?.firstName}{" "}
                                            {otherUser?.lastName}
                                        </h2>
                                        <span className="spec-call--det--time">
                                            00:00:00
                                        </span>
                                    </div>
                                </div>
                                <div className="option-call col-auto mr-0 ml-auto d-none">
                                    <a
                                        href="#"
                                        className="members-btn btn-dark-mode"
                                    >
                                        <i className="fak fa-users"></i>
                                        Members
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="call-started--box--container--content">
                            <div className="center-pic-container">
                                <div className="inner-content">
                                    <div className="inner-content--circle inner-content--dialing">
                                        {!stream && (
                                            <i
                                                style={otherUserProfileStyle}
                                            ></i>
                                        )}
                                        {stream && (
                                            <div className="video my-video">
                                                <video
                                                    playsInline
                                                    muted
                                                    ref={
                                                        callAccepted &&
                                                        !callEnded
                                                            ? incomingVideo
                                                            : outgoingVideo
                                                    }
                                                    autoPlay
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="own-stream-thumb">
                                    <div className="own-stream-thumb--container">
                                        {!callAccepted && callEnded ? (
                                            <i
                                                className="profile-pic"
                                                style={loginUserProfileStyle}
                                            ></i>
                                        ) : null}
                                        {callAccepted && !callEnded ? (
                                            <div
                                                className="video user-video"
                                                id="userVideo"
                                            >
                                                <video
                                                    playsInline
                                                    ref={outgoingVideo}
                                                    autoPlay
                                                />
                                            </div>
                                        ) : null}
                                        <h3 className="profile-name mb-0">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="call-started--box--container--footer">
                            <div className="row m-0 px-2">
                                <div className="left-side col-auto d-none d-md-flex ">
                                    <a
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                        className="btn-dark-mode btn-move"
                                    >
                                        <i className="fak fa-arrows-light"></i>
                                    </a>
                                </div>
                                <div className="center-side col-sm-12 col-md-4 mr-0 ml-auto">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            muteAudio();
                                        }}
                                        className="btn-dark-mode mic-btn"
                                    >
                                        <i className="fak fa-voice"></i>
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            leaveCall();
                                        }}
                                        className="end-call-btn mx-3"
                                    >
                                        <i className="fak fa-call-dec"></i>
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            muteVideo();
                                        }}
                                        className="btn-dark-mode video-btn"
                                    >
                                        <i className="fak fa-video-declined"></i>
                                    </a>
                                </div>
                                <div className="right-side col-sm-6 col-md-4">
                                    <a
                                        href="#"
                                        className="btn-dark-mode vol-btn"
                                    >
                                        <i className="fak fa-volume-on"></i>
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            shareScreen();
                                        }}
                                        className="btn-dark-mode clipboard-btn"
                                    >
                                        <i className="fak fa-clone-light"></i>
                                    </a>
                                    <a
                                        href="#"
                                        className="btn-dark-mode chat-btn"
                                    >
                                        <i className="fak fa-message-dot"></i>
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setFullscreen(!fullScreen);
                                        }}
                                        className="btn-dark-mode full-sc-btn"
                                    >
                                        <i className="fak fa-maximize"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </div>
    );
};
