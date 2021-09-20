import React, { FC, useEffect, useState } from "react";
import { SwiperOptions } from "swiper/types/swiper-options";
import Carousel from "react-multi-carousel";
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
    customCss?: any;
}

export const AppSponsors: FC<AppSponsorsType> = ({
    data,
    basePath,
    options = {},
    containerId,
    customCss,
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
    const responsive = customCss || {
        desktop: {
            breakpoint: {
                max: 3000,
                min: 1024,
            },
            items: 3,
            partialVisibilityGutter: 40,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            partialVisibilityGutter: 30,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            partialVisibilityGutter: 30,
        },
    };

    return (
        <div className={"app-sponsors"}>
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlay
                autoPlaySpeed={1}
                centerMode={false}
                className="carousel-style"
                containerClass="container-with-dots"
                customTransition="all 1s linear"
                draggable
                focusOnSelect={false}
                infinite
                keyBoardControl
                minimumTouchDrag={80}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={responsive}
                showDots={false}
                sliderClass="slider-class"
                swipeable
                transitionDuration={1000}
                {...options}
            >
                {exhibitors.map((d) => (
                    <div key={d.id}>
                        <AppSponsor data={d} basePath={basePath} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};
