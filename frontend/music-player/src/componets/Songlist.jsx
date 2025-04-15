import React from 'react';

const SongList = ({ songs, currentSongIndex, onSelect }) => {
    return (
        <ul>
            {songs.map((song, index) => (
                <li
                    key={index}
                    onClick={() => onSelect(index)}
                    style={{
                        fontWeight: index === currentSongIndex ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    {song.title}
                </li>
            ))}
        </ul>
    );
};

export default SongList;