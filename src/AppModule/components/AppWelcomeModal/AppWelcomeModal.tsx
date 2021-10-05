import React, { FC, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./assets/scss/style.scss";
import { AppContext, ContainerTypes, useGlobalData } from "../../contexts";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath, useUserLocale } from "../../hooks";
import { FileTypeInfo } from "../../models";
import { AuthContext } from "../../../SecurityModule/contexts";
import { AuthState } from "../../../SecurityModule/models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONFIGURATION },
} = UPLOAD;

interface AppWelcomeModalProps {
    show: boolean;
    handleClose: () => void;
}
export const AppWelcomeModal: FC<AppWelcomeModalProps> = ({
    show,
    handleClose,
}): JSX.Element => {
    const { dispatch } = React.useContext(AppContext);
    const { container } = useGlobalData();
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const { locale } = useUserLocale();
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [enable, isEnable] = React.useState(false);
    const [fullScreen, isFullScreen] = React.useState(false);
    const [media, setMedia] = React.useState("");
    const [content, setContent] = React.useState("");
    const videoPlayerRef = useRef<HTMLVideoElement>();
    const videoPlayPausehandler = () => {
        if (!videoPlayerRef || !videoPlayerRef.current) {
            return;
        }
        if (videoPlayerRef.current.paused) {
            videoPlayerRef.current.play();
            setIsPlaying(true);
        } else {
            videoPlayerRef.current.pause();
            setIsPlaying(false);
        }
    };
    const settingFilePath = useBuildAssetPath(
        FILETYPEINFO_CONFIGURATION as FileTypeInfo
    );
    useEffect(() => {
        if (container) {
            if (
                container.configuration &&
                (container.configuration as any).isWelcomeBannerEnable
            )
                isEnable(true);
            if (
                container.configuration &&
                (container.configuration as any).isWelcomeBannerFullScreenEnable
            )
                isFullScreen(true);

            if (
                container.configuration &&
                (container.configuration as any).translations &&
                (container.configuration as any).translations
            ) {
                (container.configuration as any).translations.forEach(
                    (e: any) => {
                        const fLocale =
                            user && user.locale && user.locale !== ""
                                ? user.locale
                                : locale;
                        if (e.locale === fLocale) {
                            if (e.welcomeBannerMedia)
                                setMedia(e.welcomeBannerMedia);
                            if (e.welcomeBannerContent)
                                setContent(e.welcomeBannerContent);
                        }
                    }
                );
            }
        }
    }, []);

    const showedWelcomeModal = localStorage.getItem("showed-welcome-modal");

    const handleCloseModal = () => {
        localStorage.setItem("showed-welcome-modal", "true");
        handleClose();
        dispatch({
            type: ContainerTypes.WELCOME_PLAYER_STATUS,
            payload: false,
        });
    };

    const renderBanner = () => {
        if (media !== "") {
            return (
                <div className="video-container m-0 p-0 position-relative">
                    <video
                        id="video-player"
                        className="video-player"
                        autoPlay
                        ref={(ref) => {
                            if (ref) {
                                videoPlayerRef.current = ref;
                            }
                        }}
                        onPlay={() => {
                            setIsPlaying(true);
                        }}
                    >
                        <source
                            src={`${settingFilePath}/${media}`}
                            type="video/mp4"
                        />
                    </video>
                    <div
                        className="play-button-overlay"
                        onClick={() => videoPlayPausehandler()}
                    >
                        <a href="#">
                            {!isPlaying && (
                                // (
                                //     <i
                                //         className="fas fa-pause"
                                //         aria-hidden="true"
                                //     ></i>
                                // )
                                //  :
                                <i
                                    className="fak fa-play-solid"
                                    aria-hidden="true"
                                ></i>
                            )}
                        </a>
                    </div>
                </div>
            );
        }
        return (
            <div
                className="welcome-modal-body"
                dangerouslySetInnerHTML={{ __html: content }}
            ></div>
        );
    };

    return (
        <Modal
            show={!showedWelcomeModal && show && enable}
            onHide={handleCloseModal}
            keyboard={false}
            className={`app-welcome-model p-0 ${
                fullScreen && media !== "" ? "fullscreen" : ""
            }`}
        >
            <Modal.Body>{renderBanner()}</Modal.Body>

            <a href="#" className="close-btn" onClick={handleCloseModal}>
                <i className="fak fa-close-vlight"></i>
            </a>
        </Modal>
    );
};
