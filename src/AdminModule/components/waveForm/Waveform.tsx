import React, { FC, useState, useRef } from "react";
import AudioSpectrum from "react-audio-spectrum";
import "./waveform.scss";

interface WaveformProps {
    url: string;
    loop: boolean;
}

const Waveform: FC<WaveformProps> = ({ url, loop }) => {
    const audioRef: { current: any } = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [captureImage, setCaptureImage] = useState(null);
    const [mute, setMute] = useState(false);

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
        return playing && !mute;
    };

    const onVolumeChange = () => {
        const el = document.getElementById("audio-canvas") as HTMLCanvasElement;
        if (el) {
            const image = el.toDataURL("image/png");
            setCaptureImage(image);
        }
        setMute(!mute);
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
                muted={mute}
                src={url}
                crossOrigin="anonymous"
                ref={audioRef}
                loop={loop}
            />
            {!isMusicPlaying() && <img src={captureImage} alt="" />}
            <AudioSpectrum
                id="audio-canvas"
                height={45}
                width={210}
                audioId="audio-element"
                capHeight={2}
                meterWidth={2}
                meterCount={512}
                silent={true}
                meterColor={[{ stop: 0.5, color: "#0CD7FD" }]}
                gap={4}
            />

            <div className="playButton margin-left" onClick={onVolumeChange}>
                {mute ? (
                    <i className="fas fa-volume-mute" />
                ) : (
                    <i className="fas fa-volume-up" />
                )}
            </div>
        </div>
    );
};

export default Waveform;
