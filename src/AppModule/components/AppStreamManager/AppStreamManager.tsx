import React, { FC, useEffect, useState } from "react";
import { intervalToDuration, addSeconds } from "date-fns";
import { useTranslation } from "react-i18next";
import { AppVimeoFrame } from "../AppVimeoFrame";
import { AppYoutubeFrame } from "../AppYoutubeFrame";
import { AppDacastFrame } from "../AppDacastFrame";
import { AppKnovioPlayer } from "../AppKnovioPlayer";
import { AppSwisscomFrame } from "../AppSwisscomFrame";
import { Session } from "../../../AdminModule/models";
import { useBuildAssetPath } from "../../hooks";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import placeholder from "./assets/images/imgthumb.svg";
import { AppButton } from "../AppButton";
import { getDateTimeWithoutTimezone } from "../../utils";
import "./assets/scss/style.scss";
import { AppVideoPlayer } from "../AppVideoPlayer";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER },
} = UPLOAD;
interface AppStreamManagerProps {
    session: Session;
    isLive: (value: boolean) => void;
    getAgenda: () => void;
}

export const renderStreams = (
    streamType: string,
    streamUrl: string,
    showImage = false,
    style = {}
) => {
    switch (streamType) {
        case "VIMEO":
            return <AppVimeoFrame url={streamUrl} width="10" height="10" />;
        case "YOUTUBE":
            return (
                <AppYoutubeFrame url={streamUrl} width="1522" height="910" />
            );
        case "DACAST":
            return (
                <AppDacastFrame
                    id="dacast"
                    provider="dacast"
                    width={1522}
                    height={910}
                    configuration={{
                        videoURL: streamUrl,
                    }}
                />
            );
        case "KNOVIO":
            return (
                <AppKnovioPlayer
                    width={"auto"}
                    height={"100%"}
                    linkUrl={streamUrl}
                />
            );

        case "SWISSCOM":
            return (
                <AppSwisscomFrame url={streamUrl} width={1522} height={910} />
            );
        case "FILE":
            return <AppVideoPlayer url={streamUrl} />;
        default:
            if (showImage)
                return (
                    <div className="imageContainer">
                        <i style={style}></i>
                    </div>
                );
            return <></>;
    }
};

export const AppStreamManager: FC<AppStreamManagerProps> = ({
    session,
    isLive,
    getAgenda,
}): JSX.Element => {
    const { t } = useTranslation();
    const [currentTime, setCurrentTime] = useState<Date>(
        getDateTimeWithoutTimezone(session.currentTime)
    );
    const [time, setTime] = useState<Duration>();
    const [startedSession, isSessionStarted] = useState<boolean>(
        getDateTimeWithoutTimezone(session.currentTime) >
            getDateTimeWithoutTimezone(session.start)
    );

    const conferencePosterPath = useBuildAssetPath(
        FILETYPEINFO_SESSION_POSTER as FileTypeInfo,
        session.imageName
    );
    const style = session.imageName
        ? {
              backgroundImage: `url(${conferencePosterPath})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };

    useEffect(() => {
        let timer: any;
        if (!startedSession) {
            timer = setInterval(() => {
                if (currentTime <= getDateTimeWithoutTimezone(session.start)) {
                    if (session.start) {
                        const timeLeft = intervalToDuration({
                            start: currentTime,
                            end: getDateTimeWithoutTimezone(session.start),
                        });
                        setTime(timeLeft);
                    }
                } else {
                    isSessionStarted(true);
                    if (
                        isLive &&
                        !(currentTime > getDateTimeWithoutTimezone(session.end))
                    ) {
                        isLive(true);
                    }
                }
                setCurrentTime(addSeconds(currentTime, 1));
            }, 1000);
        } else if (
            isLive &&
            getDateTimeWithoutTimezone(session.currentTime) <
                getDateTimeWithoutTimezone(session.end)
        ) {
            isLive(true);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    });

    const renderStream = () => {
        if (!startedSession) {
            return (
                <div className="imageContainer">
                    <i style={style}></i>
                    <div className="overlay">
                        <div className="overlay--content">
                            <div className="overlay--content--item days">
                                <div className="overlay--content--item--title">
                                    {t("sessionDetails:label.days")}
                                </div>
                                <div className="overlay--content--item--time">
                                    {time && time.days ? `${time.days}` : "0"}
                                </div>
                            </div>
                            <div className="overlay--content--item hours">
                                <div className="overlay--content--item--title">
                                    {t("sessionDetails:label.hours")}
                                </div>
                                <div className="overlay--content--item--time">
                                    {time && time.hours ? `${time.hours}` : "0"}
                                </div>
                            </div>
                            <div className="overlay--content--item minutes">
                                <div className="overlay--content--item--title">
                                    {t("sessionDetails:label.minutes")}
                                </div>
                                <div className="overlay--content--item--time">
                                    {time && time.minutes
                                        ? `${time.minutes}`
                                        : "0"}
                                </div>
                            </div>
                            <div className="overlay--content--item seconds">
                                <div className="overlay--content--item--title">
                                    {t("sessionDetails:label.seconds")}
                                </div>
                                <div className="overlay--content--item--time">
                                    {time && time.seconds
                                        ? `${time.seconds}`
                                        : "0"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (
            !session.isReply &&
            getDateTimeWithoutTimezone(session.currentTime) >
                getDateTimeWithoutTimezone(session.end)
        ) {
            return (
                <div className="imageContainer">
                    <i style={style}></i>
                    <div className="overlay">
                        <div className="overlay--content">
                            <AppButton onClick={getAgenda} variant="secondary">
                                {t("sessionDetails:button.goToLiveSession")}
                            </AppButton>
                        </div>
                    </div>
                </div>
            );
        }

        return renderStreams(
            session.streamType,
            session.streamUrl,
            true,
            style
        );
    };

    return <div className="app-video-stream">{renderStream()}</div>;
};
