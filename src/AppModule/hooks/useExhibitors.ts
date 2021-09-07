import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ExhibitorApi } from "../../AdminModule/apis/ExhibitorApi";
import { appExhibitors } from "../atoms/AppExhibitors";
import { Exhibitor } from "../../AdminModule/models/entities/Exhibitor";

type UseExhibitorsType = {
    loading: boolean;
    getExhibitors: (containerId: number) => Promise<Exhibitor[]>;
};

export function useExhibitors(): UseExhibitorsType {
    const [loading, setLoading] = useState<boolean>(false);
    const [exhibitors, setExhibitors] = useRecoilState(appExhibitors);

    useEffect(() => {}, []);

    const getExhibitors = async (containerId: number): Promise<Exhibitor[]> => {
        setLoading(true);
        return new Promise((resolve) => {
            if (exhibitors !== null) {
                resolve(exhibitors);
                setLoading(false);
            } else {
                ExhibitorApi.getAllExhibitor<Exhibitor>({
                    "container.id": containerId,
                })
                    .then(({ response }) => {
                        if (response !== null && response?.items) {
                            resolve(response.items);
                            setExhibitors(response?.items);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(() => {
                        resolve([]);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        });
    };

    return {
        getExhibitors,
        loading,
    };
}
