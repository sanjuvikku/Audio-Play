import React, { useState, useEffect } from 'react';

const AudioPlayer = ({ file, onEnded }) => {
  const [audio] = useState(new Audio());
  const [nowPlaying, setNowPlaying] = useState('');

  useEffect(() => {
    const handleCanPlayThrough = () => {
      audio.play();
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [audio]);

  useEffect(() => {
    audio.pause();
    audio.src = file;
    setNowPlaying(getFileName(file));
  }, [file, audio]);

  useEffect(() => {
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [audio, onEnded]);

  const getFileName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div>
      <p>Now Playing: {nowPlaying}</p>
      <audio controls>
        <source src={file} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

const Playlist = ({ files, onFileSelected }) => {
  return (
    <div>
      <h2>Playlist</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => onFileSelected(index)}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  useEffect(() => {
    const savedIndex = localStorage.getItem('currentFileIndex');
    if (savedIndex) {
      setCurrentFileIndex(parseInt(savedIndex, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentFileIndex', currentFileIndex);
  }, [currentFileIndex]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files).map((file) => URL.createObjectURL(file));
    setPlaylist((prevPlaylist) => [...prevPlaylist, ...newFiles]);
  };

  const handleFileSelected = (index) => {
    setCurrentFileIndex(index);
  };

  const handleAudioEnded = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  return (
    <div>
      <h1>Audio Player</h1>
      <input type="file" accept="audio/mp3" onChange={handleFileChange} multiple />
      {playlist.length > 0 && (
        <div>
          <AudioPlayer file={playlist[currentFileIndex]} onEnded={handleAudioEnded} />
          <Playlist files={playlist} onFileSelected={handleFileSelected} />
        </div>
      )}
    </div>
  );
};

export default App;
