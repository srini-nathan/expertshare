import React, { FC } from "react";
import Draggable from "react-draggable";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ringtone from "./assets/audio/calling.mp3";

import {
    useAuthState,
    useBuildAssetPath,
    useCallOneToOneHelper,
} from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";
import { CONSTANTS } from "../../../config";

import "./assets/scss/style.scss";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export const AppCallOneToOne: FC = () => {
    const { user } = useAuthState();
    const { call } = useCallOneToOneHelper();
    const profilePictureBasePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );

    if (!call) {
        return null;
    }

    const { from, to } = call;
    const isMe = user.id === from.id;
    const otherUser = isMe ? to : from;

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
                <div className="call-started--box">
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
                                        <i style={otherUserProfileStyle}></i>
                                    </div>
                                </div>
                                <div className="own-stream-thumb">
                                    <div className="own-stream-thumb--container">
                                        <i
                                            className="profile-pic"
                                            style={loginUserProfileStyle}
                                        ></i>
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
                                        className="btn-dark-mode mic-btn"
                                    >
                                        <i className="fak fa-voice"></i>
                                    </a>
                                    <a href="#" className="end-call-btn mx-3">
                                        <i className="fak fa-call-dec"></i>
                                    </a>
                                    <a
                                        href="#"
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
