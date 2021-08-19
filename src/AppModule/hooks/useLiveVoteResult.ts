import { useEffect, useState } from "react";
import { round } from "lodash";
import { LiveVoteResultOverview } from "../../AdminModule/models";
import { LiveVoteResultApi } from "../../AdminModule/apis";
import { SimpleObject } from "../models";

export function useLiveVoteResult(questionId: number | null) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [colors, setColors] = useState<SimpleObject<any>>({});

    useEffect(() => {
        if (questionId !== null) {
            setLoading(true);
            LiveVoteResultApi.getOverview<LiveVoteResultOverview>(questionId)
                .then(({ response }) => {
                    if (response && response.items) {
                        setData(response.items);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [questionId]);

    const calculateCharData = () => {
        let total = 0;
        const cls: SimpleObject<any> = {};
        data?.forEach((d) => {
            total += d.count;
        });
        const computedData = data?.map((d, index) => {
            if (d.color != null) {
                cls[index] = { color: d.color };
            }
            return [d.title, round((d.count * 100) / total, 1), d.color, null];
        });
        setColors(cls);
        setChartData(computedData || []);
    };

    useEffect(() => {
        calculateCharData();
    }, [data]);

    return { loading, chartData, data, colors };
}
