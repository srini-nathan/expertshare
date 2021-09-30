import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { isString as _isString, orderBy, find as _find } from "lodash";
import { useForm } from "react-hook-form";
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
    AppButton,
    AppIcon,
    AppFormSelect,
    AppMessageCompose,
    AppRightSideDrawer,
    AppFormMultiSelect,
} from "../../components";
import { SessionQuestionApi } from "../../apis";
import {
    errorToast,
    successToast,
    getBGStyle,
    getDateTimeWithoutTimezone,
    parseIdFromResourceUrl,
} from "../../utils";
import { PrimitiveObject } from "../../models";
import { SessionQuestion } from "../../models/entities/SessionQuestion";
import { CONSTANTS, UserProfileFileInfo } from "../../../config";
import placeholder from "../../assets/images/user-avatar.png";
import { PUser, Conference } from "../../../AdminModule/models";
import { ConferenceApi, SessionApi } from "../../../AdminModule/apis";

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

const FilterForm = ({
    availableConferences,
    handleFilterChange,
    handleFilterClearAll,
    selectedConference,
    availableSessions,
    selectedSession,
    setSelectedSession,
    getUpdatedSessions,
}) => {
    const { t } = useTranslation();

    const { control, handleSubmit, setValue } = useForm<any>({
        mode: "all",
    });

    const onSubmit = async (formData: any) => {
        handleFilterChange(formData);
        setSelectedSession(formData.sessions);
        return formData;
    };

    const getConferenceOption = () => {
        return availableConferences?.items.map((e: any) => {
            return {
                value: e.id,
                label: e.title,
            };
        });
    };

    useEffect(() => {
        setValue("sessions", selectedSession);
    }, [selectedSession]);

    // eslint-disable-next-line no-console
    console.log("selectedSession", selectedSession);
    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col md={12}>
                    <AppFormSelect
                        id={"conferences"}
                        name={"conferences"}
                        label={t(
                            "questionboard.filter.form:label.select.conferences"
                        )}
                        className="conferences-container"
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        control={control}
                        defaultValue={_find(getConferenceOption(), {
                            value: selectedConference,
                        })}
                        placeholder={t(
                            "questionboard.filter.form:label.select.conferences"
                        )}
                        options={getConferenceOption()}
                        transform={{
                            output: (template: PrimitiveObject) => {
                                getUpdatedSessions(template?.value);
                                return template?.value;
                            },
                            input: (value: number) => {
                                return _find([], {
                                    value,
                                });
                            },
                        }}
                    />
                </Col>
                <Col md={12}>
                    <AppFormMultiSelect
                        id={"sessions"}
                        name={"sessions"}
                        className={"form-select"}
                        label={t(
                            "questionboard.filter.form:label.select.sessions"
                        )}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        required={false}
                        isObjectOptions={true}
                        defaultValue={selectedSession}
                        placeholder={t(
                            "questionboard.filter.form:label.select.sessions"
                        )}
                        options={availableSessions?.items?.map((s) => {
                            return { value: s.id, text: s.title };
                        })}
                        control={control}
                    />
                </Col>
                <Col md={12}>
                    <AppButton
                        type="button"
                        variant={"secondary"}
                        className="w-100 mb-2"
                        onClick={handleFilterClearAll}
                    >
                        {t("common.button:clearfilter")}
                    </AppButton>
                    <AppButton
                        type="submit"
                        variant={"primary"}
                        className="w-100 mb-2"
                    >
                        {t("common.button:applyfilter")}
                    </AppButton>
                </Col>
            </Row>
        </Form>
    );
};
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
            <div className="question-item--content--action--button cancel col-12 col-sm-6 col-md-12 col-xl-6 pt-3 px-2">
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
                <div className="question-item--content--action--button new col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
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
                <div className="question-item--content--action--button approve col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
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
                <div className="question-item--content--action--button reject col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
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
                <div className="question-item--content--action--button approve col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
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
            <div className="question-item--content--action--button delete col-12 col-sm-6 col-md-12 col-xl-6 pt-3 px-2">
                <a
                    className="btn btn-secondary"
                    onClick={() => setShowDelete(qId)}
                >
                    {t("questionboard.list:status.delete")}
                    <i className="fak fa-trash-light" aria-hidden="true"></i>
                </a>
            </div>
            <div className="question-item--content--action--button edit col-12 col-sm-6 col-md-12 col-xl-6 pt-3 px-2">
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
                `${q?.user?.firstName?.trim() || ""} ${
                    q?.user?.lastName?.trim() || ""
                }`
                    .toLowerCase()
                    .includes(searchText, 0))
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
    const [fetchingQuestions, isFetchingQuestions] = useState<boolean>(true);
    const [questions, setQuestions] = useState<any[]>(core.getState());
    const [searchText, setSearchText] = useState<any>({});
    const [showDelete, setShowDelete] = useState<number>(0);
    const [showFilter, setShowFilter] = useState<number>(0);
    const [availableConferences, setAvailableConferences] = useState<any>([]);
    const [availableSessions, setAvailableSessions] = useState<any>([]);
    const [selectedConference, setSelectedConference] = useState<number>(0);
    const [selectedSession, setSelectedSession] = useState<number[]>([]);
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
    const fetchQuestions = (params = {}, shouldResetSelection = false) => {
        isFetchingQuestions(true);
        SessionQuestionApi.find<SessionQuestion>(1, {
            itemsPerPage: 1000,
            ...params,
        }).then(({ response, error }) => {
            isFetchingQuestions(false);
            if (shouldResetSelection) {
                setSelectedConference(params["conference.id"]);
                setSelectedSession([]);
            }
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

    const fetchSessions = (params = {}, isInitialLoad = false) => {
        isLoading(true);
        isLoading(!params);
        setSelectedSession([]);
        SessionApi.getCollectionByConferenceId<Conference>(params).then(
            ({ response, error }) => {
                isLoading(false);

                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setAvailableSessions(response);
                    if (isInitialLoad) {
                        fetchQuestions({
                            "container.id": containerId,
                            "session.id": response?.items.map((s) => s.id),
                        });
                    }
                }
            }
        );
    };

    const fetchConferences = (params = {}, isInitialLoad = false) => {
        isLoading(true);
        ConferenceApi.getCollection<Conference>(params).then(
            ({ response, error }) => {
                isLoading(false);

                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    setAvailableConferences(response);
                    if (response?.items && response?.items[0]?.id) {
                        setSelectedConference(response?.items[0]?.id);
                        fetchSessions(
                            {
                                "container.id": containerId,
                                "conference.id": response?.items[0]?.id,
                                isVisible: true,
                            },
                            isInitialLoad
                        );
                    }
                }
            }
        );
    };

    useEffect(() => {
        if (containerId) emitJoinAskSpeaker(containerId);

        return () => {
            emitLeaveAskSpeaker(containerId);
        };
    }, [containerId]);

    const getUpdatedSessions = (confId: number) => {
        fetchSessions({
            "container.id": containerId,
            "conference.id": confId,
            isVisible: true,
        });
        // setSelectedConference(confId);
    };

    useEffect(() => {
        socket.on(
            ON_NEW_ASK_SPEAKER,
            (u: PUser, parent: number | null, payload: PAskSpeakerQuestion) => {
                if (
                    u &&
                    payload &&
                    payload?.session instanceof Object &&
                    selectedConference ===
                        parseIdFromResourceUrl(
                            payload?.session?.conference?.["@id"]
                        ) &&
                    (selectedSession.length <= 0 ||
                        selectedSession.indexOf(
                            parseIdFromResourceUrl(payload?.session?.["@id"]) ||
                                0
                        ) !== -1)
                ) {
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
                if (
                    u &&
                    payload &&
                    payload?.session instanceof Object &&
                    selectedConference ===
                        parseIdFromResourceUrl(
                            payload?.session?.conference?.["@id"]
                        ) &&
                    (selectedSession.length <= 0 ||
                        selectedSession.indexOf(
                            parseIdFromResourceUrl(payload?.session?.["@id"]) ||
                                0
                        ) !== -1)
                ) {
                    core.editQuestion(payload, setQuestions);
                }
            }
        );

        return () => {
            socket.off(ON_NEW_ASK_SPEAKER);
            socket.off(ON_DELETE_ASK_SPEAKER);
            socket.off(ON_EDIT_ASK_SPEAKER);
        };
    });

    useEffect(() => {
        fetchConferences(
            {
                "container.id": containerId,
            },
            true
        );
    }, []);

    const handleQuickSearch = (search: string, status: string) => {
        setSearchText({ ...searchText, [status]: search });
    };

    const handleShowFilter = () => {
        setShowFilter(1);
    };

    const handleFilterSubmit = (data) => {
        if (data?.sessions?.length > 0) {
            fetchQuestions({
                "container.id": containerId,
                "session.id": data.sessions,
            });
            setSelectedSession(data.sessions);
            setSelectedConference(data.conferences);
        } else {
            fetchQuestions({
                "container.id": containerId,
                "session.id": availableSessions?.items?.map((s) => s.id),
            });
            setSelectedSession([]);
            setSelectedConference(data.conferences);
        }
        setShowFilter(0);
    };

    const handleFilterClearAll = () => {
        setShowFilter(0);
        setSelectedConference(availableConferences?.items[0]?.id);
        setSelectedSession([]);
        fetchSessions(
            {
                "container.id": containerId,
                "conference.id": availableConferences?.items[0]?.id,
                isVisible: true,
            },
            true
        );
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
                                    {loading || fetchingQuestions ? (
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
                customToolbar
            >
                <div className="d-block mb-3 mb-md-5">
                    <div className="d-block d-sm-flex pt-2 justify-content-end user-header-width">
                        <AppButton
                            className="mr-2 p-3 user-filter"
                            variant="secondary"
                            onClick={() => handleShowFilter()}
                        >
                            <AppIcon className="mr-2" name="Filter" />
                            {t("common.button:filter")}
                        </AppButton>
                    </div>
                </div>
            </AppPageHeader>
            <div className="questionboard-admin--container pt-1 pt-xl-3">
                {renderQuestionStatusCols()}
            </div>
            <AppRightSideDrawer
                show={showFilter > 0}
                handleClose={() => {
                    setShowFilter(0);
                    fetchSessions({
                        "container.id": containerId,
                        "conference.id": selectedConference,
                        isVisible: true,
                    });
                }}
                handleDelete={() => {
                    setShowFilter(0);
                }}
                bodyContent={
                    <FilterForm
                        handleFilterChange={handleFilterSubmit}
                        handleFilterClearAll={handleFilterClearAll}
                        selectedConference={selectedConference}
                        availableConferences={availableConferences}
                        availableSessions={availableSessions}
                        selectedSession={selectedSession}
                        setSelectedSession={setSelectedSession}
                        getUpdatedSessions={getUpdatedSessions}
                    />
                }
                title={t("questionboard.list:filterdrawer.title")}
            />
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
