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

import { AppFormElementProps } from "../../models";
import { AppUploader } from "../AppUploader";
import { AppFormSwitch } from "../AppFormSwitch";
import { AppDatePicker } from "../AppDatePicker";
import { AppButton } from "../AppButton";

import { NewsfeedApi } from "../../apis";
import { errorToast } from "../../utils";

import "emoji-mart/css/emoji-mart.css";
import "./assets/scss/style.scss";

export interface AppFeedAdderProps extends AppFormElementProps {
    isSend?: boolean;
    rows?: number;
    container: number;
    handleUpdateFeed: () => void;
    handleUpdateData?: (message: any) => void;
    onChange?: ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;
}

export const AppFeedAdder: FC<AppFeedAdderProps> = ({
    rows = 5,
    onChange,
    handleUpdateFeed,
    handleUpdateData,
    isSend,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>("");

    const { className = "", container } = props;
    const groupProps = { className, as: Col };

    const [showEmogiModal, setShowEmogiModal] = useState(false);
    const [collaspseSettings, setCollapseSettings] = useState<boolean>(false);
    const [openImage, settOpenImage] = useState<boolean>(false);
    const [openVideo, setOpenVideo] = useState<boolean>(false);

    const validationSchema = Yup.object().shape({});

    const { control } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    // eslint-disable-next-line no-console
    console.log(control);

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
            mediaFileNames: [],
        };

        const messageToPost = JSON.stringify(meesageObj);

        NewsfeedApi.postNewsfeed<any, any>(messageToPost).then(
            ({ response, errorMessage }) => {
                if (response) {
                    handleUpdateFeed();
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
        settOpenImage(false);
        setOpenVideo(false);
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
                            variant="light"
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
            <div className="app-feed-settings">
                <span className="app-feed-settings--info">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                    Type less than 250 characters and no photo to make your post
                    highlighted with background
                </span>
                <div className="app-feed-settings--images">
                    {openImage && (
                        <AppUploader
                            withCropper
                            accept="image/*"
                            onFileSelect={(files) => {
                                // eslint-disable-next-line no-console
                                console.log(files);
                            }}
                        />
                    )}
                </div>
                <div className="app-feed-settings--videos">
                    {openVideo && (
                        <AppUploader
                            accept="video/*"
                            onFileSelect={(files) => {
                                // eslint-disable-next-line no-console
                                console.log(files);
                            }}
                        />
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
                        <Col lg={5}>
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
