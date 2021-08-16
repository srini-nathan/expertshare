import { useEffect, useState } from "react";
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
        calculateCharData();
    }, [data]);

    return { loading, chartData, data };
}
