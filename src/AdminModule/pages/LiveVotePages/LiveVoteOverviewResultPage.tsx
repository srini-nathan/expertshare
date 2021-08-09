import React, { FC, Fragment, useState, useEffect } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import {
    AppCard,
    AppLoader,
    AppPageHeader,
} from "../../../AppModule/components";
import { LiveVoteResultApi } from "../../apis";
import { LiveVoteResultOverview } from "../../models";
import { useSessionSocketEvents } from "../../../AppModule/hooks";
import { socket, EVENTS } from "../../../AppModule/socket";

export const LiveVoteOverviewResultPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { questionId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const {
        emitJoinLiveVoteResult,
        emitLeaveLiveVoteResult,
    } = useSessionSocketEvents();

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
