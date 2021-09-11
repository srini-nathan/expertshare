import React, { FC, useState, useRef } from "react";
import AudioSpectrum from "react-audio-spectrum";
import "./waveform.scss";

interface WaveformProps {
    url: string;
    loop: boolean;
}

const Waveform: FC<WaveformProps> = ({ url, loop }) => {
    const audioRef: { current: any } = useRef(null);
    const [playing, setPlaying] = useState(true);
    const [captureImage, setCaptureImage] = useState(null) as any;
    const [showRange, setShowRange] = useState(false);
    const [volRang, setVolRang] = useState(100);

    // const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

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

    const isMusicPlaying = () => {
        return playing;
    };

    const onVolumeChange = () => {
        setShowRange(!showRange);
    };

    const handleRange = (event) => {
        audioRef.current.volume = event.target.value / 100;
        setVolRang(event.target.value);
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
            <div className="playButton" onClick={onPlayPause}>
                {playing ? (
                    <i className="far fa-pause-circle" />
                ) : (
                    <i className="far fa-play-circle" />
                )}
            </div>
            <audio
                id="audio-element"
                preload="true"
                autoPlay
                src={url}
                crossOrigin="anonymous"
                ref={audioRef}
                loop={loop}
            />
            {!isMusicPlaying() && <img src={captureImage} alt="" />}
            <AudioSpectrum
                id="audio-canvas"
                height={45}
                width={180}
                audioId="audio-element"
                capHeight={2}
                meterWidth={2}
                meterCount={512}
                silent={true}
                meterColor={[{ stop: 0.5, color: "#0CD7FD" }]}
                gap={4}
            />

            <div className="playButton margin-left" onClick={onVolumeChange}>
                <div>
                    <div className={showRange ? "range" : "disableRange"}>
                        <label className="volumeRange">
                            <input
                                id="audio-element"
                                type="range"
                                min="0"
                                max="100"
                                value={volRang}
                                onChange={handleRange}
                                onAbortCapture={handleVolumeClick}
                                step="1"
                            />
                            {setShowRange}
                        </label>
                    </div>
                    <i className="fas fa-volume-up" />
                </div>
            </div>
        </div>
    );
};

export default Waveform;
