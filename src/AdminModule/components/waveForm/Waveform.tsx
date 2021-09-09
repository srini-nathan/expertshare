/* eslint-disable */

import React, { FC, useState, useEffect, useRef } from "react";
import AudioSpectrum from "react-audio-spectrum";
import "./waveform.scss";

interface WaveformProps {
    url: string;
    loop: boolean;
}

const Waveform: FC<WaveformProps> = ({ url, loop }) => {
    const audioRef: { current: any } = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [mute, setMute] = useState(false);

    // const url = "https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3";

    const onPlayPause = () => {
        if(audioRef.current) {
            if (playing) {
                audioRef.current.pause();
                setPlaying(false);
            } else {
                audioRef.current.play();
                setPlaying(true);
            }
        }
    };

    const onVolumeChange = () => {
        setMute(!mute);
    };

    return (
        <div className="waveformContainer">
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
            <AudioSpectrum
                id="audio-canvas"
                height={45}
                width={220}
                audioId="audio-element"
                capHeight={0}
                meterWidth={2}
                meterCount={512}
                meterColor={[
                    { stop: 0.5, color: "#0CD7FD" },
                ]}
                gap={4}
            />
            <div className="playButton" onClick={onVolumeChange}>
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
