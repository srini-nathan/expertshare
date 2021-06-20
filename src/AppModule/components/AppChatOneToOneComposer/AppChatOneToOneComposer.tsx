import React, { FC, useState } from "react";
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
    return (
        <div className="row m-0 px-3 pt-1 pb-3 mb-0 mt-auto">
            <div className="insert col-auto p-0 w-100">
                <div className="insert--container">
                    <div className="char">
                        <div className="row m-0 p-0">
                            <a href="#" className="char--smile col-auto p-0">
                                <i className="fak fa-smile-light"></i>
                            </a>
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
        </div>
    );
};
