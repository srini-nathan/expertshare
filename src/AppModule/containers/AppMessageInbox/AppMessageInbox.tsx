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
    const [collapsed, setCollapsed] = useState(true);
    const { getThreads } = useInitChatBox();
    const [loading, setLoading] = useState(true);
    const { user } = useAuthState();
    const { set } = useOpenChatOneToOne();
    const [threads, setThreads] = useState<ChatThread[]>([]);

    useEffect(() => {
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
    }, []);

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
                    newMsgCounter={0}
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
