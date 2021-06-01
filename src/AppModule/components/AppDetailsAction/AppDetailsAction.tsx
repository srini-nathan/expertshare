import React, { FunctionComponent, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import DefaultAvatar from "./assets/images/default-avatar.png";
import GreateGroup from "./assets/images/greate-group.svg";
import "./assets/scss/style.scss";

export interface AppDetailsActionProps {
    defaultAvatar?: string;
    newMessagesCount?: number;
    avatarImg?: string;
    isPTOP?: boolean;
    group?: boolean;
    handleHidePTOPMessages?: () => void;
    handleCloseMessages: () => void;
}
export const AppDetailsAction: FunctionComponent<AppDetailsActionProps> = ({
    defaultAvatar = DefaultAvatar,
    newMessagesCount = 0,
    avatarImg,
    isPTOP,
    handleHidePTOPMessages,
    handleCloseMessages,
    group,
}) => {
    const [rotateBtn, setRotateBtn] = useState(false);

    const handleCloseWindow = () => {
        if (!isPTOP) {
            handleCloseMessages();
        }
    };

    const handleHideWindow = () => {
        if (!isPTOP) {
            if (handleHidePTOPMessages) {
                handleHidePTOPMessages();
            }
            setRotateBtn(!rotateBtn);
        }
    };

    return (
        <Row className="m-0 px-3 pt-3 pb-2">
            <Col className="details col-auto p-0">
                <div className="details--content">
                    <i
                        className={`details--content--profile ${
                            group && "no-after"
                        }`}
                        style={{
                            backgroundImage: `url(${
                                group ? GreateGroup : avatarImg || defaultAvatar
                            })`,
                        }}
                    ></i>
                    {!isPTOP ? (
                        <h2 className="details--content--title">
                            {group ? "Create Group" : "Messages"}
                            {newMessagesCount > 0 && (
                                <span className="details--content--title--count">
                                    {newMessagesCount}
                                </span>
                            )}
                        </h2>
                    ) : (
                        <div className="name pl-2">
                            <div className="name--sender">
                                <h3>Jane Cooper</h3>
                            </div>
                            <div className="name--comment">
                                <span>Product Development @Snapchat</span>
                            </div>
                        </div>
                    )}
                </div>
            </Col>
            <Col className="action col-auto p-0 mr-0 ml-auto">
                <Row className="row m-0 p-0">
                    <Col
                        className="btn-collapse col-auto p-0"
                        id="btn-collapse-index"
                    >
                        <Button
                            variant="link"
                            onClick={
                                group ? handleCloseWindow : handleHideWindow
                            }
                        >
                            <i
                                className={`fas fa-chevron-down ${
                                    rotateBtn ? "rotate" : ""
                                }`}
                            ></i>
                        </Button>
                    </Col>

                    {!group && (
                        <Col
                            className="btn-close col-auto px-1 p-0 pl-2"
                            id="btn-close-index"
                        >
                            <Button variant="link" onClick={handleCloseWindow}>
                                <i className="fas fa-times"></i>
                            </Button>
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
};
