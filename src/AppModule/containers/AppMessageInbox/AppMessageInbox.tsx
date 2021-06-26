import React, { FC, useState, useEffect, useRef } from "react";
import { Canceler } from "axios";
import {
    AppLoader,
    AppMessageInboxHeader,
    AppMessageInboxFilters,
    AppMessageInboxThread,
} from "../../components";
import { useAuthState, useInitChat, useInitChatBox } from "../../hooks";
import { User } from "../../../AdminModule/models";
import { UserApi } from "../../../AdminModule/apis";
import "./assets/scss/style.scss";
import { PrimitiveObject } from "../../models";

export const AppMessageInbox: FC = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [rm, setRm] = useState<User>();
    const [loadingRm, setLoadingRm] = useState(true);
    const { getAttendeeList } = useInitChatBox();
    const { startChat } = useInitChat();
    const { user, containerId, relationManagerId } = useAuthState();
    const [page] = useState<number>(1);
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

    useEffect(() => {
        if (relationManagerId !== null) {
            UserApi.getAttendeeView<User>(relationManagerId)
                .then(({ response }) => {
                    if (response) {
                        setRm(response);
                        setUsers([response, ...users]);
                    }
                })
                .finally(() => {
                    setLoadingRm(false);
                });
        } else {
            setLoadingRm(false);
        }
    }, [relationManagerId]);

    function fetchData(searchParams: PrimitiveObject = {}) {
        setLoading(true);
        getAttendeeList(
            page,
            {
                "container.id": containerId,
                ...searchParams,
            },
            (c) => {
                cancelTokenSourcesRef.current.push(c);
            }
        )
            .then(({ response }) => {
                if (response && response.items) {
                    const filteredUsers = response.items.filter(
                        (attendee) =>
                            attendee.id !== user.id &&
                            attendee.isAllowCommunication
                    );
                    if (rm) {
                        setUsers([rm, ...filteredUsers]);
                    } else {
                        setUsers(filteredUsers);
                    }
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchData();
    }, [rm]);

    async function handleFilter(search: string) {
        fetchData({
            user_search: search,
        });
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
                    newMsgCounter={0}
                    user={user}
                />
                <AppMessageInboxFilters
                    onQuickFilterChange={handleFilter}
                    cancelTokenSources={cancelTokenSourcesRef.current}
                />
                <div className="inner-container--message mt-2">
                    <div className="row m-0 p-0">
                        {loading || loadingRm ? (
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
