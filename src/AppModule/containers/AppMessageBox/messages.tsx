import React, { FC } from "react";
import { ListGroup, Row } from "react-bootstrap";
import { AppTabs, AppTab, AppMessageItem } from "../../components";

import "./assets/scss/style.scss";

export interface MessagestProps {
    activeTab: string;
    data: any;
}

export const Messages: FC<MessagestProps> = ({
    activeTab,
    data,
}): JSX.Element => {
    const [activeTabMessage, setActiveTabMessage] = React.useState<string>(
        activeTab
    );

    const AppMessageItems: FC<any> = ({ message }: any) => {
        // eslint-disable-next-line no-console
        return (
            <AppMessageItem
                id={message.id}
                name={message.name}
                imageURL={message.imageURL}
                newMessages={message.lastMessage}
                message={message.lastMessage.message}
                lastMessageTime={message.lastMessage.time}
                online={message.lastMessage.online}
                messageIdHandler={() => {}}
            />
        );
    };

    return (
        <AppTabs onSelect={setActiveTabMessage} activeKey={activeTabMessage}>
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
            <AppTab eventKey="Group" title="Group">
                <div className="message mt-2">
                    <Row className="m-0 p-0">
                        {data.messages.map((message: any) => (
                            <AppMessageItems message={message} />
                        ))}
                    </Row>
                </div>
            </AppTab>
        </AppTabs>
    );
};
