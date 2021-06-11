import React, { FC, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import { AppButton } from "../AppButton";
import { AppIcon } from "../AppIcon";
import { NewsfeedCommentApi } from "../../apis";
import { AppQAThread } from "../AppQAThread";
import { successToast, errorToast } from "../../utils";

import "./assets/scss/style.scss";

export interface AppFeedShowerProps {
    item?: any;
    container: number;
    user?: any;
    handleNewsFeedId: (id: number) => void;
    handlePatchNewsfeedMessage: (id: number, message: string) => void;
}

export const AppFeedShower: FC<AppFeedShowerProps> = ({
    item,
    container,
    handleNewsFeedId,
    handlePatchNewsfeedMessage,
}): JSX.Element => {
    const [data, setData] = useState<[]>([]);

    const [showCommentTextarea, setShowCommentTextarea] = useState<boolean>(
        false
    );

    const [showEditTextarea, setShowEditTextarea] = useState<boolean>(false);

    const newsfeedId = item.id;
    const [showThread, setShowThread] = useState<boolean>(true);

    const getCurrentThread = () => {
        NewsfeedCommentApi.getNewsfeedComments(newsfeedId).then((response) => {
            if (response) {
                setData(response["hydra:member"].reverse());
            }
        });
    };

    const newMessageSend = (message: string) => {
        const meesageObj = {
            message: `${message}`,
            status: "NEW",
            isReplyed: true,
            container: `api/containers/${container}`,
            newsfeed: `api/newsfeeds/${newsfeedId}`,
        };

        const messageToPost = JSON.stringify(meesageObj);

        NewsfeedCommentApi.postNewsfeedComments<any, any>(messageToPost).then(
            ({ response, errorMessage }) => {
                if (response) {
                    getCurrentThread();
                }
                if (errorMessage) {
                    errorToast(errorMessage);
                }
            }
        );
        setShowCommentTextarea(false);
    };

    const sendAnswerMessage = (message: string, aId: number) => {
        const meesageObj = {
            message: `${message}`,
            status: "NEW",
            parent: `api/newsfeed_comments/${aId}`,
            isReplyed: true,
            container: `api/containers/${container}`,
            newsfeed: `api/newsfeeds/${newsfeedId}`,
        };

        const messageToPost = JSON.stringify(meesageObj);

        NewsfeedCommentApi.postNewsfeedComments<any, any>(messageToPost).then(
            ({ response, errorMessage }) => {
                if (response) {
                    getCurrentThread();
                }
                if (errorMessage) {
                    errorToast(errorMessage);
                }
            }
        );
    };

    const showAllThread = () => {
        setShowThread(!showThread);
        getCurrentThread();
    };

    const updateNewsfeeMessage = (message: string) => {
        handlePatchNewsfeedMessage(newsfeedId, message);
    };

    const deleteNewsfeedCommentById = (id: number) => {
        // eslint-disable-next-line no-console
        NewsfeedCommentApi.deleteNewsfeedCommentById(id).then(() => {
            getCurrentThread();
            successToast("Successfully deleted");
        });
    };

    useEffect(() => {
        setData([]);
        getCurrentThread();
    }, [item]);

    return (
        <div className="app-feed-shower-wrapper">
            <div className="row m-0 px-3 pt-3 pb-3">
                <div className="details col-auto p-0">
                    <div className="details--content">
                        <div className="avatar">
                            <i></i>
                        </div>
                        <div className="name pl-2">
                            <div className="name--sender">
                                <h3>
                                    {item.user.firstName} {item.user.lastName}
                                </h3>
                            </div>
                            <div className="name--comment">
                                <span>{item.scheduleEndAt}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="action col-auto p-0 mr-0 ml-auto">
                    <div className="row m-0 p-0">
                        <div
                            className="btn-collapse col-auto p-0"
                            id="btn-collapse-single"
                        >
                            <div className="btns-flex">
                                <AppButton
                                    variant="secondary"
                                    onClick={() =>
                                        setShowCommentTextarea(
                                            !showCommentTextarea
                                        )
                                    }
                                    className={`${
                                        showCommentTextarea && "green-bg"
                                    }`}
                                >
                                    <AppIcon
                                        className={`mr-2 ml-2 ${
                                            showCommentTextarea && "green"
                                        }`}
                                        name="FaShare"
                                    />
                                </AppButton>
                                <AppButton
                                    variant="secondary"
                                    onClick={() => {
                                        setShowEditTextarea(!showEditTextarea);
                                    }}
                                    className={`${
                                        showEditTextarea && "green-bg"
                                    }`}
                                >
                                    <AppIcon
                                        className={`mr-2 ml-2 ${
                                            showEditTextarea && "green"
                                        }`}
                                        name="edit"
                                    />
                                </AppButton>
                                <AppButton
                                    variant="secondary"
                                    onClick={() => handleNewsFeedId(newsfeedId)}
                                >
                                    <AppIcon
                                        className="mr-2 ml-2"
                                        name="delete"
                                    />
                                </AppButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row app-feed-shower-wrapper--posted-text text pr-5 pt-2 pb-3">
                <div className="text">{item.postText}</div>
                {item.mediaFileNames[0] && (
                    <img
                        className=" app-feed-shower-wrapper--posted-text--image"
                        src={`https://esrapidev1.expertshare.me/uploads/${container}/newsfeed_media/${item.mediaFileNames[0]}`}
                    />
                )}

                {item.mediaFileNames[1] && (
                    <ReactPlayer
                        className={"video-player"}
                        controls={true}
                        width="100%"
                        height="100%"
                        url={`https://esrapidev1.expertshare.me/uploads/${container}/newsfeed_media/${item.mediaFileNames[1]}`}
                    />
                )}
            </div>

            <div className="row app-feed-shower-wrapper--button-comments text pt-2 pb-3">
                {data.length > 0 && (
                    <AppButton
                        variant="secondary"
                        className={`${showThread && "green"}`}
                        onClick={() => {
                            showAllThread();
                        }}
                    >
                        {/* <span className="mr-2">1.5K</span> */}
                        <AppIcon name="CommentAlt" />
                    </AppButton>
                )}
            </div>

            <div className="app-feed-shower-wrapper--type-your-comment text pl-2 pr-2 pb-4">
                {showCommentTextarea && (
                    <AppСhoseMethodMessage
                        activeTab="Text"
                        className="ptop-messages"
                        rows={2}
                        enterToPost
                        handleMessageSend={(message) => {
                            newMessageSend(message);
                        }}
                    />
                )}
                {showEditTextarea && (
                    <AppСhoseMethodMessage
                        activeTab="Text"
                        className="ptop-messages"
                        rows={2}
                        isEdit
                        editMessage={item.postText}
                        enterToPost
                        handleUpdateMessage={(message) => {
                            setShowEditTextarea(false);
                            updateNewsfeeMessage(message);
                        }}
                    />
                )}
            </div>
            {showThread && (
                <div className="">
                    <AppQAThread
                        data={data}
                        deleteQuestion={(qId) => {
                            deleteNewsfeedCommentById(qId);
                        }}
                        updateMessage={(id, message) => {
                            // eslint-disable-next-line no-console
                            console.log(id, message);
                        }}
                        sendAnswer={(message, aId) => {
                            sendAnswerMessage(message, aId);
                        }}
                    />
                </div>
            )}
        </div>
    );
};
