import React, { FC, useState, useRef, useEffect } from "react";
import AudioSpectrum from "react-audio-spectrum";
import { useMatch } from "@reach/router";
import { AppContext, useGlobalData } from "../../../AppModule/contexts";
import "./waveform.scss";

interface WaveformProps {
    url: string;
    loop: boolean;
}

const Waveform: FC<WaveformProps> = ({ url, loop }) => {
    const { container } = useGlobalData();
    const {
        state: { welcomePlayerStatus },
    } = React.useContext(AppContext);
    const showedWelcomeModal = localStorage.getItem("showed-welcome-modal");
    const sessionDetailPage = useMatch("/event/:conferenceId/session/:id");

    const audioRef: { current: any } = useRef(null);
    const playPauseRef: { current: any } = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [captureImage, setCaptureImage] = useState(null) as any;
    const [mute, setMute] = useState(false);
    const [showRange, setShowRange] = useState(false);
    const [volRang, setVolRang] = useState(100);

    useEffect(() => {
        if (welcomePlayerStatus === false) {
            audioRef.current.play();
            setPlaying(true);
        }
    }, [welcomePlayerStatus]);

    const saveImageAndPause = () => {
        const el = document.getElementById("audio-canvas") as HTMLCanvasElement;
        if (el && !audioRef.current.paused) {
            const image = el.toDataURL("image/png");
            setCaptureImage(image);
        }
        audioRef.current.pause();
        setPlaying(false);
    };

    useEffect(() => {
        setInterval(() => {
            const isSessionDetailsViewVisible = localStorage.getItem(
                "isSessionDetailsViewVisible"
            );
            if (isSessionDetailsViewVisible) {
                saveImageAndPause();
            }
        }, 1000);
    }, []);

    useEffect(() => {
        if (sessionDetailPage && playing) {
            saveImageAndPause();
        }
    }, [sessionDetailPage]);

    const onPlayPause = () => {
        if (audioRef.current) {
            if (playing) {
                saveImageAndPause();
            } else {
                audioRef.current.play();
                setPlaying(true);
            }
        }
    };

    useEffect(() => {
        if (
            audioRef.current &&
            showedWelcomeModal === "true" &&
            !sessionDetailPage
        ) {
            audioRef.current.play();
            audioRef.current.muted = false;
            setPlaying(true);
        }
    }, []);

    const isMusicPlaying = () => {
        return playing;
    };

    const onVolumeChange = () => {
        saveImageAndPause();
        setMute(!mute);
    };

    const handleRange = (event) => {
        audioRef.current.volume = event.target.value / 100;
        setVolRang(Number(event.target.value));
    };

    const handleMouseEvent = () => {
        setShowRange(true);
    };
    const onVolumeBtnClick = (e, btnType) => {
        if (btnType === "volume") {
            audioRef.current.volume = 0.01;
            setVolRang(e);
        } else {
            audioRef.current.volume = 1;
            setVolRang(e);
        }
    };

    const handleMouseLeave = () => {
        setShowRange(false);
    };
    const handleVolumeClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
    };

    const onAudioEnd = () => {
        if (!loop) {
            saveImageAndPause();
        }
    };

    return (
        <div
            className={`waveformContainer ${
                isMusicPlaying() ? "playing" : "not-playing"
            }`}
        >
            <div
                className="playButton"
                onClick={onPlayPause}
                ref={playPauseRef}
            >
                {playing ? (
                    <i className="far fa-pause-circle" />
                ) : (
                    <i className="far fa-play-circle" />
                )}
            </div>
            <audio
                id="audio-element"
                preload="true"
                src={url}
                crossOrigin="anonymous"
                ref={audioRef}
                loop={loop}
                onEnded={onAudioEnd}
            />
            {!isMusicPlaying() && (
                <div className="img-wrapper">
                    <img
                        src={captureImage}
                        style={{
                            borderColor:
                                container?.designConfiguration
                                    ?.widMusicBarColor,
                        }}
                        alt=""
                        className=""
                    />
                </div>
            )}
            <AudioSpectrum
                id="audio-canvas"
                height={35}
                width={"auto"}
                audioId="audio-element"
                capHeight={2}
                meterWidth={2}
                meterCount={512}
                meterColor={[
                    {
                        stop: 0.5,
                        color: container?.designConfiguration?.widMusicBarColor,
                    },
                ]}
                gap={4}
            />
            <div className="playButton" onClick={onVolumeChange}>
                {audioRef?.current?.volume === 0.01 ? (
                    <div onClick={(e) => onVolumeBtnClick(e, "mute")}>
                        <i
                            className="fal fa-volume-mute"
                            onMouseEnter={handleMouseEvent}
                        />
                    </div>
                ) : (
                    <div className="audio-volume">
                        <div className={showRange ? "range" : "disableRange"}>
                            <label className="volumeRange">
                                <div
                                    className="btn-volume"
                                    onMouseLeave={() => handleMouseLeave()}
                                >
                                    <i
                                        className="far fa-volume"
                                        onClick={() =>
                                            onVolumeBtnClick(100, "mute")
                                        }
                                    />
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={volRang}
                                        onChange={handleRange}
                                        onClick={(e) => handleVolumeClick(e)}
                                        step="1"
                                    />
                                    <i
                                        className="fal fa-volume-mute"
                                        onClick={() =>
                                            onVolumeBtnClick(1, "volume")
                                        }
                                    />
                                </div>
                                {setShowRange}
                            </label>
                        </div>
                        {audioRef?.current?.volume === 0.01 ? (
                            <div onClick={() => onVolumeBtnClick(1, "mute")}>
                                <i
                                    className="fal fa-volume-mute"
                                    onMouseEnter={() => handleMouseEvent()}
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => onVolumeBtnClick(100, "volume")}
                            >
                                <i
                                    className="far fa-volume"
                                    onMouseEnter={() => handleMouseEvent()}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Waveform;
