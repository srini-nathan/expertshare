import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { isString as _isString, orderBy } from "lodash";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import { AppPageHeader, AppLoader } from "../../components";
import { SessionQuestionApi } from "../../apis";
import {
    errorToast,
    getBGStyle,
    getDateTimeWithoutTimezone,
} from "../../utils";
import { SessionQuestion } from "../../models/entities/SessionQuestion";
import { CONSTANTS, UserProfileFileInfo } from "../../../config";
import placeholder from "../../assets/images/user-avatar.png";

import "./assets/scss/style.scss";
import "./assets/scss/_common.scss";

const { SessionQuestion: STATUS } = CONSTANTS;

const {
    STATUS: { STATUS_NEW, STATUS_ACCEPTED, STATUS_REJECTED },
} = STATUS;

const QuestionCard = ({
    status,
    questions,
    searchText,
    refreshQuestionList,
}) => {
    const { t } = useTranslation();
    searchText = searchText?.trim().toLowerCase();
    let statusQuestions = questions.filter(
        (q) =>
            q.status === status.toUpperCase() &&
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

    const loginUserProfileStyle = (user) => {
        return getBGStyle(profilePictureBasePath, user?.imageName, placeholder);
    };

    const updateQuestionStatus = (id: number, questionStatus: string) => {
        SessionQuestionApi.update<SessionQuestion, Partial<SessionQuestion>>(
            id,
            {
                status: questionStatus,
            }
        ).then(() => {
            refreshQuestionList();
        });
    };

    const deleteQuestion = (id: number) => {
        SessionQuestionApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                refreshQuestionList();
            }
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
                                <a href="#" className="btn btn-secondary">
                                    <i
                                        className="fak fa-chevron-right"
                                        aria-hidden="true"
                                    ></i>
                                </a>
                            </div>
                            <div className="question-item--header--button--move ml-2 mb-2">
                                <a href="#" className="btn btn-secondary">
                                    <i
                                        className="fak fa-arrows-light"
                                        aria-hidden="true"
                                    ></i>
                                </a>
                            </div>
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
                            <p className="mb-0">{q.message}</p>
                        </div>
                        <div className="question-item--content--action pt-1">
                            <div className="row px-2">
                                {q.status !== STATUS_NEW && (
                                    <div className="question-item--content--action--button approve col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
                                        <a
                                            href="#"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                updateQuestionStatus(
                                                    q.id,
                                                    STATUS_NEW
                                                )
                                            }
                                        >
                                            {t("questionboard.list:status.new")}
                                            <i
                                                className="fak fa-check-light"
                                                aria-hidden="true"
                                            ></i>
                                        </a>
                                    </div>
                                )}
                                {q.status !== STATUS_ACCEPTED && (
                                    <div className="question-item--content--action--button approve col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
                                        <a
                                            href="#"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                updateQuestionStatus(
                                                    q.id,
                                                    STATUS_ACCEPTED
                                                )
                                            }
                                        >
                                            {t(
                                                "questionboard.list:status.approve"
                                            )}
                                            <i
                                                className="fak fa-check-light"
                                                aria-hidden="true"
                                            ></i>
                                        </a>
                                    </div>
                                )}
                                {q.status !== STATUS_REJECTED && (
                                    <div className="question-item--content--action--button reject col-12 col-sm-6 col-md-12 col-xl-6 pt-2 px-2">
                                        <a
                                            href="#"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                updateQuestionStatus(
                                                    q.id,
                                                    STATUS_REJECTED
                                                )
                                            }
                                        >
                                            {t(
                                                "questionboard.list:status.reject"
                                            )}
                                            <i
                                                className="fak fa-times-light"
                                                aria-hidden="true"
                                            ></i>
                                        </a>
                                    </div>
                                )}
                                <div className="question-item--content--action--button delete col-12 col-sm-6 col-md-12 col-xl-6 pt-3 px-2">
                                    <a
                                        href="#"
                                        className="btn btn-secondary"
                                        onClick={() => deleteQuestion(q.id)}
                                    >
                                        {t("questionboard.list:status.delete")}
                                        <i
                                            className="fak fa-trash-light"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                </div>
                                <div className="question-item--content--action--button edit col-12 col-sm-6 col-md-12 col-xl-6 pt-3 px-2">
                                    <a href="#" className="btn btn-secondary">
                                        {t("questionboard.list:status.edit")}
                                        <i
                                            className="fak fa-pen-regular"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    );
};
export const QuestionBoard: FC<RouteComponentProps> = (): JSX.Element => {
    const [loading, isLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<any>({});
    // const [totalItems, setTotalItems] = useState<number>(0);
    const showColumns = [
        STATUS_NEW,
        STATUS_ACCEPTED,
        STATUS_REJECTED,
        "ANSWERED",
    ];
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
        SessionQuestionApi.find<SessionQuestion>().then(
            ({ response, error }) => {
                isLoading(false);

                if (error !== null) {
                    if (_isString(error)) {
                        errorToast(error);
                    }
                } else if (response !== null) {
                    // setTotalItems(response.totalItems);
                    setQuestions(response.items);
                }
            }
        );
    };

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
                                            searchText={
                                                searchText[boardCol] || ""
                                            }
                                            refreshQuestionList={fetchQuestions}
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

    return (
        <Fragment>
            <AppPageHeader
                title={t("questionboard.list:header.title")}
            ></AppPageHeader>
            <div className="questionboard-admin--container pt-1 pt-xl-3">
                {renderQuestionStatusCols()}
            </div>
        </Fragment>
    );
};
