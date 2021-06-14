import React, { FC, useRef } from "react";

import { Modal } from "react-bootstrap";
import "./assets/scss/style.scss";
import placeholder from "../../assets/images/profile.jpg";
import logo from "../../assets/images/logo.png";

interface AppWelcomeModalProps {
    show: boolean;
    handleClose: () => void;
    mode?: "video" | "text";
}
export const AppWelcomeModal: FC<AppWelcomeModalProps> = ({
    show,
    handleClose,
    mode = "text",
}): JSX.Element => {
    const [isPlaying, setIsPlaying] = React.useState(false);
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

    const showedWelcomeModal = localStorage.getItem("showed-welcome-modal");

    const handleCloseModal = () => {
        localStorage.setItem("showed-welcome-modal", "true");
        handleClose();
    };

    return (
        <Modal
            show={!showedWelcomeModal && show}
            onHide={handleCloseModal}
            keyboard={false}
            className="app-welcome-model"
        >
            <Modal.Body>
                {mode === "text" && (
                    <div className="row m-0 p-0">
                        <div className="image-container col-12 col-md-6 col-lg-6 col-xl-7 px-0">
                            <i
                                style={{
                                    backgroundImage: `url(${placeholder})`,
                                }}
                            ></i>
                        </div>
                        <div className="base-container col-12 col-md-6 col-lg-6 col-xl-5 px-4 py-3 px-md-5 py-md-5">
                            <div
                                className="base-container--logo mt-2 mt-md-4"
                                style={{
                                    backgroundImage: `url(${logo})`,
                                }}
                            ></div>
                            <div className="base-container--title pt-3 pb-3 pt-md-4 pb-md-5">
                                <h1>We denounce with righteous indignation.</h1>
                            </div>
                        </div>
                    </div>
                )}
                {mode === "video" && (
                    <div className="video-container m-0 p-0 position-relative">
                        <video
                            id="video-player"
                            className="video-player"
                            loop
                            ref={(ref) => {
                                if (ref) {
                                    videoPlayerRef.current = ref;
                                }
                            }}
                        >
                            <source
                                src="https://www.w3schools.com/tags/movie.mp4"
                                type="video/mp4"
                            />
                        </video>
                        <div
                            className="play-button-overlay"
                            onClick={() => videoPlayPausehandler()}
                        >
                            <a href="#">
                                {isPlaying ? (
                                    <i
                                        className="fas fa-pause"
                                        aria-hidden="true"
                                    ></i>
                                ) : (
                                    <i
                                        className="fak fa-play-solid"
                                        aria-hidden="true"
                                    ></i>
                                )}
                            </a>
                        </div>
                    </div>
                )}
            </Modal.Body>

            <a href="#" className="close-btn" onClick={handleCloseModal}>
                <i className="fak fa-close-vlight"></i>
            </a>
        </Modal>
    );
};
