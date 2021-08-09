import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams, Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import { useSetRecoilState } from "recoil";
import {
    AppButton,
    AppCard,
    AppLoader,
    AppPageHeader,
} from "../../../AppModule/components";
import { LiveVoteResultApi } from "../../apis";
import { LiveVoteResultOverview } from "../../models";
import { useSessionSocketEvents } from "../../../AppModule/hooks";
import { socket, EVENTS } from "../../../AppModule/socket";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    normalLayout,
    overViewLayout,
} from "../../../AppModule/atoms";

export const LiveVoteOverviewResultPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { questionId, viewMode = "normal" } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
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

    if (loading) {
        return <AppLoader />;
    }

    return (
        <Fragment>
            <AppPageHeader
                title={t("admin.liveVoteResult.overview:header.title")}
            />
            {viewMode !== "fullscreen" ? (
                <Row className={"live-voting-result--chart-action-bar"}>
                    <Col className={"d-flex justify-content-end"}>
                        <Link
                            to={`/admin/live-votes-result/${questionId}/overview/fullscreen`}
                        >
                            <AppButton
                                variant={"secondary"}
                                className={"show-full"}
                            >
                                <i className={"fak fa-maximize"}></i>
                            </AppButton>
                        </Link>
                    </Col>
                </Row>
            ) : null}
            <AppCard>
                <Row>
                    <Col>
                        <Chart
                            width={"100%"}
                            height={"100%"}
                            chartType="BarChart"
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
