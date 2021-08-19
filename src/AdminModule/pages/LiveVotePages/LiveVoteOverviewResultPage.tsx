import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import { useSetRecoilState } from "recoil";
import { GoogleChartWrapperChartType } from "react-google-charts/dist/types";
import { round } from "lodash";
import {
    AppBreadcrumb,
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
import { SimpleObject } from "../../../AppModule/models";

export const LiveVoteOverviewResultPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const {
        questionId,
        viewMode = "normal",
        conferenceId = null,
        sessionId = null,
    } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingQuestion, setLoadingQuestion] = useState<boolean>(true);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartMode, setChartMode] = useState<GoogleChartWrapperChartType>(
        "BarChart"
    );
    const [colors, setColors] = useState<SimpleObject<any>>({});
    const [barColors, setBarColors] = useState<string[]>([]);
    const {
        emitJoinLiveVoteResult,
        emitLeaveLiveVoteResult,
    } = useSessionSocketEvents();
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );
    const fullscreenMode =
        conferenceId && sessionId
            ? `/admin/live-votes-result/${conferenceId}/${sessionId}/${questionId}/overview/fullscreen`
            : `/admin/live-votes-result/${questionId}/overview/fullscreen`;
    const backLink =
        conferenceId && sessionId
            ? `/event/${conferenceId}/session/${sessionId}`
            : "/admin/live-votes";

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
        let total = 0;
        const barCls: string[] = [];
        const cls: SimpleObject<any> = {};
        data?.forEach((d) => {
            total += d.count;
        });
        const computedData = data?.map((d, index) => {
            if (d.color != null) {
                cls[index] = { color: d.color };
                barCls.push(d.color);
                // eslint-disable-next-line no-console
                console.log(barColors, "barColors");
            }
            return [
                d.title,
                round((d.count * 100) / total, 1),
                `color: ${d.color}`,
                null,
            ];
        });
        setColors(cls);
        setBarColors(barCls);
        setChartData(computedData || []);
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
            {viewMode !== "fullscreen" ? (
                <AppBreadcrumb
                    linkText={
                        conferenceId && sessionId
                            ? t("admin.liveVotes.list:header.backToSession")
                            : t("admin.liveVote.list:header.title")
                    }
                    linkUrl={backLink}
                />
            ) : null}
            <AppPageHeader
                title={t("admin.liveVoteResult.overview:header.title")}
            />
            {chartMode === "PieChart" ? null : (
                <Row className={"live-voting-result--chart-action-bar"}>
                    <Col className={"d-flex justify-content-end"}>
                        {viewMode !== "fullscreen" ? (
                            <a href={fullscreenMode} target="_blank">
                                <AppButton
                                    variant={"secondary"}
                                    className={"show-full ml-2"}
                                >
                                    <i className={"fak fa-maximize"}></i>
                                </AppButton>
                            </a>
                        ) : null}
                    </Col>
                </Row>
            )}
            <AppCard>
                <Row>
                    <Col>
                        {chartData.length > 0 ? (
                            <Chart
                                width={"100%"}
                                height={"100%"}
                                chartType={chartMode}
                                loader={<AppLoader />}
                                data={[
                                    [
                                        t(
                                            "admin.liveVoteResult.overview:chart.label.voteOption"
                                        ),
                                        t(
                                            "admin.liveVoteResult.overview:chart.label.numberOfVotes"
                                        ),
                                        { role: "style" },
                                        {
                                            sourceColumn: 0,
                                            role: "annotation",
                                            type: "number",
                                            calc: "stringify",
                                        },
                                    ],
                                    ...chartData,
                                ]}
                                options={{
                                    legend: { position: "none" },
                                    hAxis: {
                                        minValue: 0,
                                        maxValue: 100,
                                    },
                                    slices: colors,
                                }}
                            />
                        ) : (
                            <p className={"alert alert-info"}>
                                {t(
                                    "admin.liveVoteResult:info.noSufficientData"
                                )}
                            </p>
                        )}
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
