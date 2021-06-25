import React, { FC, useState, useEffect } from "react";
import {
    AppLoader,
    AppMessageInboxHeader,
    AppMessageInboxFilters,
    AppMessageInboxThread,
} from "../../components";
import { useAuthState, useInitChat, useInitChatBox } from "../../hooks";
import { User } from "../../../AdminModule/models";

import "./assets/scss/style.scss";

export const AppMessageInbox: FC = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const { getAttendeeList } = useInitChatBox();
    const { startChat } = useInitChat();
    const { user, containerId } = useAuthState();

    useEffect(() => {
        setLoading(true);
        getAttendeeList(1, {
            "container.id": containerId,
        })
            .then(({ response }) => {
                if (response && response.items) {
                    setUsers(
                        response.items.filter(
                            (attendee) =>
                                attendee.id !== user.id &&
                                attendee.isAllowCommunication
                        )
                    );
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
                            users.map((u: User) => (
                                <AppMessageInboxThread
                                    key={u.id}
                                    user={u}
                                    onClick={() => {
                                        if (user.id) {
                                            startChat(
                                                user.id,
                                                u.id,
                                                containerId
                                            );
                                        }
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
