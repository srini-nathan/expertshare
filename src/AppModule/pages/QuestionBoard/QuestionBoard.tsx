import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { isString as _isString, orderBy } from "lodash";
import { socket, EVENTS } from "../../socket";
import {
    useBuildAssetPath,
    useDateTime,
    useAskSpeakerSocketEvents,
    useAuthState,
} from "../../hooks";
import {
    AppPageHeader,
    AppLoader,
    AppModal,
    AppMessageCompose,
} from "../../components";
import { SessionQuestionApi } from "../../apis";
import {
    errorToast,
    successToast,
    getBGStyle,
    getDateTimeWithoutTimezone,
    parseIdFromResourceUrl,
} from "../../utils";
import { SessionQuestion } from "../../models/entities/SessionQuestion";
import { CONSTANTS, UserProfileFileInfo } from "../../../config";
import placeholder from "../../assets/images/user-avatar.png";
import { PUser } from "../../../AdminModule/models";

import "./assets/scss/style.scss";
import "./assets/scss/_common.scss";

type PAskSpeakerQuestion = SessionQuestion;

const { SessionQuestion: STATUS } = CONSTANTS;

const {
    ON_NEW_ASK_SPEAKER,
    ON_DELETE_ASK_SPEAKER,
    ON_EDIT_ASK_SPEAKER,
} = EVENTS;

const {
    STATUS: { STATUS_NEW, STATUS_ACCEPTED, STATUS_REJECTED },
} = STATUS;

function createCore() {
    let stateContainer: any[] = [];

    const addNewQuestion = (newState: any, setter: any) => {
        stateContainer = [newState, ...stateContainer];
        setter(stateContainer);
    };

    const createState = (newState: any, setter: any) => {
        stateContainer = newState;
        setter(stateContainer);
    };

    const deleteQuestion = (id: any, setter: any) => {
        stateContainer = stateContainer.filter((e) => e.id !== id);
        setter(stateContainer);
    };

    const editQuestion = (newState: any, setter: any) => {
        stateContainer = stateContainer.map((e) => {
            if (e.id === newState.id) {
                return newState;
            }
            return e;
        });
        setter(stateContainer);
    };

    return {
        getState: () => stateContainer,
        addNewQuestion,
        createState,
        deleteQuestion,
        editQuestion,
    };
}
const core = createCore();

