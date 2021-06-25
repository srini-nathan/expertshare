import React, { FC, useState, useRef } from "react";
import { Overlay } from "react-bootstrap";
import { Picker, BaseEmoji } from "emoji-mart";
import { AppButton } from "../AppButton";

export interface AppChatOneToOneComposerProps {
    onTypingAction: (txt: string) => void;
    onSendAction: (txt: string) => void;
}

export const AppChatOneToOneComposer: FC<AppChatOneToOneComposerProps> = ({
    onTypingAction,
    onSendAction,
}) => {
    const [data, setData] = useState<string>("");
    const [showModal, toggleModal] = useState<boolean>(false);
    const target = useRef(null);

    return (
        <div className="row m-0 px-3 pt-1 pb-3 mb-0 mt-auto">
            <div className="insert col-auto p-0 w-100">
                <div className="insert--container">
                    <div className="char">
                        <div className="row m-0 p-0">
                            <span
                                className="char--smile col-auto p-0"
                                onClick={() => {
                                    toggleModal(!showModal);
                                }}
                                ref={target}
                            >
                                <i className="fak fa-smile-light"></i>
                            </span>
                        </div>
                    </div>
                    <input
                        name="msg-composer"
                        placeholder="Write your message ..."
                        value={data}
                        type="text"
                        onChange={(e) => {
                            setData(e.currentTarget.value);
                            onTypingAction(e.currentTarget.value);
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                onSendAction(data);
                                setData("");
                            }
                        }}
                    />
                    <AppButton
                        className={"btn-send"}
                        variant={"link"}
                        disabled={data.length === 0}
                        onClick={() => {
                            if (data.length > 0) {
                                onSendAction(data);
                                setData("");
                            }
                        }}
                    >
                        Send
                    </AppButton>
                </div>
            </div>
            <Overlay
                target={target.current}
                placement={"top-start"}
                show={showModal}
            >
                <Picker
                    onSelect={(e: BaseEmoji) => {
                        if (data !== "") {
                            setData(`${data} ${e.native}`);
                        } else {
                            setData(e.native);
                        }
                        toggleModal(false);
                    }}
                    style={{
                        zIndex: 99999999999,
                    }}
                />
            </Overlay>
        </div>
    );
};
