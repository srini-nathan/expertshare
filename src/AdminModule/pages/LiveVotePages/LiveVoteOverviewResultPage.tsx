import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams, Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import { useSetRecoilState } from "recoil";
import { GoogleChartWrapperChartType } from "react-google-charts/dist/types";
import {
    AppButton,
    AppCard,
    AppLoader,
    AppPageHeader,
} from "../../../AppModule/components";
import { LiveVoteQuestionApi, LiveVoteResultApi } from "../../apis";
import { LiveVoteQuestion, LiveVoteResultOverview } from "../../models";
import { useSessionSocketEvents } from "../../../AppModule/hooks";
import { socket, EVENTS } from "../../../AppModule/socket";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    normalLayout,
    overViewLayout,
} from "../../../AppModule/atoms";
import { errorToast } from "../../../AppModule/utils";
import { VOTE_QUESTION_CHART_TYPE } from "../../../config";

export const LiveVoteOverviewResultPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { questionId, viewMode = "normal" } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingQuestion, setLoadingQuestion] = useState<boolean>(true);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartMode, setChartMode] = useState<GoogleChartWrapperChartType>(
        "BarChart"
    );
    const {
        emitJoinLiveVoteResult,
        emitLeaveLiveVoteResult,
    } = useSessionSocketEvents();
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );

    useEffect(() => {
        if (viewMode === "fullscreen") {
            setLayoutOptions((currVal) => {
                return {
                    ...currVal,
                    ...overViewLayout,
                };
            });
        }
        return () => {
            if (viewMode === "fullscreen") {
                setLayoutOptions((currVal) => {
                    return {
                        ...currVal,
                        ...normalLayout,
                    };
                });
            }
        };
    });

    const fetchResult = (applyLoading = false) => {
        LiveVoteResultApi.getOverview<LiveVoteResultOverview>(questionId)
            .then(({ response }) => {
                if (response && response.items) {
                    setData(response.items);
                }
            })
            .finally(() => {
                if (applyLoading) {
                    setLoading(false);
                }
            });
    };

    const fetchLiveVote = () => {
        setLoadingQuestion(true);
        LiveVoteQuestionApi.findById<LiveVoteQuestion>(questionId)
            .then(({ isNotFound, response }) => {
                if (isNotFound) {
                    errorToast(
                        t("admin.liveVoteResult.overview:toast.error.notfound")
                    );
                } else if (response !== null) {
                    if (
                        response.chartType ===
                        VOTE_QUESTION_CHART_TYPE.VOTEQUESTIONCHARTTYPE_PIE
                    ) {
                        setChartMode("PieChart");
                    } else {
                        setChartMode("BarChart");
                    }
                }
            })
            .finally(() => {
                setLoadingQuestion(false);
            });
    };

    useEffect(() => {
        fetchLiveVote();
    }, []);

    const calculateCharData = () => {
        const computedData = data?.map((d) => {
            return [d.title, d.count, d.color, null];
        });

        if (computedData) {
            setChartData(computedData);
        } else {
            setChartData([]);
        }
    };

    useEffect(() => {
        emitJoinLiveVoteResult(questionId);
        socket.on(EVENTS.ON_REFRESH_LIVE_VOTE_RESULT, () => {
            fetchResult(false);
        });
        return () => {
            socket.off(EVENTS.ON_REFRESH_LIVE_VOTE_RESULT);
            emitLeaveLiveVoteResult(questionId);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchResult(true);
    }, []);

    useEffect(() => {
        calculateCharData();
    }, [data]);

    if (loading || loadingQuestion) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppPageHeader
                title={t("admin.liveVoteResult.overview:header.title")}
            />
            {chartMode === "PieChart" ? null : (
                <Row className={"live-voting-result--chart-action-bar"}>
                    <Col className={"d-flex justify-content-end"}>
                        <div className={"switch-view p-0 mx-0 ml-sm-2"}>
                            <div className={"switch-view--content"}>
                                <a
                                    className={
                                        chartMode === "BarChart"
                                            ? `active-view`
                                            : ""
                                    }
                                    href={"#"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setChartMode("BarChart");
                                    }}
                                >
                                    <i className="fak fa-chart" />
                                </a>
                                <a
                                    className={
                                        chartMode === "Bar" ? `active-view` : ""
                                    }
                                    href={"#"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setChartMode("Bar");
                                    }}
                                >
                                    <i
                                        className="fak fa-chart"
                                        style={{
                                            transform: "rotate(90deg)",
                                        }}
                                    />
                                </a>
                            </div>
                        </div>
                        {viewMode !== "fullscreen" ? (
                            <Link
                                to={`/admin/live-votes-result/${questionId}/overview/fullscreen`}
                            >
                                <AppButton
                                    variant={"secondary"}
                                    className={"show-full ml-2"}
                                >
                                    <i className={"fak fa-maximize"}></i>
                                </AppButton>
                            </Link>
                        ) : null}
                    </Col>
                </Row>
            )}
            <AppCard>
                <Row>
                    <Col>
                        <Chart
                            width={"100%"}
                            height={"100%"}
                            chartType={chartMode}
                            loader={<AppLoader />}
                            data={[
                                [
                                    "Vote Option",
                                    "Number Of Votes",
                                    { role: "style" },
                                    {
                                        sourceColumn: 0,
                                        role: "annotation",
                                        type: "string",
                                        calc: "stringify",
                                    },
                                ],
                                ...chartData,
                            ]}
                            options={{
                                legend: { position: "none" },
                            }}
                        />
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Col>
                        <ul
                            style={{
                                listStyle: "none",
                            }}
                        >
                            {data.map(({ title, color }, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={"mr-4"}
                                        style={{
                                            display: "inline-block",
                                        }}
                                    >
                                        <span
                                            className={"mr-1"}
                                            style={{
                                                display: "inline-block",
                                                backgroundColor:
                                                    color || "#F0F",
                                                height: "10px",
                                                width: "10px",
                                                borderRadius: "100%",
                                            }}
                                        ></span>
                                        {title}
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                </Row>
            </AppCard>
        </Fragment>
    );
};
