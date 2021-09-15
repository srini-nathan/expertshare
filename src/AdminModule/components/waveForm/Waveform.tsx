import React, { FC, useState, useRef, useEffect } from "react";
import AudioSpectrum from "react-audio-spectrum";
import { useGlobalData } from "../../../AppModule/contexts";
import "./waveform.scss";

interface WaveformProps {
    url: string;
    loop: boolean;
}

const Waveform: FC<WaveformProps> = ({ url, loop }) => {
    const { container } = useGlobalData();

    const audioRef: { current: any } = useRef(null);
    const playPauseRef: { current: any } = useRef(null);
    const [playing, setPlaying] = useState(true);
    const [captureImage, setCaptureImage] = useState(null) as any;
    const [mute, setMute] = useState(false);
    const [showRange, setShowRange] = useState(false);
    const [volRang, setVolRang] = useState(100);

    const onPlayPause = () => {
        const el = document.getElementById("audio-canvas") as HTMLCanvasElement;
        if (el) {
            const image = el.toDataURL("image/png");
            setCaptureImage(image);
        }
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause();
                setPlaying(false);
            } else {
                audioRef.current.play();
                setPlaying(true);
            }
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
            audioRef.current.muted = false;
        }
    }, []);

    const isMusicPlaying = () => {
        return playing;
    };

    const onVolumeChange = () => {
        const el = document.getElementById("audio-canvas") as HTMLCanvasElement;
        if (el) {
            const image = el.toDataURL("image/png");
            setCaptureImage(image);
        }
        setMute(!mute);
    };

    const handleRange = (event) => {
        audioRef.current.volume = event.target.value / 100;
        setVolRang(Number(event.target.value));
    };
    const handleMouseEvent = () => {
        setShowRange(true);
    };
    const handleMouseLeave = () => {
        setShowRange(false);
    };
    const handleVolumeClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
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
                {mute ? (
                    <i className="fal fa-volume-mute" />
                ) : (
                    <div className="audio-volume">
                        <div className={showRange ? "range" : "disableRange"}>
                            <label className="volumeRange">
                                <div
                                    className="btn-volume"
                                    onMouseLeave={() => handleMouseLeave()}
                                >
                                    <i className="far fa-volume" />
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volRang}
                                        onChange={handleRange}
                                        onClick={(e) => handleVolumeClick(e)}
                                        step="1"
                                    />
                                    <i className="fal fa-volume-mute" />
                                </div>
                                {setShowRange}
                            </label>
                        </div>
                        {volRang === 0 ? (
                            <i
                                className="fal fa-volume-mute"
                                onMouseEnter={() => handleMouseEvent()}
                            />
                        ) : (
                            <i
                                className="far fa-volume"
                                onMouseEnter={() => handleMouseEvent()}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Waveform;
