import React, { FC, useState, useEffect } from "react";
import {
    AppLoader,
    AppMessageInboxHeader,
    AppMessageInboxFilters,
    AppMessageInboxThread,
} from "../../components";
import { useAuthState, useInitChatBox, useOpenChatOneToOne } from "../../hooks";
import { ChatThread } from "../../models/entities/ChatThread";

import "./assets/scss/style.scss";

export const AppMessageInbox: FC = () => {
    const [closed, setClosed] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { getThreads } = useInitChatBox();
    const [loading, setLoading] = useState(true);
    const { user } = useAuthState();
    const { set } = useOpenChatOneToOne();
    const [threads, setThreads] = useState<ChatThread[]>([]);

    useEffect(() => {
        if (closed === false) {
            setLoading(true);
            getThreads(1)
                .then(({ response }) => {
                    if (response && response.items) {
                        setThreads(response.items);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [closed]);

    if (closed === true) {
        return null;
    }

    return (
        <div
            className={`app-message-inbox--index ${
                collapsed ? "collapsed" : ""
            }`}
        >
            <div className="inner-container">
                <AppMessageInboxHeader
                    onCollapseAction={() => {
                        setCollapsed(!collapsed);
                    }}
                    onCloseAction={() => {
                        setClosed(true);
                    }}
                    newMsgCounter={10}
                    user={user}
                />
                <AppMessageInboxFilters />
                <div className="inner-container--message mt-2">
                    <div className="row m-0 p-0">
                        {loading ? (
                            <AppLoader />
                        ) : (
                            threads.map((t: ChatThread) => (
                                <AppMessageInboxThread
                                    key={t.id}
                                    thread={t}
                                    loginUser={user}
                                    onClick={() => {
                                        set(t);
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};