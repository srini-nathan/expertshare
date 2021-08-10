import React, { FC, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { GoogleChartWrapperChartType } from "react-google-charts/dist/types";
import { LiveVoteResultApi } from "../../../AdminModule/apis";
import { LiveVoteResultOverview } from "../../../AdminModule/models";
import { AppLoader } from "../../components";

export interface AppLiveVoteResultType {
    chartType?: GoogleChartWrapperChartType;
    questionId: number;
}

export const AppLiveVoteResult: FC<AppLiveVoteResultType> = ({
    chartType = "BarChart",
    questionId,
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

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
        <div className="question-det mt-3">
            <Row>
                <Col>
                    <Chart
                        width={"100%"}
                        height={"100%"}
                        chartType={chartType}
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
                                            backgroundColor: color || "#F0F",
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
        </div>
    );
};