const QuestionActions = ({
    t,
    status,
    isReplyed,
    updateQuestionStatus,
    qId,
    setShowDelete,
    editQuestionMode,
    setEditQuestionMode,
}) => {
    return editQuestionMode === qId ? (
        <div className="row px-2">
            <div
                className={`question-item--content--action--button cancel col-12 col-sm-6 col-md-12 py-2 px-2 ${
                    editQuestionMode ? "col-xl-12 are" : "col-xl-6 na"
                }`}
            >
                <a
                    className="btn btn-secondary"
                    onClick={() => setEditQuestionMode(null)}
                >
                    {t("questionboard.list:status.edit.cancel")}
                    <i className="fak fa-times-light" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    ) : (
        <div className="row px-2">
            {(status !== STATUS_NEW || isReplyed) && (
                <div className="question-item--content--action--button new col-12 col-sm-6 col-md-12 col-xl-6 py-2 px-2">
                    <a
                        className="btn btn-secondary"
                        onClick={() => updateQuestionStatus(qId, STATUS_NEW)}
                    >
                        {t("questionboard.list:status.new")}
                        <i
                            className="fak fa-check-light"
                            aria-hidden="true"
                        ></i>
                    </a>
                </div>
            )}
            {(status !== STATUS_ACCEPTED || isReplyed) && (
                <div className="question-item--content--action--button approve col-12 col-sm-6 col-md-12 col-xl-6 py-2 px-2">
                    <a
                        className="btn btn-secondary"
                        onClick={() =>
                            updateQuestionStatus(qId, STATUS_ACCEPTED)
                        }
                    >
                        {t("questionboard.list:status.approve")}
                        <i
                            className="fak fa-check-light"
                            aria-hidden="true"
                        ></i>
                    </a>
                </div>
            )}

            {(status !== STATUS_REJECTED || isReplyed) && (
                <div className="question-item--content--action--button reject col-12 col-sm-6 col-md-12 col-xl-6 py-2 px-2">
                    <a
                        className="btn btn-secondary"
                        onClick={() =>
                            updateQuestionStatus(qId, STATUS_REJECTED)
                        }
                    >
                        {t("questionboard.list:status.reject")}
                        <i
                            className="fak fa-times-light"
                            aria-hidden="true"
                        ></i>
                    </a>
                </div>
            )}
            {!isReplyed && (
                <div className="question-item--content--action--button approve col-12 col-sm-6 col-md-12 col-xl-6 py-2 px-2">
                    <a
                        className="btn btn-secondary"
                        onClick={() => updateQuestionStatus(qId, "ANSWERED")}
                    >
                        {t("questionboard.list:status.answered")}
                        <i
                            className="fak fa-check-light"
                            aria-hidden="true"
                        ></i>
                    </a>
                </div>
            )}
            <div className="question-item--content--action--button delete col-12 col-sm-6 col-md-12 col-xl-6 py-2 px-2">
                <a
                    className="btn btn-secondary"
                    onClick={() => setShowDelete(qId)}
                >
                    {t("questionboard.list:status.delete")}
                    <i className="fak fa-trash-light" aria-hidden="true"></i>
                </a>
            </div>
            <div className="question-item--content--action--button edit col-12 col-sm-6 col-md-12 col-xl-6 py-2 px-2">
                <a
                    className={
                        editQuestionMode
                            ? "btn btn-secondary disabled"
                            : "btn btn-secondary"
                    }
                    onClick={() =>
                        !editQuestionMode ? setEditQuestionMode(qId) : null
                    }
                >
                    {t("questionboard.list:status.edit")}
                    <i className="fak fa-pen-regular" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    );
};
const QuestionCard = ({
    status,
    questions,
    searchText,
    setQuestions,
    emitEditAskSpeaker,
    setShowDelete,
}) => {
    const { t } = useTranslation();

    const [editQuestionMode, setEditQuestionMode] = useState(null);
    searchText = searchText?.trim().toLowerCase();
    let statusQuestions = questions.filter(
        (q) =>
            ((q.status === status.toUpperCase() &&
                status.toUpperCase() !== "ANSWERED" &&
                !q.isReplyed) ||
                (status.toUpperCase() === "ANSWERED" && q.isReplyed)) &&
            (q?.session?.title?.trim().toLowerCase().includes(searchText, 0) ||
                q?.message?.trim().toLowerCase().includes(searchText, 0) ||
                q?.user?.firstName
                    ?.trim()
                    .toLowerCase()
                    .includes(searchText, 0) ||
                q?.user?.lastName?.trim().toLowerCase().includes(searchText, 0))
    );
    statusQuestions = orderBy(statusQuestions, ["id"], ["desc"]);
    const profilePictureBasePath = useBuildAssetPath(UserProfileFileInfo);
    const { toLongDateTime } = useDateTime();
    const { containerId } = useAuthState();
    const loginUserProfileStyle = (user) => {
        return getBGStyle(profilePictureBasePath, user?.imageName, placeholder);
    };

    const updateQuestionStatus = (id: number, questionStatus: string) => {
        SessionQuestionApi.update<SessionQuestion, Partial<SessionQuestion>>(
            id,
            {
                ...(questionStatus === "ANSWERED"
                    ? { isReplyed: true }
                    : { isReplyed: false, status: questionStatus }),
            }
        ).then(({ response }) => {
            emitEditAskSpeaker(containerId, response?.user, response, null);
            core.editQuestion(response, setQuestions);
        });
    };

    const saveEdit = (message: string, id: number) => {
        SessionQuestionApi.update<SessionQuestion, Partial<SessionQuestion>>(
            id,
            {
                message,
            }
        ).then(({ response }) => {
            setEditQuestionMode(null);
            emitEditAskSpeaker(containerId, response?.user, response, null);
            core.editQuestion(response, setQuestions);
        });
    };

    return statusQuestions.length <= 0 ? (
        <span className="null mt-3 d-block w-100 text-center">
            {t("questionboard.list:noquestions")}
        </span>
    ) : (
        statusQuestions.map((q) => (
            <div key={q.id} className="question-item card mb-4">
                <div className="question-item--header">
                    <div className="row px-3 pt-3 mb-2">
                        <div className="question-item--header--title col-12 col-xl-8 pr-0">
                            <h3 className="mb-2">{q?.session?.title || ""}</h3>
                        </div>
                        <div className="question-item--header--button col-12 col-xl-4 pl-0">
                            <div className="question-item--header--button--arrow-right mb-2">
                                <a
                                    href={`/event/${parseIdFromResourceUrl(
                                        q.session.conference["@id"]
                                    )}/session/${parseIdFromResourceUrl(
                                        q.session["@id"]
                                    )}`}
                                    className="btn btn-secondary"
                                    target="_blank"
                                >
                                    <i
                                        className="fak fa-chevron-right"
                                        aria-hidden="true"
                                    ></i>
                                </a>
                            </div>
                            {!q.isReplyed && editQuestionMode !== q.id && (
                                <div className="question-item--header--button--move ml-2 mb-2">
                                    <a className="btn btn-secondary">
                                        <i
                                            className="fak fa-arrows-light"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="question-item--content user-2 rep p-3">
                        <a href={`/attendee/${q.user.id}/show`} target="_blank">
                            <div className="question-item--content--header py-2">
                                <i
                                    className="question-item--content--header--avatar profile-pic mr-2"
                                    style={loginUserProfileStyle(q.user)}
                                ></i>
                                <div className="question-item--content--header--det">
                                    <h4 className="mb-0">
                                        {q.user.firstName} {q.user.lastName}
                                    </h4>
                                    <span>
                                        {toLongDateTime(
                                            getDateTimeWithoutTimezone(
                                                q.createdAt
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </a>
                        <div className="question-item--content--comm py-2">
                            {editQuestionMode === q.id ? (
                                <AppMessageCompose
                                    id="compose-textarea"
                                    placeholder={t(
                                        "askSpeaker:form.question.placeholder"
                                    )}
                                    rows={4}
                                    isSend
                                    editMessage={q.message}
                                    isEdit={true}
                                    enterToPost={true}
                                    handleUpdateData={(res) => {
                                        saveEdit(res, q.id);
                                    }}
                                    handleDataSend={() => {}}
                                />
                            ) : (
                                <p className="m-0 p-0">{q.message}</p>
                            )}
                        </div>
                        <div className="question-item--content--action pt-1">
                            <QuestionActions
                                t={t}
                                status={q.status}
                                isReplyed={q.isReplyed}
                                updateQuestionStatus={updateQuestionStatus}
                                qId={q.id}
                                setShowDelete={setShowDelete}
                                editQuestionMode={editQuestionMode}
                                setEditQuestionMode={setEditQuestionMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ))
    );
};
export const QuestionBoard: FC<RouteComponentProps> = (): JSX.Element => {
    const [loading, isLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<any[]>(core.getState());
    const [searchText, setSearchText] = useState<any>({});
    const [showDelete, setShowDelete] = useState<number>(0);
    // const [totalItems, setTotalItems] = useState<number>(0);
    const { containerId } = useAuthState();
    const showColumns = [
        STATUS_NEW,
        STATUS_ACCEPTED,
        STATUS_REJECTED,
        "ANSWERED",
    ];

    const {
        emitJoinAskSpeaker,
        emitLeaveAskSpeaker,
        emitEditAskSpeaker,
        emitDeleteAskSpeaker,
    } = useAskSpeakerSocketEvents();

    const columnLabelKeys = {
        NEW: "questionboard.list:columns.title.new",
        ACCEPTED: "questionboard.list:columns.title.accepted",
        REJECTED: "questionboard.list:columns.title.rejected",
        ANSWERED: "questionboard.list:columns.title.answered",
    };
    const columnIconName = {
        NEW: "message-incoming",
        ACCEPTED: "message-approved",
        REJECTED: "message-reject",
        ANSWERED: "start-conversation",
    };
    const { t } = useTranslation();
    const fetchQuestions = (params = {}) => {
        isLoading(true);
        isLoading(!params);
        SessionQuestionApi.find<SessionQuestion>(1, {
            itemsPerPage: 1000,
        }).then(({ response, error }) => {
            isLoading(false);

            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                // setTotalItems(response.totalItems);
                core.createState(response.items, setQuestions);
            }
        });
    };

    useEffect(() => {
        if (containerId) emitJoinAskSpeaker(containerId);

        return () => {
            emitLeaveAskSpeaker(containerId);
        };
    }, [containerId]);

    useEffect(() => {
        socket.on(
            ON_NEW_ASK_SPEAKER,
            (u: PUser, parent: number | null, payload: PAskSpeakerQuestion) => {
                if (u && payload) {
                    core.addNewQuestion(payload, setQuestions);
                }
            }
        );

        socket.on(ON_DELETE_ASK_SPEAKER, (qId: number) => {
            if (qId) {
                const p = core
                    .getState()
                    .find((e: PAskSpeakerQuestion) => e.id === qId);
                if (p) {
                    core.deleteQuestion(qId, setQuestions);
                }
            }
        });

        socket.on(
            ON_EDIT_ASK_SPEAKER,
            (u: PUser, parent: number | null, payload: PAskSpeakerQuestion) => {
                if (u && payload) {
                    core.editQuestion(payload, setQuestions);
                }
            }
        );

        return () => {
            socket.off(ON_NEW_ASK_SPEAKER);
            socket.off(ON_DELETE_ASK_SPEAKER);
            socket.off(ON_EDIT_ASK_SPEAKER);
        };
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleQuickSearch = (search: string, status: string) => {
        // eslint-disable-next-line no-console
        console.log(searchText, status);
        setSearchText({ ...searchText, [status]: search });
    };

    const renderQuestionStatusCols = () => {
        return (
            <Row>
                {showColumns.map((boardCol) => (
                    <Col
                        key={boardCol}
                        xs={12}
                        md={6}
                        lg={Math.max(12 / showColumns.length, 4)}
                        xl={Math.max(12 / showColumns.length, 3)}
                        className="questionboard-admin--container--item"
                    >
                        <div className="inner-container card">
                            <div className="inner-container--header py-3 px-3">
                                <div className="inner-container--header--title">
                                    <i
                                        className={`fak fa-${columnIconName[boardCol]}`}
                                    ></i>
                                    <h2 className="mb-0 pl-2">
                                        {t(columnLabelKeys[boardCol])}
                                    </h2>
                                </div>
                                <div className="inner-container--header--search mt-3 mx-2">
                                    <div className="search-input-box left-icon input-text">
                                        <input
                                            type="text"
                                            className="w-100"
                                            placeholder={t(
                                                "questionboard.list:columns.search"
                                            )}
                                            onChange={(e) =>
                                                handleQuickSearch(
                                                    e.target.value,
                                                    boardCol
                                                )
                                            }
                                        />
                                        <a href="#">
                                            <i
                                                className="fak fa-search-light"
                                                aria-hidden="true"
                                            ></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="inner-container--content p-1 pt-2">
                                <div className="inner-container--content--group px-3 pt-2">
                                    {loading ? (
                                        <AppLoader />
                                    ) : (
                                        <QuestionCard
                                            status={boardCol}
                                            questions={questions}
                                            emitEditAskSpeaker={
                                                emitEditAskSpeaker
                                            }
                                            setShowDelete={setShowDelete}
                                            searchText={
                                                searchText[boardCol] || ""
                                            }
                                            setQuestions={setQuestions}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        );
    };

    const deleteQuestion = (id: number) => {
        SessionQuestionApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                emitDeleteAskSpeaker(containerId, id);
                const p = core
                    .getState()
                    .find((e: PAskSpeakerQuestion) => e.id === id);
                if (p) {
                    core.deleteQuestion(id, setQuestions);
                }
            }
        });
    };

    return (
        <Fragment>
            <AppPageHeader
                title={t("questionboard.list:header.title")}
            ></AppPageHeader>
            <div className="questionboard-admin--container pt-1 pt-xl-3">
                {renderQuestionStatusCols()}
            </div>

            <AppModal
                show={showDelete > 0}
                handleClose={() => {
                    setShowDelete(0);
                }}
                handleDelete={() => {
                    setShowDelete(0);
                    deleteQuestion(showDelete);
                }}
                bodyContent={t("questionboard.list:delete.confirm.message")}
                title={t("questionboard.list:delete.confirm.title")}
            />
        </Fragment>
    );
};
