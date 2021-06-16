import React, {
    ChangeEventHandler,
    FC,
    useState,
    useEffect,
    useRef,
} from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Picker, BaseEmoji } from "emoji-mart";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AppFormElementProps, FileTypeInfo, Upload } from "../../models";
import { AppUploader } from "../AppUploader";
import { UploadAPI, NewsfeedApi } from "../../apis";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppDatePicker } from "../AppDatePicker";
import { AppButton } from "../AppButton";

import { errorToast, successToast } from "../../utils";

import "emoji-mart/css/emoji-mart.css";
import "./assets/scss/style.scss";

import { CONSTANTS } from "../../../config";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_NEWSFEED_MEDIA },
} = UPLOAD;
export interface AppFeedAdderProps extends AppFormElementProps {
    isSend?: boolean;
    rows?: number;
    container: number;
    addNewsfeedObject: (message: any) => void;
    handleUpdateData?: (message: any) => void;
    onChange?: ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;
}

export const AppFeedAdder: FC<AppFeedAdderProps> = ({
    rows = 5,
    onChange,
    handleUpdateData,
    addNewsfeedObject,
    isSend,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>("");

    const { className = "", container } = props;
    const groupProps = { className };

    const [showEmogiModal, setShowEmogiModal] = useState(false);
    const [collaspseSettings, setCollapseSettings] = useState<boolean>(false);
    const [openImage, settOpenImage] = useState<boolean>(false);
    const [openVideo, setOpenVideo] = useState<boolean>(false);

    const [videoFile, setVideoFile] = useState<File[]>([]);
    const [videoFileName, setVideoFileName] = useState<any>("");

    const [imageFileName, setImageFileName] = useState<any>("");
    const [imageBlob, setImageBlob] = useState<Blob[]>([]);

    const setImageData = (image: any) => {
        if (image[0].name) {
            setImageFileName(image[0].name);
        } else {
            setImageBlob(image);
        }
    };

    const validationSchema = Yup.object().shape({});

    const { control } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    function useOutsideEmoji(ref: any) {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShowEmogiModal(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const wrapperRef = useRef(null);
    useOutsideEmoji(wrapperRef);

    const addEmoji = (emoj: BaseEmoji) => {
        setData(data + emoj.native);
        setShowEmogiModal(false);
    };

    const newNewsFeedSend = (message: string) => {
        const meesageObj = {
            postText: `${message}`,
            status: "NEW",
            // To Do - Add Published, AlwaysTop and Shedule values to this keyss
            isPublished: true,
            isAlwaysTop: true,
            scheduleStartAt: "2021-06-09T08:38:58.127Z",
            scheduleEndAt: "2021-06-09T08:38:58.127Z",
            container: `api/containers/${container}`,
            mediaFileNames: [imageFileName, videoFileName.fileName],
        };

        const messageToPost = JSON.stringify(meesageObj);

        NewsfeedApi.postNewsfeed<any, any>(messageToPost).then(
            ({ response, errorMessage }) => {
                if (response) {
                    addNewsfeedObject(response);
                    setImageFileName("");
                    setImageBlob([]);
                    setVideoFileName("");
                    setVideoFile([]);
                }
                if (errorMessage) {
                    errorToast(errorMessage);
                }
            }
        );
    };

    const sendData = () => {
        newNewsFeedSend(data);
        setData("");
        setOpenVideo(false);
    };

    const uploadImage = async () => {
        const fd = new FormData();
        fd.set("file", imageBlob[0], imageFileName);
        fd.set("fileType", "NEWSFEED_MEDIA");
        fd.set("container", `${container}`);

        return UploadAPI.createResource<Upload, FormData>(fd).then(
            ({ errorMessage, response }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                }
                if (response) {
                    setImageFileName(response.fileName);
                }
                successToast("Image uploaded");
                settOpenImage(false);
            }
        );
    };

    const uploadVideo = async () => {
        const fd = new FormData();
        fd.set("file", videoFile[0], videoFile[0].name);
        fd.set("fileType", "NEWSFEED_MEDIA");
        fd.set("container", `${container}`);

        return UploadAPI.createResource<Upload, FormData>(fd).then(
            ({ errorMessage, response }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                }
                if (response) {
                    setVideoFileName(response);
                }
                successToast("Video uploaded");
                setOpenVideo(false);
            }
        );
    };

    return (
        <div className="app-feed-adder-wrapper">
            <Form.Group {...groupProps}>
                <Form.Control
                    as="textarea"
                    rows={rows}
                    value={data}
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e);
                        }
                        setData(e.target.value);
                    }}
                />

                <div
                    ref={wrapperRef}
                    className="app-feed-adder--additional-parametres"
                >
                    <div className="app-feed-adder--additional-parametres--links-preview"></div>

                    <div className="picker-wrapper">
                        <AppButton
                            className="sent-btn sent-btn--emoji"
                            variant="secondary"
                            onClick={() => setShowEmogiModal(true)}
                        >
                            <i className="far fa-smile smile-icon"></i>
                        </AppButton>

                        <Picker
                            onSelect={addEmoji}
                            style={
                                !showEmogiModal
                                    ? { display: "none" }
                                    : {
                                          display: "block",
                                          position: "absolute",
                                          top: 100,
                                          zIndex: 2,
                                      }
                            }
                        />

                        <div className="post-comment">
                            <AppButton
                                className="sent-btn sent-btn--add"
                                variant="light"
                                onClick={() => {
                                    setOpenVideo(true);
                                }}
                            >
                                <i className="far fa-video-plus"></i>
                                Add Video
                            </AppButton>

                            <AppButton
                                className="sent-btn sent-btn--add"
                                variant="light"
                                onClick={() => settOpenImage(true)}
                            >
                                <i className="fas fa-image"></i>
                                Add Image
                            </AppButton>
                            <span className="btn-separator">|</span>
                            <AppButton
                                className="sent-btn"
                                variant="light"
                                onClick={sendData}
                                disabled={data.length === 0 && true}
                            >
                                Post
                            </AppButton>
                        </div>
                    </div>
                </div>
            </Form.Group>
            <p>{imageFileName && `Image: ${imageFileName}`}</p>
            <p>{videoFileName && `Video: ${videoFileName.fileName}`}</p>
            <div className="app-feed-settings">
                <span className="app-feed-settings--info">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                    Type less than 250 characters and no photo to make your post
                    highlighted with background
                </span>
                <div className="app-feed-settings--images">
                    {openImage && (
                        <>
                            <Row className="d-flex justify-content-end mr-1">
                                <AppButton
                                    onClick={uploadImage}
                                    disabled={imageFileName === "" && true}
                                    className="mt-3 mb-3 d-flex justify-content-end"
                                >
                                    Upload Image
                                </AppButton>
                            </Row>
                            <AppUploader
                                withCropper
                                accept="image/*"
                                onFileSelect={(files) => {
                                    setImageData(files);
                                }}
                                fileInfo={
                                    FILETYPEINFO_NEWSFEED_MEDIA as FileTypeInfo
                                }
                            />
                        </>
                    )}
                </div>
                <div className="app-feed-settings--videos">
                    {openVideo && (
                        <>
                            <Row className="d-flex justify-content-end mr-1">
                                <AppButton
                                    onClick={uploadVideo}
                                    disabled={videoFile.length === 0 && true}
                                    className="mt-3 mb-3 d-flex justify-content-end"
                                >
                                    Upload Video
                                </AppButton>
                            </Row>
                            <AppUploader
                                accept="video/*"
                                onFileSelect={(video) => {
                                    setVideoFile(video);
                                }}
                                fileInfo={
                                    FILETYPEINFO_NEWSFEED_MEDIA as FileTypeInfo
                                }
                            />
                        </>
                    )}
                </div>

                <AppButton
                    className="admin-btn"
                    variant="light"
                    onClick={() => setCollapseSettings(!collaspseSettings)}
                >
                    Admin Settings
                    <i
                        className={`fal fa-angle-up ${
                            collaspseSettings && "rotate-angle"
                        }`}
                    ></i>
                </AppButton>

                {collaspseSettings && (
                    <Row className="app-feed-settings--main">
                        <Col
                            md={6}
                            sm={12}
                            className="app-feed-settings--column"
                        >
                            <AppFormSwitch
                                xl={12}
                                lg={12}
                                md={12}
                                label="Allow Comments"
                                name="Allow Comments"
                                control={control}
                            />
                            <AppFormSwitch
                                xl={12}
                                lg={12}
                                md={12}
                                label="Moderate Comments"
                                name="Moderate Comments"
                                control={control}
                            />
                        </Col>
                        <Col md={6} sm={12}>
                            <AppFormSwitch
                                xl={12}
                                lg={12}
                                md={12}
                                label="Keep In Draft"
                                name="Keep In Draft"
                                control={control}
                            />
                            <AppFormSwitch
                                xl={12}
                                lg={12}
                                md={12}
                                label="Show this post always on top"
                                name="Show this post always on top"
                                control={control}
                            />
                        </Col>
                        <Col lg={6}>
                            <span className="app-feed-settings--schedule">
                                Schedule post
                            </span>
                            <AppDatePicker
                                name="Schedule post"
                                control={control}
                            />
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
};
