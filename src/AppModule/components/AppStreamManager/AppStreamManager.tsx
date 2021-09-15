import React, { FC, useEffect, useMemo, useState } from "react";
import { intervalToDuration, addSeconds } from "date-fns";
import { useTranslation } from "react-i18next";
import { AppVimeoFrame } from "../AppVimeoFrame";
import { AppYoutubeFrame } from "../AppYoutubeFrame";
import { AppDacastFrame } from "../AppDacastFrame";
import { AppKnovioPlayer } from "../AppKnovioPlayer";
import { AppSwisscomFrame } from "../AppSwisscomFrame";
import { Session } from "../../../AdminModule/models";
import { useAuthState, useBuildAssetPath, useParamId } from "../../hooks";
import { FileTypeInfo } from "../../models";
import { CONSTANTS } from "../../../config";
import placeholder from "./assets/images/imgthumb.svg";
import { AppButton } from "../AppButton";
import { getDateTimeWithoutTimezone } from "../../utils";
import "./assets/scss/style.scss";
import { AppVideoPlayer } from "../AppVideoPlayer";
import { useGlobalData } from "../../contexts";

let interval: number;
let intervalForDestroy: number;
declare global {
    interface Window {
        ZoomMtg:
            | { [key: string]: () => void }
            | { [key: string]: { [key: string]: string } };
    }
}

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER },
} = UPLOAD;

interface AppStreamManagerProps {
    session: Session;
    isLive: (value: boolean) => void;
    live: boolean;
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
        case "ZOOM":
            return (
                <div className="imageContainer">
                    <i style={style}></i>
                    <div className="overlay">
                        <div className="overlay--content"></div>
                    </div>
                </div>
            );
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

const zoomLinks = [
    "https://source.zoom.us/1.9.8/lib/vendor/react.min.js",
    "https://source.zoom.us/1.9.8/lib/vendor/react-dom.min.js",
    "https://source.zoom.us/1.9.8/lib/vendor/redux.min.js",
    "https://source.zoom.us/1.9.8/lib/vendor/redux-thunk.min.js",
    "https://source.zoom.us/1.9.8/lib/vendor/lodash.min.js",
    "https://source.zoom.us/zoom-meeting-1.9.8.min.js",
];

const zoomStyles = [
    "https://source.zoom.us/1.9.8/css/bootstrap.css",
    "https://source.zoom.us/1.9.8/css/react-select.css",
];

export const AppStreamManager: FC<AppStreamManagerProps> = ({
    session,
    isLive,
    live,
    getAgenda,
}): JSX.Element => {
    const { user } = useAuthState();
    const { container } = useGlobalData();
    const { id } = useParamId();
    const { streamType } = session;
    useEffect(() => {
        return (): void => {
            clearInterval(intervalForDestroy);
            clearInterval(interval);
        };
    }, []);

    const createScriptTagUrl = (url: string): Element => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        return script;
    };

    const createLinkCss = (url: string): Element => {
        const link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        return link;
    };

    const createZoomConnection = (): Element => {
        const scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";
        const jsScript = `(() => {
                let interval; 
                const ZoomMtg = document.getElementById('${id}').contentWindow.ZoomMtg;
                ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.8/lib", "/av");
                ZoomMtg.preLoadWasm();
                ZoomMtg.prepareWebSDK();
                
                const zoomInit = () => {
                    ZoomMtg.init({
                        leaveUrl: "${window.location.href}",
                        isSupportAV: true,
                        disablePreview: true,
                        success: () => {
                            ZoomMtg.join({
                                signature: "${session.zoomSignature}",
                                meetingNumber: "${session.zoomMeetingNumber}",
                                userName: "${user.firstName} ${user.lastName}",
                                apiKey: "${
                                    ((container?.configuration as unknown) as {
                                        [key: string]: string;
                                    }).zoomKey
                                }",
                                passWord: "${session.zoomMeetingPassword}",
                                success: (successS) => {
                                    console.log({ successS });
                                },
                                error: (errorF) => {
                                    console.log({ errorF });
                           
                                    interval = setInterval(() => {
                                        const buttons = document.getElementById('${id}').contentDocument.querySelectorAll('.zm-btn.zm-btn-legacy.zm-btn--primary.zm-btn__outline--blue');
                                        if (buttons.length) {
                                            clearInterval(interval);
                                            for (let i = 0; i < buttons.length; i++) {
                                                if (buttons[i].textContent === "Retry") {
                                                    buttons[i].addEventListener("click", () => {
                                                        zoomInit();
                                                        buttons[i].removeEventListener('click', () => {
                                                            zoomInit();
                                                        });
                                                    });
                                                    
                                                }
                                            }
                                        }
                                    }, 200)
                                },
                            });
    
                            const zmJoinBtn = document.getElementById('${id}').contentDocument.querySelector(".joinWindowBtn");
    
                            if (zmJoinBtn) {
                                zmJoinBtn.click();
                            }
                        },
                        error: (errorS) => {
                            console.log({ errorS });
                        },
                    });
                };
                
                zoomInit();
              })();
        `;

        scriptTag.innerHTML = jsScript;

        return scriptTag;
    };

    const newConnect = (): void => {
        const overlay = document.querySelector(".overlay");
        if (overlay && !document.getElementById(id)) {
            const zoomIframe = document.createElement("iframe");
            zoomIframe.id = id;
            zoomIframe.allow = "microphone; camera; fullscreen;";
            zoomIframe.onload = () => {
                zoomLinks.map((url) =>
                    zoomIframe.contentDocument
                        ?.querySelector("body")
                        ?.appendChild(createScriptTagUrl(url))
                );
                zoomStyles.map((url) =>
                    zoomIframe.contentDocument
                        ?.querySelector("head")
                        ?.appendChild(createLinkCss(url))
                );
            };
            overlay.appendChild(zoomIframe);
            interval = setInterval(() => {
                if (
                    (document.getElementById(id) as HTMLIFrameElement)
                        ?.contentWindow?.ZoomMtg
                ) {
                    zoomIframe.appendChild(createZoomConnection());
                    clearInterval(interval);
                }
            }, 100);
            intervalForDestroy = setInterval(() => {
                if (
                    (document.getElementById(id) as HTMLIFrameElement) &&
                    (document.getElementById(
                        id
                    ) as HTMLIFrameElement)?.contentDocument?.querySelector(
                        "noscript"
                    )
                ) {
                    zoomIframe.remove();
                    clearInterval(intervalForDestroy);
                }
            }, 1000);
        }
    };

    useMemo(() => {
        if (live && session && streamType === "ZOOM" && session.zoomSignature) {
            newConnect();
        }
    }, [live, session]);

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
                            {!live && (
                                <AppButton
                                    onClick={() => {
                                        getAgenda();
                                    }}
                                    variant="secondary"
                                >
                                    {t("sessionDetails:button.goToLiveSession")}
                                </AppButton>
                            )}
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
