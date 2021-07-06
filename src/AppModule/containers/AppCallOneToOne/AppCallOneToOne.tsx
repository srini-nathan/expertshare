import React, { FC, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ringtone from "./assets/audio/calling.mp3";

import "./assets/scss/style.scss";

const audio = new Audio(ringtone);

export const AppCallOneToOne: FC = () => {
    const [me, setMe] = useState("");
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [users, setUsers] = useState([]);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState("");
    const [videoMuted, setVideoMuted] = useState(false);
    const [audioMuted, setAudioMuted] = useState(false);
    const [calltime, setCallTime] = useState(0);
    const [callInProgress, setCallInProgress] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    return <div className={`app-call-one-to-one`}></div>;
};
