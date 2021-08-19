import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Chart } from "react-google-charts";
import { GoogleChartWrapperChartType } from "react-google-charts/dist/types";
import { AppLoader } from "../../components";
import { useLiveVoteResult } from "../../hooks";

export interface AppLiveVoteResultType {
    chartType?: GoogleChartWrapperChartType;
    questionId: number;
}

export const AppLiveVoteResult: FC<AppLiveVoteResultType> = ({
    chartType = "BarChart",
    questionId,
}) => {
    const { t } = useTranslation();
    const { loading, chartData, data, colors } = useLiveVoteResult(questionId);

    if (loading) {
        return <AppLoader />;
    }

    return (
        <div className="question-det col-12">
            <Row>
                <Col>
                    {chartData.length > 0 ? (
                        <Chart
                            width={"100%"}
                            height={"100%"}
                            chartType={chartType}
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
                                        type: "string",
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
                                    format: "#",
                                },
                                slices: colors,
                            }}
                            formatters={[
                                {
                                    type: "NumberFormat",
                                    column: 1,
                                    options: {
                                        suffix: "%",
                                    },
                                },
                            ]}
                        />
                    ) : (
                        <p className={"alert alert-info"}>
                            {t(
                                "sessionDetails:section.liveVoting.noSufficientData"
                            )}
                        </p>
                    )}
                </Col>
            </Row>
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
