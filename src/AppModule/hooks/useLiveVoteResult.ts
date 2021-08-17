import { useEffect, useState } from "react";
import { round } from "lodash";
import { LiveVoteResultOverview } from "../../AdminModule/models";
import { LiveVoteResultApi } from "../../AdminModule/apis";

export function useLiveVoteResult(questionId: number | null) {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<LiveVoteResultOverview[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

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
        data?.forEach((d) => {
            total += d.count;
        });
        const computedData = data?.map((d) => {
            return [d.title, round((d.count * 100) / total, 1), d.color, null];
        });

        setChartData(computedData || []);
    };

    useEffect(() => {
        calculateCharData();
    }, [data]);

    return { loading, chartData, data };
}
