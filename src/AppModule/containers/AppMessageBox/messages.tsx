import React, { FC } from "react";
import { ListGroup, Row } from "react-bootstrap";
import { AppTabs, AppTab, AppMessageItem } from "../../components";

import "./assets/scss/style.scss";

export interface MessagestProps {
    activeTab: string;
    data: any;
    handleGroupClicked: () => void;
}

export interface AppMessageProps {
    message: any;
    group?: boolean;
}

export const Messages: FC<MessagestProps> = ({
    activeTab,
    data,
    handleGroupClicked,
}): JSX.Element => {
    const [activeTabMessage, setActiveTabMessage] = React.useState<string>(
        activeTab
    );

    const setActiveMessage = (tab: any) => {
        setActiveTabMessage(tab);
        if (tab === "Group") {
            setActiveTabMessage("Chat");
            handleGroupClicked();
        }
    };

    const AppMessageItems: FC<AppMessageProps> = ({ message, group }: any) => {
        // eslint-disable-next-line no-console
        return (
            <AppMessageItem
                id={message.id}
                name={message.name}
                imageURL={message.imageURL}
                newMessages={message.lastMessage.newMessages}
                message={message.lastMessage.message}
                lastMessageTime={message.lastMessage.time}
                online={message.lastMessage.online}
                messageIdHandler={() => {}}
                group={group}
            />
        );
    };

    return (
        <AppTabs
            onSelect={(tab: any) => setActiveMessage(tab)}
            activeKey={activeTabMessage}
        >
            <AppTab eventKey="Chat" title="Chat">
                <div className="message mt-2">
                    <ListGroup>
                        {data.messages.map((message: any) => (
                            <AppMessageItems message={message} />
                        ))}
                    </ListGroup>
                </div>
            </AppTab>
            <AppTab eventKey="Online Now" title="Online Now">
                <div className="message mt-2">
                    <Row className="m-0 p-0">
                        {data.messages.map((message: any) => (
                            <AppMessageItems message={message} />
                        ))}
                    </Row>
                </div>
            </AppTab>
            <AppTab eventKey="Group" title="Group" />
        </AppTabs>
    );
};
