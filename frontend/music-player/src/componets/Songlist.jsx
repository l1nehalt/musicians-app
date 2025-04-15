import React from 'react';

const SongList = ({ songs, currentSongIndex, onSelect }) => {
    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {songs.map((song, index) => (
                <li
                    key={index}
                    onClick={() => onSelect(index)}
                    style={{
                        padding: '12px 15px',
                        margin: '5px 0',
                        borderRadius: '8px',
                        backgroundColor: index === currentSongIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        fontWeight: index === currentSongIndex ? 'bold' : 'normal',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <span>{song.title}</span>
                    <span style={{ color: '#a0a0a0', fontSize: '0.9em' }}>{song.artist}</span>
                </li>
            ))}
        </ul>
    );
};
export default SongList;