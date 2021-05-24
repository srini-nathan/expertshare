import React, { FunctionComponent } from "react";
import { ListGroup } from "react-bootstrap";
import "./assets/scss/style.scss";

export interface MessageItemProps {
    id: string;
    name: string;
    imageURL: string;
    newMessages: number;
    message: string;
    lastMessageTime: string;
    online: boolean;
    messageIdHandler: (m: string) => void;
}
export const AppMessageItem: FunctionComponent<MessageItemProps> = ({
    id,
    name,
    imageURL,
    newMessages,
    lastMessageTime,
    message,
    messageIdHandler,
}) => {
    const handleMessageClick = (event: any) => {
        // eslint-disable-next-line no-console
        console.log(event.currentTarget.getAttribute("data-rb-event-key"));
        messageIdHandler(event.currentTarget.getAttribute("data-rb-event-key"));
    };

    return (
        <ListGroup.Item
            action
            className="message-container"
            eventKey={id}
            onClick={(event) => handleMessageClick(event)}
        >
            <div className="content">
                <div className="avatar">
                    <i
                        style={{
                            backgroundImage: `url(${imageURL})`,
                        }}
                    ></i>
                </div>
                <div className="details pl-2">
                    <div className="details--sender">
                        <h3>
                            {name}
                            <span className="time">{lastMessageTime}</span>
                        </h3>
                    </div>
                    <div className="details--comment">
                        <p>{message}</p>
                    </div>
                </div>
            </div>
            {newMessages > 0 && (
                <div className="count">
                    <span>{newMessages}</span>
                </div>
            )}
        </ListGroup.Item>
    );
};
