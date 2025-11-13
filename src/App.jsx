import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const PLAYLISTS = {
  "Chill Hits": ["Harleys In Hawaii.mp3", "mockingbird.mp3", "Bye Bye Bye.mp3"],

  "Top 50": ["After dark.mp3", "Courtesy-Call.mp3", "Don't-Be-Shy-Girl.mp3"],

  "Fresh Finds": ["Chk Chk Boom.mp3", "my ordinary life.mp3"]
};

function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingseconds = Math.floor(seconds % 60);
  const formattedminutes = String(minutes).padStart(2, '0');
  const formattedseconds = String(remainingseconds).padStart(2, '0');
  return `${formattedminutes}:${formattedseconds}`;
}

function App() {
  const audioRef = useRef(null);
  const [currentPlaylist, setCurrentPlaylist] = useState("Chill Hits");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [currentIndex, currentPlaylist]);

  const handlePlayPause = () => {
    // if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const songs = PLAYLISTS[currentPlaylist];
      return (prev - 1 + songs.length) % songs.length;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const songs = PLAYLISTS[currentPlaylist];
      return (prev + 1) % songs.length;
    });
  };

  const handleSongClick = (idx) => {
    setCurrentIndex(idx);
    setPlaying(true);
    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const bar = e.currentTarget.getBoundingClientRect();
    let percent = (e.clientX - bar.left) / bar.width;
    percent = Math.max(0, Math.min(1, percent));
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(percent * duration);
    }
  };

  const currentSongs = PLAYLISTS[currentPlaylist];

  return (
    <div className="w-screen h-screen min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Mobile header */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-b from-blue-900 via-purple-900 to-blue-950 text-blue-100 sticky top-0 z-30">
        <button onClick={() => setSidebarOpen(true)} className="p-2 focus:outline-none">
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="7" x2="22" y2="7" />
            <line x1="4" y1="13" x2="22" y2="13" />
            <line x1="4" y1="19" x2="22" y2="19" />
          </svg>
        </button>
        <span className="text-lg font-bold">Musicify</span>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="bg-gradient-to-b from-blue-900 via-purple-900 to-blue-950 flex flex-col w-3/4 max-w-xs h-full p-4 shadow-2xl animate-slideInLeft">
            <button onClick={() => setSidebarOpen(false)} className="mb-4 self-end p-1">
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="6" x2="20" y2="20" />
                <line x1="6" y1="20" x2="20" y2="6" />
              </svg>
            </button>

            <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-5 relative z-10">
              <img src="music.svg" alt="music player logo" className="sm:h-14 sm:w-14 h-10 w-10 drop-shadow-2xl rounded-2xl bg-white/5 p-2 border-2 border-blue-300/30 filter invert" />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-blue-100">Musicify</h2>
                <p className="text-xs text-blue-200 opacity-90 leading-tight">Vibe. Play. Repeat.</p>
              </div>
            </div>

            <div className="flex items-center mb-1 sm:mb-2">
              <div className="h-7 w-1 rounded-lg bg-blue-500 mr-2" />
              <img src="playlist.svg" alt="playlist" className="h-5 w-5 filter invert" />
              <h3 className="ml-2 text-base font-bold tracking-wide text-blue-200">Your Library</h3>
            </div>

            <h3 className="text-blue-200 font-bold mb-2">{currentPlaylist}</h3>
            <ul className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 hide-scrollbar">
              {currentSongs.map((song, idx) => (
                <li
                  key={song}
                  onClick={() => handleSongClick(idx)}
                  className={`relative flex items-center justify-between gap-4 p-2 rounded-xl cursor-pointer transition-all duration-200 shadow border border-blue-900 group ${currentIndex === idx ? 'bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 ring-2 ring-blue-300 shadow-blue-400/20 scale-105' : 'bg-blue-800 hover:bg-blue-900 hover:scale-102'}`}
                >
                  <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${currentIndex === idx ? 'bg-blue-400' : 'bg-blue-700'} transition-all`} />
                  <div className="flex items-center pl-2 min-w-0">
                    <img src="music.svg" alt="music" className="h-6 w-6 filter invert opacity-95 drop-shadow-lg flex-shrink-0" />
                    <div className="text-left ml-2 truncate">
                      <div className={`text-[13px] font-bold drop-shadow text-blue-100 truncate w-32 ${currentIndex === idx ? 'text-blue-300' : ''}`}>
                        {decodeURIComponent(song.replace('.mp3', ''))}
                      </div>
                      <div className="text-[10px] text-blue-300 truncate">Bilal</div>
                    </div>
                  </div>
                  <img src={currentIndex === idx && playing ? "pause.svg" : "play.svg"} alt="play" className={`h-4 w-4 filter invert group-hover:scale-125 transition-transform duration-300 ${currentIndex === idx ? 'animate-pulse' : ''}`} />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-black opacity-40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main grid */}
      <div className="max-w-full h-full mx-auto grid sm:grid-cols-12 gap-6 overflow-hidden grid-cols-1">
        {/* Desktop sidebar */}
        <aside className="hidden sm:flex sm:col-span-3 flex-col px-6 py-8 gap-8 relative overflow-hidden border border-blue-800 bg-gradient-to-b from-blue-900 via-purple-900 to-blue-950 shadow-2xl rounded-2xl">
          <div className="absolute sm:top-3 top-1 sm:left-3 left-1 sm:w-24 w-16 sm:h-24 h-16 rounded-full bg-indigo-500/30 blur-2xl z-0" />
          <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-5 relative z-10">
            <img src="music.svg" alt="music player logo" className="sm:h-14 sm:w-14 h-10 w-10 drop-shadow-2xl rounded-2xl bg-white/5 p-2 border-2 border-blue-300/30 filter invert" />
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-blue-100">Musicify</h2>
              <p className="text-xs text-blue-200 opacity-90 leading-tight">Vibe. Play. Repeat.</p>
            </div>
          </div>
          <h3 className="text-blue-200 font-bold mb-2">{currentPlaylist}</h3>
          <ul className="flex-1 flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 hide-scrollbar">
            {currentSongs.map((song, idx) => (
              <li
                key={song}
                onClick={() => handleSongClick(idx)}
                className={`relative flex items-center justify-between gap-4 p-2 rounded-xl cursor-pointer transition-all duration-200 shadow border border-blue-900 group ${currentIndex === idx ? 'bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 ring-2 ring-blue-300 shadow-blue-400/20 scale-105' : 'bg-blue-800 hover:bg-blue-900 hover:scale-102'}`}
              >
                <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${currentIndex === idx ? 'bg-blue-400' : 'bg-blue-700'} transition-all`} />
                <div className="flex items-center pl-2 min-w-0">
                  <img src="music.svg" alt="music" className="h-6 w-6 filter invert opacity-95 drop-shadow-lg flex-shrink-0" />
                  <div className="text-left ml-2 truncate">
                    <div className={`text-[13px] font-bold drop-shadow text-blue-100 truncate w-32 ${currentIndex === idx ? 'text-blue-300' : ''}`}>
                      {decodeURIComponent(song.replace('.mp3', ''))}
                    </div>
                    <div className="text-[10px] text-blue-300 truncate">Bilal</div>
                  </div>
                </div>
                <img src={currentIndex === idx && playing ? "pause.svg" : "play.svg"} alt="play" className={`h-4 w-4 filter invert group-hover:scale-125 transition-transform duration-300 ${currentIndex === idx ? 'animate-pulse' : ''}`} />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main section */}
        <main className="sm:col-span-9 col-span-12 bg-gray-800 rounded-xl p-4 sm:p-6 flex flex-col min-w-0">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="text-xl font-semibold">Musicify Playlists</div>
          </header>

          <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              onClick={() => {
                setCurrentPlaylist("Chill Hits");
                setCurrentIndex(0);
                setPlaying(true);
                setTimeout(() => audioRef.current?.play(), 0);
              }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-lg p-4 shadow-lg min-w-0 flex gap-3 items-start cursor-pointer hover:scale-105 transition-transform"
            >
              <img src="OIP.webp" alt="Chill Hits" className="h-28 w-40 rounded-md object-cover shadow-inner" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">Chill Hits</div>
                <div className="text-xs text-gray-200">A curated selection</div>
              </div>
            </div>

            <div
              onClick={() => {
                setCurrentPlaylist("Top 50");
                setCurrentIndex(0);
                setPlaying(true);
                setTimeout(() => audioRef.current?.play(), 0);
              }}
              className="bg-gradient-to-br from-pink-600 to-pink-400 rounded-lg p-4 shadow-lg min-w-0 flex gap-3 items-start cursor-pointer hover:scale-105 transition-transform"
            >
              <img src="top-50.webp" alt="Top 50" className="h-28 w-40 rounded-md object-cover shadow-inner" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">Top 50</div>
                <div className="text-xs text-gray-200">Popular right now</div>
              </div>
            </div>

            <div
              onClick={() => {
                setCurrentPlaylist("Fresh Finds");
                setCurrentIndex(0);
                setPlaying(true);
                setTimeout(() => audioRef.current?.play(), 0);
              }}
              className="bg-gradient-to-br from-green-600 to-green-400 rounded-lg p-4 shadow-lg min-w-0 flex gap-3 items-start cursor-pointer hover:scale-105 transition-transform"
            >
              <img src="fresh.jpg" alt="Fresh Finds" className="h-28 w-40 rounded-md object-cover shadow-inner" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">Fresh Finds</div>
                <div className="text-xs text-gray-200">New discoveries</div>
              </div>
            </div>
          </section>

          {/* Playbar */}
          <div className="mt-auto">
            <div className="mt-6 bg-gray-900 p-4 rounded-xl sm:static fixed bottom-0 left-0 w-full sm:w-auto sm:bottom-auto sm:left-auto z-50 flex flex-col gap-3 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full relative min-h-[64px] sm:min-h-[60px] sm:max-h-[74px] ">
                  <div className="truncate text-base w-full">
                    <div className="font-medium truncate hidden sm:block">
                      {decodeURIComponent(currentSongs[currentIndex].replace(".mp3", ""))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto justify-center">
                      <button onClick={handlePrev} className="p-2 sm:p-3 rounded-full bg-white/5 hover:bg-white/10">
                        <img src="prevsong.svg" alt="prev" className="h-6 w-6 sm:h-7 sm:w-7 filter invert" />
                      </button>
                      <button onClick={handlePlayPause} className="p-3 sm:p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 ring-2 ring-white/30">
                        <img src={playing ? "pause.svg" : "play.svg"} alt="play" className="h-7 w-7 sm:h-8 sm:w-8 filter invert" />
                      </button>
                      <button onClick={handleNext} className="p-2 sm:p-3 rounded-full bg-white/5 hover:bg-white/10">
                        <img src="nextsong.svg" alt="next" className="h-6 w-6 sm:h-7 sm:w-7 filter invert" />
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:block text-sm text-blue-200 ml-4 whitespace-nowrap font-semibold z-10">Bilal</div>
                </div>
              </div>

              <div>
                <div className="w-full h-2 bg-white/10 rounded-md relative cursor-pointer" onClick={handleSeek}>
                  <div
                    className="absolute top-0 left-0 h-2 bg-indigo-500 rounded-md"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300 mt-2">
                  <div>{secondsToMinutesSeconds(currentTime)}</div>
                  <div>{secondsToMinutesSeconds(duration)}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <audio
        ref={audioRef}
        src={`songs/${currentSongs[currentIndex]}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
        autoPlay={playing}
      />
    </div>
  );
}

export default App;
