import React, { FunctionComponent } from "react";
import { ListGroup } from "react-bootstrap";
import { AppButton } from "../AppButton";
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
    group: boolean;
    active?: boolean;
}
export const AppMessageItem: FunctionComponent<MessageItemProps> = ({
    id,
    name,
    imageURL,
    newMessages,
    lastMessageTime,
    message,
    messageIdHandler,
    group,
    active,
}) => {
    const handleMessageClick = (event: any) => {
        messageIdHandler(event.currentTarget.getAttribute("data-rb-event-key"));
    };

    const groupOrButtonRender = (g: boolean) => {
        if (g) {
            return (
                <AppButton className="more" variant="light">
                    <i className="fal fa-plus-circle btn-icon"></i>
                </AppButton>
            );
        }
        return (
            <AppButton className="more" variant="light">
                <i className="fas fa-ellipsis-h btn-icon"></i>
            </AppButton>
        );
    };

    return (
        <ListGroup.Item
            disabled={active && true}
            action
            className="message-group-container"
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
            {!group && newMessages > 0 ? (
                <div className="count">
                    <span>{newMessages}</span>
                </div>
            ) : (
                groupOrButtonRender(group)
            )}
        </ListGroup.Item>
    );
};
