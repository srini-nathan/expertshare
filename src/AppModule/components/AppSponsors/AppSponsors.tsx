import React, { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types/swiper-options";
import { Exhibitor } from "../../../AdminModule/models";
import { AppSponsor } from "./AppSponsor";

import "./assets/scss/style.scss";
import { useExhibitors } from "../../hooks";
import { AppLoader } from "../AppLoader";
import { ExhibitorApi } from "../../../AdminModule/apis";

interface AppSponsorsType {
    data: string[];
    basePath: string;
    options?: SwiperOptions;
    containerId: number;
}

export const AppSponsors: FC<AppSponsorsType> = ({
    data,
    basePath,
    options = {
        slidesPerView: "auto",
        autoplay: true,
    },
    containerId,
}) => {
    const { loading, getExhibitors } = useExhibitors();
    const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);

    useEffect(() => {
        getExhibitors(containerId).then((items) => {
            setExhibitors(
                items.filter((i) => {
                    return data.indexOf(ExhibitorApi.toResourceUrl(i.id)) > -1;
                })
            );
        });
    }, []);

    if (loading) {
        return <AppLoader />;
    }
    return (
        <div className={"app-sponsors"}>
            <Swiper {...options}>
                {exhibitors.map((d) => (
                    <SwiperSlide key={d.id} className={""}>
                        <AppSponsor data={d} basePath={basePath} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
