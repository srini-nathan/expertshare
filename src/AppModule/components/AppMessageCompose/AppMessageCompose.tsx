import React, {
    ChangeEventHandler,
    FC,
    useState,
    useEffect,
    useRef,
} from "react";
import { Form } from "react-bootstrap";
import { Picker, BaseEmoji } from "emoji-mart";

import { AppFormElementProps } from "../../models";
import { AppButton } from "../AppButton";

import "emoji-mart/css/emoji-mart.css";
import "./assets/scss/style.scss";

export interface AppMessageComposeProps extends AppFormElementProps {
    isSend?: boolean;
    rows?: number;
    enterToPost?: boolean;
    isEdit?: boolean;
    editMessage?: any;
    handleDataSend: (message: any) => void;
    handleUpdateData?: (message: any) => void;
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
    handleUpdateData,
    isSend,
    editMessage,
    enterToPost,
    isEdit,
    ...props
}): JSX.Element => {
    const [data, setData] = useState<string>("");
    const controlId = id;
    const { className = "" } = props;
    const groupProps = { controlId, className };

    const [showEmogiModal, setShowEmogiModal] = useState(false);

    useEffect(() => {
        if (isEdit) {
            // eslint-disable-next-line no-console
            console.log(editMessage);
            setData(editMessage);
        }
    }, [editMessage]);

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

    const updateData = () => {
        if (handleUpdateData) {
            handleUpdateData(data);
        }
        setData("");
    };

    return (
        <div className={"text-box-container mt-3"}>
            <Form.Group {...groupProps}>
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
                    className={"text-box-container--options pb-1"}
                    ref={wrapperRef}
                >
                    <div className="row m-0 p-0">
                        <div className="text-box-container--options--char col-auto px-2">
                            <AppButton
                                className="sent-btn sent-btn--emoji smile-icon"
                                variant="light"
                                onClick={() => setShowEmogiModal(true)}
                            >
                                <i className="fak fa-smile-light"></i>
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

                        <div className="text-box-container--options--send col-auto px-2 mr-0 ml-auto">
                            {/* {enterToPost && (
                                <div className="comment">
                                    <Form.Check
                                        type="checkbox"
                                        id={`${Math.random()}`}
                                        label="Enter to post comment"
                                        className="checkbox"
                                    />
                                </div>
                            )} */}
                            <AppButton
                                className="btn-send"
                                variant="light"
                                onClick={isEdit ? updateData : sendData}
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
