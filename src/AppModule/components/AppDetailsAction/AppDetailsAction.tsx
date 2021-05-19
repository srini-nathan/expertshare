import React, { FunctionComponent } from "react";
import { Row, Col, Button } from "react-bootstrap";
import DefaultAvatar from "./assets/images/default-avatar.png";
import "./assets/scss/style.scss";

export interface AppDetailsActionProps {
    defaultAvatar?: string;
    newMessagesCount?: number;
    avatarImg?: string;
}
export const AppDetailsAction: FunctionComponent<AppDetailsActionProps> = ({
    defaultAvatar = DefaultAvatar,
    newMessagesCount = 0,
    avatarImg,
}) => {
    return (
        <Row className="m-0 px-3 pt-3 pb-2">
            <Col className="details col-auto p-0">
                <div className="details--content">
                    <i
                        className="details--content--profile"
                        style={{
                            backgroundImage: `url(${
                                avatarImg || defaultAvatar
                            })`,
                        }}
                    ></i>
                    <h2 className="details--content--title">
                        Messages
                        {newMessagesCount > 0 && (
                            <span className="details--content--title--count">
                                {newMessagesCount}
                            </span>
                        )}
                    </h2>
                </div>
            </Col>
            <Col className="action col-auto p-0 mr-0 ml-auto">
                <Row className="row m-0 p-0">
                    <Col
                        className="btn-collapse col-auto p-0"
                        id="btn-collapse-index"
                    >
                        <Button variant="link">
                            <i className="fak fa-chevron-down"></i>
                        </Button>
                    </Col>
                    <Col
                        className="btn-close col-auto px-1 p-0 pl-2"
                        id="btn-close-index"
                    >
                        <Button variant="link">
                            <i className="fak fa-times-light"></i>
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};
