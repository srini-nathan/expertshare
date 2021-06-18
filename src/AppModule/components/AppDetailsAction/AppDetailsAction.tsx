import React, { FunctionComponent, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import { AppButton } from "../AppButton";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";
import UserAvatar from "../../assets/images/user-avatar.png";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath, useAuthState, useIsGranted } from "../../hooks";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD, Role: ROLE } = CONSTANTS;

const {
    ROLE: { ROLE_SPEAKER },
} = ROLE;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppDetailsActionProps {
    defaultAvatar?: string;
    newMessagesCount?: number;
    avatarImg?: string;
    isPTOP?: boolean;
    group?: boolean;
    addComment?: boolean;
    handleHidePTOPMessages?: () => void;
    handleCloseMessages: () => void;
    handleLike?: () => void;
    handleAnswerMessage?: (message: string, questionId: number) => void;
    handleDeleteQuestion?: (questionId: number) => void;
    updateMessage?: (message: string, questionId: number) => void;
    showShareBtn?: boolean;
    children?: JSX.Element[] | JSX.Element;
    questionId?: number;
    userObj?: any;
}
export const AppDetailsAction: FunctionComponent<AppDetailsActionProps> = ({
    newMessagesCount = 0,
    isPTOP,
    handleHidePTOPMessages,
    handleCloseMessages,
    group,
    addComment = false,
    // handleLike,
    handleAnswerMessage,
    handleDeleteQuestion,
    updateMessage,
    showShareBtn,
    children,
    questionId,
    userObj,
}) => {
    const { user } = useAuthState();
    const userProfilePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        userObj.imageName
    );
    const isGrantedControl = useIsGranted(ROLE_SPEAKER);

    const style = userObj.imageName
        ? {
              backgroundImage: `url(${userProfilePath})`,
          }
        : {
              backgroundImage: `url(${UserAvatar})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
          };

    const [rotateBtn, setRotateBtn] = useState(false);
    const [openMessageArea, setOpenMessageArea] = useState<boolean>(false);
    const [openEditArea, setOpenEditArea] = useState(false);

    const qId = questionId;

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

    const handleAnswer = () => {
        setOpenMessageArea(!openMessageArea);
    };

    const answerMessage = (message: string) => {
        if (handleAnswerMessage && qId) {
            handleAnswerMessage(message, qId);
        }
        setOpenMessageArea(false);
    };

    const deleteQuestion = () => {
        if (handleDeleteQuestion && qId) {
            handleDeleteQuestion(qId);
        }
    };

    const editQuestion = () => {
        setOpenEditArea(!openEditArea);
    };

    const patchMessage = (message: string) => {
        if (updateMessage && qId) {
            updateMessage(message, qId);
        }
        setOpenEditArea(false);
    };

    const [editMessage, setEditMessage] = useState<any>(children);

    useEffect(() => {
        setEditMessage(children);
    }, [children]);

    return (
        <>
            <Row className="m-0 px-3 pt-3 pb-2 first-row">
                <Col className="details col-auto p-0">
                    <div className="details--content">
                        <i
                            className={`details--content--profile ${
                                group && "no-after"
                            }`}
                            style={style}
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
                                    <h3>
                                        {userObj &&
                                            `${userObj.firstName} ${userObj.lastName}`}
                                    </h3>
                                </div>
                                <div className="name--comment">
                                    <span>
                                        {userObj.jobTitle && userObj.jobTitle}
                                        {userObj.jobTitle &&
                                            userObj.jobTitle !== "" &&
                                            userObj.company &&
                                            userObj.company !== "" &&
                                            ", "}
                                        {userObj.company && userObj.company}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
                <Col className="action col-auto p-0 mr-0 ml-auto">
                    {!addComment && (
                        <Row className="row m-0 p-0">
                            <Col
                                className="btn-collapse col-auto p-0"
                                id="btn-collapse-index"
                            >
                                <Button
                                    variant="link"
                                    onClick={
                                        group
                                            ? handleCloseWindow
                                            : handleHideWindow
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
                                    <Button
                                        variant="link"
                                        onClick={handleCloseWindow}
                                    >
                                        <i className="fas fa-times"></i>
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    )}

                    {addComment && (
                        <Row className="row m-0 p-0">
                            {showShareBtn && isGrantedControl && (
                                <Col
                                    className="btn-close col-auto px-1 p-0 pl-2"
                                    id="btn-close-index"
                                >
                                    <Button
                                        variant="secondary"
                                        onClick={handleAnswer}
                                        className=" mr-2"
                                    >
                                        <i
                                            className={`fak fa-reply ${
                                                openMessageArea && "active"
                                            }`}
                                        ></i>
                                    </Button>
                                </Col>
                            )}

                            {((user && user.id === userObj.id) ||
                                isGrantedControl) && (
                                <Col
                                    className="btn-collapse col-auto p-0"
                                    id="btn-collapse-index"
                                >
                                    <div className="btns-flex-questions">
                                        <AppButton
                                            variant="secondary"
                                            onClick={editQuestion}
                                            className={`edit-btn ${
                                                openEditArea && "active"
                                            }`}
                                        >
                                            <AppIcon
                                                className={`fas fa-edit ${
                                                    openEditArea && "active"
                                                }`}
                                                name="edit"
                                            />
                                        </AppButton>
                                        <AppButton
                                            variant="secondary"
                                            className="btn-delete"
                                            onClick={deleteQuestion}
                                        >
                                            <AppIcon
                                                className="mr-2 ml-2"
                                                name="delete"
                                            />
                                        </AppButton>
                                    </div>
                                    {/* <Button variant="link" onClick={handleLike}>
                                        <i className="far fa-heart"></i>
                                    </Button> */}
                                </Col>
                            )}
                        </Row>
                    )}
                </Col>
            </Row>
            {addComment && (
                <>
                    <div className="question-wrapper--question">{children}</div>
                    <div className="tabs-messages m-0 pt-1 pb-2">
                        {openMessageArea && (
                            <AppСhoseMethodMessage
                                activeTab="Text"
                                className="ptop-messages"
                                rows={2}
                                enterToPost
                                editMessage={editMessage}
                                handleMessageSend={answerMessage}
                            />
                        )}

                        {openEditArea && (
                            <AppСhoseMethodMessage
                                activeTab="Text"
                                className="ptop-messages"
                                isEdit
                                editMessage={editMessage}
                                rows={2}
                                enterToPost
                                handleMessageSend={answerMessage}
                                handleUpdateMessage={patchMessage}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
};
