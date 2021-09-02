import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Exhibitor } from "../../../AdminModule/models";
import { AppSponsor } from "./AppSponsor";

import "./assets/scss/style.scss";

interface AppSponsorsType {
    data: Exhibitor[];
    basePath: string;
}

export const AppSponsors: FC<AppSponsorsType> = ({ data, basePath }) => {
    return (
        <div className={"app-sponsors"}>
            <Swiper>
                {data.map((d) => (
                    <SwiperSlide key={d.id}>
                        <AppSponsor data={d} basePath={basePath} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
