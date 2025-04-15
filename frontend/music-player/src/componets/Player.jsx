import React, {useCallback, useEffect, useRef, useState} from 'react';
import {IoMdMusicalNote} from 'react-icons/io';
import {
    FaChevronDown,
    FaChevronUp,
    FaPause,
    FaPlay,
    FaStepBackward,
    FaStepForward,
    FaUser
} from 'react-icons/fa';

const Player = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeSection, setActiveSection] = useState('tracks');
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

    const userPlaylists = [
        {name: "Favorites", songs: 24},
        {name: "Workout Mix", songs: 18},
        {name: "Chill Vibes", songs: 32},
        {name: "Road Trip", songs: 45},
    ];

    const [currentSongIndex, setCurrentSongIndex] = useState(0);

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

    const toggleSections = (section) => {
        setActiveSection(prev => (prev === section ? 'tracks' : section));
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleEnded = () => playNext();
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [playNext]);

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

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div className="music-app">
            <div className="player-section">
                <div className="player-card">
                    <div className="album-art">
                        <div className="art-placeholder">
                            <IoMdMusicalNote size={60} color="#fff"/>
                        </div>
                    </div>

                    <div className="song-info">
                        <h2 className="song-title">{songs[currentSongIndex].title}</h2>
                        <p className="song-artist">{songs[currentSongIndex].artist}</p>
                    </div>

                    <div className="progress-container">
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
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
                    </div>

                    <div className="controls">
                        <button className="control-btn" onClick={playPrevious}>
                            <FaStepBackward size={20}/>
                        </button>
                        <button className="play-btn" onClick={togglePlay}>
                            {isPlaying ? <FaPause size={24}/> : <FaPlay size={24}/>}
                        </button>
                        <button className="control-btn" onClick={playNext}>
                            <FaStepForward size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="content-section">
                <div
                    className="user-profile"
                    onClick={() => toggleSections('playlists')}
                >
                    <div className="user-avatar">
                        <FaUser size={24}/>
                    </div>
                    <div className="user-info">
                        <div className="user-name">John Doe</div>
                        <div className="user-status">Premium Member</div>
                    </div>
                    <div className="search-container">
                        <input type="text" placeholder="Search..." className="search-bar"/>
                    </div>
                </div>

                <div className="section-container">
                    <div className={`user-playlists-section ${activeSection === 'playlists' ? 'visible' : 'hidden'}`}>
                        <div
                            className="section-header"
                            onClick={() => toggleSections('playlists')}
                        >
                            <h3 className="section-title">Your Playlists</h3>
                            <div className="toggle-icon">
                                {activeSection === 'playlists' ? <FaChevronUp/> : <FaChevronDown/>}
                            </div>
                        </div>
                        <div className="playlists-container">
                            {userPlaylists.map((playlist, index) => (
                                <div key={index} className="playlist-item">
                                    <div className="playlist-icon">
                                        <IoMdMusicalNote size={20}/>
                                    </div>
                                    <div className="playlist-info">
                                        <div className="playlist-name">{playlist.name}</div>
                                        <div className="playlist-count">{playlist.songs} songs</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`tracks-section ${activeSection !== 'playlists' ? 'visible' : 'hidden'}`}>
                        <div
                            className="section-header"
                            onClick={() => toggleSections('tracks')}
                        >
                            <h3 className="section-title">Now Playing</h3>
                            <div className="toggle-icon">
                                {activeSection !== 'playlists' ? <FaChevronUp/> : <FaChevronDown/>}
                            </div>
                        </div>
                        <div className="tracks-container">
                            {songs.map((song, index) => (
                                <div
                                    key={index}
                                    className={`track-item ${index === currentSongIndex ? 'active' : ''}`}
                                    onClick={() => {
                                        setCurrentSongIndex(index);
                                        setIsPlaying(true);
                                    }}
                                >
                                    <div className="track-number">{index + 1}</div>
                                    <div className="track-info">
                                        <div className="track-title">{song.title}</div>
                                        <div className="track-artist">{song.artist}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={songs[currentSongIndex].src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
            />
        </div>
    );
};

const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Player;
