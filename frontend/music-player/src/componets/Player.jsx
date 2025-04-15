import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { IoMdMusicalNote } from 'react-icons/io';
import SongList from "./Songlist";

const Player = () => {
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    const songs = [
        {
            title: "Blinding Lights",
            artist: "The Weeknd",
            src: process.env.PUBLIC_URL + "/audio/The_Weeknd-Blinding-Lights.mp3"
        },
        {
            title: "Save Your Tears",
            artist: "The Weeknd",
            src: process.env.PUBLIC_URL + "/audio/song2.mp3"
        },
    ];
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    // Memoized callbacks to prevent unnecessary effect re-runs
    const playNext = useCallback(() => {
        setCurrentSongIndex((prevIndex) =>
            prevIndex === songs.length - 1 ? 0 : prevIndex + 1
        );
    }, [songs.length]);

    const playPrevious = useCallback(() => {
        setCurrentSongIndex((prevIndex) =>
            prevIndex === 0 ? songs.length - 1 : prevIndex - 1
        );
    }, [songs.length]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
                console.error("Playback failed:", error);
            });
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
    }, []);

    const handleSeek = useCallback((e) => {
        if (!audioRef.current) return;
        const newTime = e.target.value;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }, []);

    // Auto-switch when track ends
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => playNext();
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [playNext]);

    // Reset playback when changing tracks
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(error => {
                console.error("Playback failed:", error);
                setIsPlaying(false);
            });
        }
    }, [currentSongIndex, isPlaying]);

    // Cleanup audio reference on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div className="apple-player">
            <div className="album-art">
                <div className="art-placeholder">
                    <IoMdMusicalNote size={60} color="#888" />
                </div>
            </div>

            <div className="song-info">
                <h2 className="song-title">{songs[currentSongIndex].title}</h2>
                <p className="song-artist">{songs[currentSongIndex].artist}</p>
            </div>

            <div className="progress-container">
                <div className="progress-bar">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="progress-slider"
                    />
                </div>
                <div className="time-display">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="controls">
                <button className="control-btn" onClick={playPrevious}>
                    <FaStepBackward size={20} />
                </button>
                <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>
                <button className="control-btn" onClick={playNext}>
                    <FaStepForward size={20} />
                </button>
            </div>

            <button
                className="playlist-toggle"
                onClick={() => setShowPlaylist(!showPlaylist)}
            >
                {showPlaylist ? '▲ Hide Playlist' : '▼ Show Playlist'}
            </button>

            {showPlaylist && (
                <SongList
                    songs={songs}
                    currentSongIndex={currentSongIndex}
                    onSelect={(index) => {
                        setCurrentSongIndex(index);
                        setIsPlaying(true);
                    }}
                />
            )}

            <audio
                ref={audioRef}
                src={songs[currentSongIndex].src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
            />
        </div>
    );
};

// Helper function for time formatting
const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Player;