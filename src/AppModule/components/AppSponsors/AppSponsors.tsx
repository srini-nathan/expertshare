import React, { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types/swiper-options";
import { Exhibitor } from "../../../AdminModule/models";
import { AppSponsor } from "./AppSponsor";

import "./assets/scss/style.scss";

interface AppSponsorsType {
    data: Exhibitor[];
    basePath: string;
    options?: SwiperOptions;
}

export const AppSponsors: FC<AppSponsorsType> = ({
    data,
    basePath,
    options = {
        slidesPerView: 6,
        autoplay: true,
    },
}) => {
    const activeSponsors = data.filter((d) => d.isVisible);
    return (
        <div className={"app-sponsors"}>
            <Swiper {...options}>
                {activeSponsors.map((d) => (
                    <SwiperSlide key={d.id}>
                        <AppSponsor data={d} basePath={basePath} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
