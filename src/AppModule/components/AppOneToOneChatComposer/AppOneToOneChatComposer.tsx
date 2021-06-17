import React, { FC, useState } from "react";

export interface AppOneToOneChatComposerProps {
    onTypingAction: (txt: string) => void;
    onSendAction: (txt: string) => void;
}

export const AppOneToOneChatComposer: FC<AppOneToOneChatComposerProps> = ({
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
                            <a href="#" className="char--a col-auto p-0">
                                <i>A</i>
                            </a>
                            <a href="#" className="char--smile col-auto p-0">
                                <i className="fak fa-smile-light"></i>
                            </a>
                        </div>
                    </div>
                    <input
                        placeholder="Wirte your message ..."
                        type="text"
                        onInput={(e) => {
                            setData(e.currentTarget.value);
                            onTypingAction(e.currentTarget.value);
                        }}
                    />
                    <a
                        href="#"
                        className="send"
                        onClick={() => {
                            onSendAction(data);
                        }}
                    >
                        Send
                    </a>
                </div>
            </div>
        </div>
    );
};
