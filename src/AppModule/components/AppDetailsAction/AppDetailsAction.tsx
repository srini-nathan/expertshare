import React, { FunctionComponent, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { AppСhoseMethodMessage } from "../AppСhoseMethodMessage";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import UserAvatar from "../../assets/images/user-avatar.png";
import { CONSTANTS } from "../../../config";
import {
    useBuildAssetPath,
    useAuthState,
    useIsGranted,
    useDateTime,
} from "../../hooks";
import { FileTypeInfo } from "../../models";
import { getDateTimeWithoutTimezone } from "../../utils";
<<<<<<< HEAD
=======
import { useGlobalData } from "../../contexts";
import { useCustomParseDate } from "../../../helpers/useCustomParseDate";
>>>>>>> b4532205 (created function for rendering time/date in consistent way)

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
    handleCloseMessages?: () => void;
    handleLike?: () => void;
    handleAnswerMessage?: (message: string, questionId: number) => void;
    handleDeleteQuestion?: (questionId: number) => void;
    updateMessage?: (message: string, questionId: number) => void;
    showShareBtn?: boolean;
    children?: JSX.Element[] | JSX.Element;
    questionId?: number;
    userObj?: any;
    isChild?: boolean;
    commentMessage?: string;
    createdAt?: string;
}
export const AppDetailsAction: FunctionComponent<AppDetailsActionProps> = ({
    addComment = false,
    // handleLike,
    handleAnswerMessage,
    handleDeleteQuestion,
    updateMessage,
    showShareBtn,
    children,
    questionId,
    userObj,
    isChild = false,
    commentMessage = "",
    createdAt = "",
}) => {
    const { customParse } = useCustomParseDate();
    const { user } = useAuthState();
    const userProfilePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        userObj.imageName
    );

    const isGrantedControl = useIsGranted(ROLE_SPEAKER);

    const style = userObj.imageName
        ? {
              backgroundImage: `url(${userProfilePath})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          }
        : {
              backgroundImage: `url(${UserAvatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
          };

    const [openMessageArea, setOpenMessageArea] = useState<boolean>(false);
    const [openEditArea, setOpenEditArea] = useState(false);
    const { toLongDateTime } = useDateTime();

    const qId = questionId;

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

    return (
        <div className="session-details-question--container--item pb-3">
            <Row className="row m-0 p-0">
                <Col className="session-details-question--container--item--profile col-auto px-0 pb-2">
                    <Row className="row m-0 p-0">
                        <div className="cont">
                            <div className="avatar-profile col-auto p-0">
                                <i
                                    className="avatar-profile--pic"
                                    style={style}
                                ></i>
                            </div>
                            <div className="det-profile col-md-auto pl-2">
                                <div className="det-profile--name">
                                    {userObj &&
                                        `${userObj.firstName} ${userObj.lastName}`}
                                </div>
                                <div className="det-profile--time">
<<<<<<< HEAD
                                    {toLongDateTime(
                                        getDateTimeWithoutTimezone(createdAt)
=======
                                    {customParse(
                                        getDateTimeWithoutTimezone(createdAt),
                                        getDateFormat()
>>>>>>> b4532205 (created function for rendering time/date in consistent way)
                                    )}
                                </div>
                            </div>
                        </div>
                    </Row>
                </Col>
                <Col className="session-details-question--container--item--action col-auto mr-0 ml-auto px-0 pb-2">
                    {addComment && showShareBtn && isGrantedControl && (
                        <AppButton
                            variant="secondary"
                            onClick={handleAnswer}
                            className="reply-btn active ml-2"
                        >
                            <i className={`fak fa-reply  `}></i>
                        </AppButton>
                    )}
                    {((user && user.id === userObj.id) || isGrantedControl) && (
                        <>
                            <AppButton
                                variant="secondary"
                                onClick={editQuestion}
                                className="edit-btn active ml-2"
                            >
                                <i className="fak fa-pen-regular"></i>
                            </AppButton>
                            <AppButton
                                variant="secondary"
                                className="delete-btn active ml-2"
                                onClick={deleteQuestion}
                            >
                                <i className="fak fa-trash-light"></i>
                            </AppButton>
                        </>
                        /* <Button variant="link" onClick={handleLike}>
                                <i className="far fa-heart"></i>
                            </Button> */
                    )}
                </Col>
            </Row>
            <Row className="m-0 p-0">
                {addComment && (
                    <>
                        <div className="session-details-question--container--item--text-box col-12 px-0 pb-2">
                            <div
                                className={`session-details-question--container--item--text-box--container ${
                                    isChild && " is-child"
                                }`}
                            >
                                {children}
                            </div>
                        </div>
                        <div className="session-details-question--container--item--reply--container">
                            {openMessageArea && (
                                <AppСhoseMethodMessage
                                    activeTab="Text"
                                    className="ptop-messages"
                                    rows={2}
                                    enterToPost
                                    editMessage={commentMessage}
                                    handleMessageSend={answerMessage}
                                />
                            )}

                            {openEditArea && (
                                <AppСhoseMethodMessage
                                    activeTab="Text"
                                    className="ptop-messages"
                                    isEdit
                                    editMessage={commentMessage}
                                    rows={2}
                                    enterToPost
                                    handleMessageSend={answerMessage}
                                    handleUpdateMessage={patchMessage}
                                />
                            )}
                        </div>
                    </>
                )}
            </Row>
        </div>
    );
};
