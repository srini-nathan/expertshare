import React, {
    ChangeEventHandler,
    FC,
    useState,
    useEffect,
    useRef,
} from "react";
import { Col, Form } from "react-bootstrap";
import { Picker, BaseEmoji } from "emoji-mart";

import { AppFormElementProps } from "../../models";
import { AppButton } from "../AppButton";

import "emoji-mart/css/emoji-mart.css";
import "./assets/scss/style.scss";

export interface AppMessageComposeProps extends AppFormElementProps {
    isSend?: boolean;
    rows?: number;
    enterToPost?: boolean;
    handleDataSend: (message: any) => void;
    onChange?: ChangeEventHandler<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;
}

export const AppMessageCompose: FC<AppMessageComposeProps> = ({
    id,
    placeholder,
    description,
    rows = 5,
    onChange,
    handleDataSend,
    isSend,
    enterToPost,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>("");
    const controlId = id;
    const { className = "" } = props;
    const groupProps = { controlId, className, as: Col };

    const [showEmogiModal, setShowEmogiModal] = useState(false);

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

    const sendData = () => {
        handleDataSend(data);
        setData("");
    };

    return (
        <div className={`${enterToPost && "message-compose-wrapper"}`}>
            <Form.Group {...groupProps}>
                <div className={`${enterToPost && "qa-area"}`}>
                    <Form.Control
                        as="textarea"
                        rows={rows}
                        value={data}
                        className={`${
                            enterToPost && "form-control-without-border"
                        }`}
                        onChange={(e) => {
                            if (onChange) {
                                onChange(e);
                            }
                            setData(e.target.value);
                        }}
                    />

                    <div
                        className={`is-send-wrapper ${
                            enterToPost && "wrapper-space-beetween"
                        }`}
                        ref={wrapperRef}
                    >
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
                                              top: 40,
                                              zIndex: 1,
                                          }
                                }
                            />
                        </div>

                        <div className="post-comment">
                            {enterToPost && (
                                <div className="comment">
                                    <Form.Check
                                        type="checkbox"
                                        id={`${Math.random()}`}
                                        label="Enter to post comment"
                                        className="checkbox"
                                    />
                                </div>
                            )}
                            <span className="btn-separator">|</span>
                            <AppButton
                                className="sent-btn"
                                variant="light"
                                onClick={sendData}
                                disabled={data.length === 0}
                            >
                                Send
                            </AppButton>
                        </div>
                    </div>
                </div>
            </Form.Group>
        </div>
    );
};
