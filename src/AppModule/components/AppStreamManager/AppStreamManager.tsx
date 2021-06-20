import React, { FC, useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
import { useTranslation } from "react-i18next";
import { AppVimeoFrame } from "../AppVimeoFrame";
import { AppYoutubeFrame } from "../AppYoutubeFrame";
import { AppDacastFrame } from "../AppDacastFrame";
import { AppKnovioPlayer } from "../AppKnovioPlayer";
import { AppSwisscomFrame } from "../AppSwisscomFrame";
import "./assets/scss/style.scss";
import { Session } from "../../../AdminModule/models";
import { useBuildAssetPath } from "../../hooks";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import placeholder from "./assets/images/imgthumb.svg";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER },
} = UPLOAD;
interface AppStreamManagerProps {
    session: Session;
}
export const AppStreamManager: FC<AppStreamManagerProps> = ({
    session,
}): JSX.Element => {
    const { t } = useTranslation();
    const [time, setTime] = useState<Duration>();
    const [startedSession, isSessionStarted] = useState<boolean>(false);
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
                if (new Date() <= new Date(session.start)) {
                    if (session.start) {
                        const timeLeft = intervalToDuration({
                            start: new Date(),
                            end: new Date(session.start),
                        });
                        setTime(timeLeft);
                    }
                } else {
                    isSessionStarted(true);
                }
            }, 1000);
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
                        <h1>
                            {time && time.years
                                ? `${time.years} ${t(
                                      "sessionDetails:label.years"
                                  )} `
                                : ""}
                            {time && time.months
                                ? `${time.months} ${t(
                                      "sessionDetails:label.month"
                                  )} `
                                : ""}
                            {time && time.days
                                ? `${time.days} ${t(
                                      "sessionDetails:label.days"
                                  )} `
                                : ""}
                            {time && time.hours ? `${time.hours} : ` : " 0 : "}
                            {time && time.minutes
                                ? `${time.minutes} : `
                                : "0 : "}
                            {time && time.seconds ? `${time.seconds}` : " 0"}
                        </h1>
                    </div>
                </div>
            );
        }

        switch (session.streamType) {
            case "VIMEO":
                return (
                    <AppVimeoFrame
                        url={session.streamUrl}
                        width="10"
                        height="10"
                    />
                );
            case "YOUTUBE":
                return (
                    <AppYoutubeFrame
                        url={session.streamUrl}
                        width="1522"
                        height="910"
                    />
                );
            case "DACAST":
                return (
                    <AppDacastFrame
                        id="dacast"
                        provider="dacast"
                        width={1522}
                        height={910}
                        configuration={{
                            videoURL: session.streamUrl,
                        }}
                    />
                );
            case "KNOVIO":
                return (
                    <AppKnovioPlayer
                        width={1522}
                        height={910}
                        linkUrl={session.streamUrl}
                    />
                );

            case "SWISSCOM":
                return (
                    <AppSwisscomFrame
                        url={session.streamUrl}
                        width={1522}
                        height={910}
                    />
                );

            default:
                return (
                    <>
                        <div className="imageContainer">
                            <i style={style}></i>
                        </div>
                    </>
                );
        }
    };

    return <div className="app-video-stream">{renderStream()}</div>;
};
