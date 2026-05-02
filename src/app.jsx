import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Home, 
  Search, 
  Library, 
  PlusSquare, 
  Heart, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ListMusic, 
  Clock, 
  MoreHorizontal,
  Search as SearchIcon,
  Music,
  User,
  X
} from 'lucide-react';

// --- Mock Data ---

const INITIAL_PLAYLISTS = [
  { id: 'p1', name: "Punjabi Power", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", description: "Top Punjabi hits to get you moving." },
  { id: 'p2', name: "Bollywood Butter", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop", description: "The smoothest Bollywood tracks." },
  { id: 'p3', name: "Desi Hip Hop", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop", description: "Straight from the streets." },
  { id: 'p4', name: "Sufi & Soul", cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop", description: "Music for the heart." },
  { id: 'p5', name: "Party Anthems", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop", description: "Full volume only." },
];

// Reusing soundhelix for audio simulation (Copyright restrictions prevent real MP3s)
const AUDIO_SOURCES = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
];

const TRACKS = [
  // --- Punjabi Hits ---
  {
    id: 101,
    title: "Lover",
    artist: "Diljit Dosanjh",
    album: "MoonChild Era",
    duration: "3:02",
    cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[0],
    color: "bg-red-900"
  },
  {
    id: 102,
    title: "Brown Munde",
    artist: "AP Dhillon, Gurinder Gill",
    album: "Brown Munde",
    duration: "4:15",
    cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[1],
    color: "bg-yellow-900"
  },
  {
    id: 103,
    title: "295",
    artist: "Sidhu Moose Wala",
    album: "Moosetape",
    duration: "4:30",
    cover: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[2],
    color: "bg-gray-800"
  },
  {
    id: 104,
    title: "Excuses",
    artist: "AP Dhillon, Gurinder Gill",
    album: "Hidden Gems",
    duration: "2:56",
    cover: "https://images.unsplash.com/photo-1460039230329-eb070fc6c77c?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[3],
    color: "bg-orange-800"
  },
  {
    id: 105,
    title: "We Rollin",
    artist: "Shubh",
    album: "Single",
    duration: "3:19",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[4],
    color: "bg-indigo-900"
  },
  {
    id: 106,
    title: "Bijlee Bijlee",
    artist: "Harrdy Sandhu",
    album: "Bijlee Bijlee",
    duration: "3:08",
    cover: "https://images.unsplash.com/photo-1459749411177-8c4650980419?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[5],
    color: "bg-blue-800"
  },
  {
    id: 107,
    title: "G.O.A.T.",
    artist: "Diljit Dosanjh",
    album: "G.O.A.T.",
    duration: "3:42",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[6],
    color: "bg-purple-900"
  },
  {
    id: 108,
    title: "Insane",
    artist: "AP Dhillon",
    album: "Insane",
    duration: "3:25",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[7],
    color: "bg-red-800"
  },
  {
    id: 109,
    title: "No Love",
    artist: "Shubh",
    album: "Single",
    duration: "2:50",
    cover: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[0],
    color: "bg-gray-900"
  },
  {
    id: 110,
    title: "Levels",
    artist: "Sidhu Moose Wala",
    album: "Single",
    duration: "3:55",
    cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[1],
    color: "bg-green-900"
  },

  // --- Hindi / Bollywood Hits ---
  {
    id: 201,
    title: "Kesariya",
    artist: "Arijit Singh",
    album: "Brahmāstra",
    duration: "4:28",
    cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[2],
    color: "bg-orange-600"
  },
  {
    id: 202,
    title: "Maan Meri Jaan",
    artist: "King",
    album: "Champagne Talk",
    duration: "3:14",
    cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[3],
    color: "bg-purple-800"
  },
  {
    id: 203,
    title: "Apna Bana Le",
    artist: "Arijit Singh, Sachin-Jigar",
    album: "Bhediya",
    duration: "4:22",
    cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[4],
    color: "bg-blue-900"
  },
  {
    id: 204,
    title: "Jhoome Jo Pathaan",
    artist: "Arijit Singh, Vishal-Shekhar",
    album: "Pathaan",
    duration: "3:28",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[5],
    color: "bg-yellow-700"
  },
  {
    id: 205,
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal",
    album: "Shershaah",
    duration: "3:50",
    cover: "https://images.unsplash.com/photo-1459749411177-8c4650980419?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[6],
    color: "bg-pink-900"
  },
  {
    id: 206,
    title: "Tum Hi Ho",
    artist: "Arijit Singh",
    album: "Aashiqui 2",
    duration: "4:22",
    cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[7],
    color: "bg-blue-950"
  },
  {
    id: 207,
    title: "Jugnu",
    artist: "Badshah",
    album: "Single",
    duration: "3:50",
    cover: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[0],
    color: "bg-red-700"
  },
  {
    id: 208,
    title: "Chaand Baaliyan",
    artist: "Aditya A",
    album: "Single",
    duration: "1:43",
    cover: "https://images.unsplash.com/photo-1524779709304-40b5a3560c60?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[1],
    color: "bg-green-800"
  },
  {
    id: 209,
    title: "Ranjha",
    artist: "B Praak, Jasleen Royal",
    album: "Shershaah",
    duration: "3:48",
    cover: "https://images.unsplash.com/photo-1621257912423-f27575eb375d?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[2],
    color: "bg-orange-900"
  },
  {
    id: 210,
    title: "Agar Tum Saath Ho",
    artist: "Arijit Singh, Alka Yagnik",
    album: "Tamasha",
    duration: "5:41",
    cover: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[3],
    color: "bg-yellow-800"
  },
  {
    id: 211,
    title: "Pasoori",
    artist: "Ali Sethi, Shae Gill",
    album: "Coke Studio",
    duration: "3:44",
    cover: "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[4],
    color: "bg-amber-700"
  },
  {
    id: 212,
    title: "Deva Deva",
    artist: "Arijit Singh",
    album: "Brahmāstra",
    duration: "4:39",
    cover: "https://images.unsplash.com/photo-1604093882750-3ed498f3178b?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[5],
    color: "bg-orange-500"
  },
  
  // --- International / Classic Filler for Variety ---
  {
    id: 301,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[6],
    color: "bg-red-600"
  },
  {
    id: 302,
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    duration: "3:50",
    cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[7],
    color: "bg-pink-800"
  },
  {
    id: 303,
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    duration: "3:53",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop",
    src: AUDIO_SOURCES[0],
    color: "bg-teal-800"
  }
];

// --- Utilities ---

const formatTime = (seconds) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Components ---

const SidebarItem = ({ Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 cursor-pointer hover:text-white transition-colors duration-200 mb-4 ${active ? 'text-white' : 'text-gray-400'}`}
  >
    <Icon size={24} />
    <span className="font-semibold text-sm tracking-wide">{label}</span>
  </div>
);

const PlaylistItem = ({ name, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`${active ? 'text-white' : 'text-gray-400'} hover:text-white cursor-pointer text-sm mb-3 truncate transition-colors duration-200`}
  >
    {name}
  </div>
);

const TrackRow = ({ track, index, isCurrent, isPlaying, onPlay, isLiked, onToggleLike }) => {
  return (
    <div 
      className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center p-3 rounded-md hover:bg-white/10 group cursor-pointer transition-colors ${isCurrent ? 'bg-white/20' : ''}`}
      onClick={() => onPlay(track)}
    >
      <div className="w-5 text-center text-gray-400 text-sm">
        {isCurrent && isPlaying ? (
          <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="playing" className="h-4 w-4 mx-auto" />
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <Play size={12} className={`hidden group-hover:block mx-auto ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`} fill={isCurrent ? '#1DB954' : 'white'} />
          </>
        )}
      </div>
      <div className="flex items-center gap-4 min-w-0">
        <img src={track.cover} alt={track.title} className="w-10 h-10 rounded shadow-md" />
        <div className="min-w-0">
          <div className={`font-medium truncate ${isCurrent ? 'text-[#1DB954]' : 'text-white'}`}>{track.title}</div>
          <div className="text-sm text-gray-400 truncate group-hover:text-white">{track.artist}</div>
        </div>
      </div>
      <div className="text-sm text-gray-400 truncate hidden md:block group-hover:text-white">{track.album}</div>
      <div className="text-sm text-gray-400 flex items-center gap-4">
        <Heart 
          size={16} 
          className={`cursor-pointer transition-transform hover:scale-110 ${isLiked ? 'visible text-[#1DB954] fill-[#1DB954]' : 'invisible group-hover:visible hover:text-white'}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(track.id);
          }}
        />
        <span className="w-10 text-right">{track.duration}</span>
        <MoreHorizontal size={16} className="invisible group-hover:visible hover:text-white" onClick={(e) => e.stopPropagation()}/>
      </div>
    </div>
  );
};

const Card = ({ image, title, subTitle, onClick, onPlay }) => (
  <div 
    onClick={onClick}
    className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all duration-300 group cursor-pointer"
  >
    <div className="relative mb-4 shadow-lg rounded-md overflow-hidden">
      <img src={image} alt={title} className="w-full aspect-square object-cover" />
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        className="absolute bottom-2 right-2 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl text-black hover:scale-105"
      >
        <Play fill="black" size={20} className="ml-1"/>
      </button>
    </div>
    <h3 className="font-bold text-white mb-1 truncate">{title}</h3>
    <p className="text-sm text-gray-400 line-clamp-2">{subTitle}</p>
  </div>
);

// --- Main App ---

export default function App() {
  // Player State
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  // Data State
  const [activeTab, setActiveTab] = useState('Home'); // Home, Search, Library, Playlist, Liked
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [likedTrackIds, setLikedTrackIds] = useState(new Set());
  const [playlists, setPlaylists] = useState(INITIAL_PLAYLISTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Navigation History (Simple Stack)
  const [viewHistory, setViewHistory] = useState(['Home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Play Queue Context
  const [queue, setQueue] = useState(TRACKS);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    // Basic body styling
    document.body.style.backgroundColor = "#000000";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play error (user interaction needed):", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // --- Logic ---

  const navigateTo = (tab, playlistId = null) => {
    const newHistory = viewHistory.slice(0, historyIndex + 1);
    newHistory.push(tab);
    setViewHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setActiveTab(tab);
    if (playlistId) setActivePlaylistId(playlistId);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevTab = viewHistory[historyIndex - 1];
      setActiveTab(prevTab);
      // Logic to restore playlist ID would go here in a real router
    }
  };

  const handlePlayTrack = (track, newQueue = queue) => {
    if (currentTrack.id === track.id) {
        setIsPlaying(!isPlaying);
    } else {
        setQueue(newQueue);
        setCurrentTrack(track);
        setIsPlaying(true);
        setCurrentTime(0);
    }
  };

  const handleNext = () => {
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (repeatMode === 2) {
      // Repeat One: Seek to 0
      if (audioRef.current) audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === 1) {
        nextIndex = 0; // Loop back
      } else {
        setIsPlaying(false); // Stop
        return;
      }
    }
    
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        return;
    }

    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const toggleLike = (trackId) => {
    const newLiked = new Set(likedTrackIds);
    if (newLiked.has(trackId)) {
      newLiked.delete(trackId);
    } else {
      newLiked.add(trackId);
    }
    setLikedTrackIds(newLiked);
  };

  const createPlaylist = () => {
    const name = prompt("Enter playlist name:", `My Playlist #${playlists.length + 1}`);
    if (name) {
      const newPl = {
        id: `custom-${Date.now()}`,
        name,
        cover: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=300`,
        description: `Created by You • ${new Date().toLocaleDateString()}`
      };
      setPlaylists([...playlists, newPl]);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // --- Views ---

  const renderHome = () => (
    <div className="pt-20 px-8 pb-8">
      <h2 className="text-3xl font-bold mb-6">{getGreeting()}</h2>
      
      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div 
            onClick={() => navigateTo('Liked')}
            className="bg-white/10 hover:bg-white/20 transition-colors rounded overflow-hidden flex items-center cursor-pointer group"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-700 to-purple-300 flex items-center justify-center">
            <Heart fill="white" size={32} />
          </div>
          <span className="font-bold ml-4">Liked Songs</span>
          <div className="ml-auto mr-4 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-opacity">
            <Play fill="black" size={20} className="ml-1 text-black" />
          </div>
        </div>
        {playlists.slice(0, 5).map(pl => (
           <div 
             key={pl.id}
             onClick={() => navigateTo('Playlist', pl.id)}
             className="bg-white/10 hover:bg-white/20 transition-colors rounded overflow-hidden flex items-center cursor-pointer group"
           >
             <img src={pl.cover} alt={pl.name} className="w-20 h-20 object-cover" />
             <span className="font-bold ml-4 truncate">{pl.name}</span>
             <div className="ml-auto mr-4 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-opacity">
                <Play fill="black" size={20} className="ml-1 text-black" />
             </div>
           </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer inline-block">Made for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {playlists.map(pl => (
          <Card 
            key={pl.id} 
            title={pl.name} 
            subTitle={pl.description} 
            image={pl.cover} 
            onClick={() => navigateTo('Playlist', pl.id)}
            onPlay={() => handlePlayTrack(TRACKS[0], TRACKS)} // Simplified play
          />
        ))}
      </div>

      {/* Fresh Finds Row */}
      <h2 className="text-2xl font-bold mb-6 mt-8 hover:underline cursor-pointer inline-block">Fresh Punjabi & Hindi Hits</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {TRACKS.slice(0, 5).map(track => (
           <Card 
             key={track.id}
             title={track.title}
             subTitle={track.artist}
             image={track.cover}
             onClick={() => handlePlayTrack(track, TRACKS)}
             onPlay={() => handlePlayTrack(track, TRACKS)}
           />
        ))}
      </div>
    </div>
  );

  const renderSearch = () => {
    const filteredTracks = TRACKS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.artist.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="pt-24 px-8 pb-8">
        <div className="mb-8">
           <h2 className="text-white text-2xl font-bold mb-4">Browse All</h2>
           {searchQuery === '' ? (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {['Punjabi', 'Bollywood', 'Pop', 'Hip-Hop', 'Indie', 'Rock', 'Romance', 'Focus'].map((genre, i) => (
                 <div key={i} className="aspect-square bg-white/10 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:bg-white/20 transition-colors">
                   <h3 className="text-2xl font-bold">{genre}</h3>
                   <div className="absolute -bottom-2 -right-2 rotate-[25deg] shadow-lg">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-black rounded-lg" />
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col gap-2">
                <h3 className="font-bold text-xl mb-4">Songs</h3>
                {filteredTracks.length > 0 ? filteredTracks.map((track, idx) => (
                  <TrackRow 
                    key={track.id + idx} // using idx for unique keys if dups
                    track={track}
                    index={idx}
                    isCurrent={currentTrack.id === track.id}
                    isPlaying={isPlaying}
                    onPlay={() => handlePlayTrack(track, filteredTracks)}
                    isLiked={likedTrackIds.has(track.id)}
                    onToggleLike={toggleLike}
                  />
                )) : (
                  <div className="text-gray-400">No songs found matching "{searchQuery}"</div>
                )}
             </div>
           )}
        </div>
      </div>
    );
  };

  const renderLibrary = () => (
    <div className="pt-20 px-8 pb-8">
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-3xl font-bold">Your Library</h2>
         <PlusSquare size={32} className="text-gray-400 hover:text-white cursor-pointer" onClick={createPlaylist} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <Card 
          title="Liked Songs" 
          subTitle={`${likedTrackIds.size} liked songs`} 
          image="https://misc.scdn.co/liked-songs/liked-songs-300.png"
          onClick={() => navigateTo('Liked')}
          onPlay={() => {
             const liked = TRACKS.filter(t => likedTrackIds.has(t.id));
             if(liked.length) handlePlayTrack(liked[0], liked);
          }}
        />
        {playlists.map(pl => (
          <Card 
            key={pl.id}
            title={pl.name}
            subTitle="Playlist"
            image={pl.cover}
            onClick={() => navigateTo('Playlist', pl.id)}
            onPlay={() => handlePlayTrack(TRACKS[0], TRACKS)}
          />
        ))}
      </div>
    </div>
  );

  const renderPlaylistView = (playlist) => {
    // For this demo, all playlists just share the main TRACKS list
    // In a real app, playlist would have a specific trackIds array.
    // To simulate variety, we'll slice the tracks array differently based on ID for demo purposes
    let playlistTracks = TRACKS;
    if (playlist && playlist.id === 'p1') {
       playlistTracks = TRACKS.filter(t => t.id >= 100 && t.id < 200); // Punjabi
    } else if (playlist && playlist.id === 'p2') {
       playlistTracks = TRACKS.filter(t => t.id >= 200 && t.id < 300); // Bollywood
    }

    if (playlistTracks.length === 0) playlistTracks = TRACKS; // Fallback

    return (
        <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
            <img 
                src={playlist?.cover || "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop"} 
                alt="Cover" 
                className="w-52 h-52 shadow-2xl shadow-black/50 object-cover"
            />
            <div className="flex flex-col gap-2">
                <span className="uppercase text-xs font-bold tracking-wider">Playlist</span>
                <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-2">{playlist?.name || "Unknown"}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <span className="text-white font-bold hover:underline cursor-pointer">You</span>
                <span>•</span>
                <span>{playlistTracks.length} songs,</span>
                <span className="text-gray-400">about 1 hr</span>
                </div>
                <p className="text-gray-400 mt-2">{playlist?.description}</p>
            </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-8 mb-8">
            <button 
                onClick={() => handlePlayTrack(playlistTracks[0], playlistTracks)}
                className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg text-black"
            >
                {isPlaying && queue === playlistTracks ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1"/>}
            </button>
            <Heart size={32} className="text-gray-400 hover:text-white cursor-pointer" />
            <MoreHorizontal size={32} className="text-gray-400 hover:text-white cursor-pointer" />
            </div>

            {/* List Header */}
            <div className="mb-4 text-gray-400 border-b border-gray-800 pb-2 px-3 grid grid-cols-[auto_1fr_1fr_auto] gap-4 text-sm uppercase tracking-wider sticky top-16 bg-[#121212] z-10">
                <div className="text-center w-5">#</div>
                <div>Title</div>
                <div className="hidden md:block">Album</div>
                <div className="text-right pr-2"><Clock size={16} /></div>
            </div>

            <div className="flex flex-col">
            {playlistTracks.map((track, idx) => (
                <TrackRow 
                key={idx} 
                track={track} 
                index={idx}
                isCurrent={currentTrack.id === track.id}
                isPlaying={isPlaying}
                onPlay={() => handlePlayTrack(track, playlistTracks)}
                isLiked={likedTrackIds.has(track.id)}
                onToggleLike={toggleLike}
                />
            ))}
            </div>
        </div>
    );
  };

  const renderLikedSongs = () => {
    const likedTracks = TRACKS.filter(t => likedTrackIds.has(t.id));

    return (
        <div className="pt-20 px-8 pb-8">
             <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                <div className="w-52 h-52 bg-gradient-to-br from-indigo-700 to-purple-400 flex items-center justify-center shadow-2xl shadow-black/50">
                    <Heart fill="white" size={80} />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="uppercase text-xs font-bold tracking-wider">Playlist</span>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-2">Liked Songs</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                        <span className="text-white font-bold hover:underline cursor-pointer">You</span>
                        <span>•</span>
                        <span>{likedTracks.length} songs</span>
                    </div>
                </div>
             </div>

             {likedTracks.length > 0 ? (
                 <div className="flex flex-col">
                    <div className="mb-8">
                        <button 
                            onClick={() => handlePlayTrack(likedTracks[0], likedTracks)}
                            className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 hover:bg-[#1ed760] transition-all shadow-lg text-black"
                        >
                            <Play fill="black" size={24} className="ml-1"/>
                        </button>
                    </div>
                    {likedTracks.map((track, idx) => (
                        <TrackRow 
                            key={track.id} 
                            track={track} 
                            index={idx}
                            isCurrent={currentTrack.id === track.id}
                            isPlaying={isPlaying}
                            onPlay={() => handlePlayTrack(track, likedTracks)}
                            isLiked={true}
                            onToggleLike={toggleLike}
                        />
                    ))}
                 </div>
             ) : (
                 <div className="text-center py-20 text-gray-400">
                     <h3 className="text-xl font-bold mb-2">Songs you like will appear here</h3>
                     <p>Save songs by tapping the heart icon.</p>
                 </div>
             )}
        </div>
    );
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'Home': return renderHome();
          case 'Search': return renderSearch();
          case 'Library': return renderLibrary();
          case 'Liked': return renderLikedSongs();
          case 'Playlist': 
            const pl = playlists.find(p => p.id === activePlaylistId);
            return renderPlaylistView(pl);
          default: return renderHome();
      }
  };

  // --- Dynamic Styling ---
  const bgGradient = useMemo(() => {
     if (activeTab === 'Liked') return 'bg-gradient-to-b from-indigo-900 to-[#121212]';
     if (activeTab === 'Search') return 'bg-[#121212]';
     if (activeTab === 'Home') return `bg-gradient-to-b from-${currentTrack.color.replace('bg-', '')} to-[#121212]`;
     return 'bg-gradient-to-b from-gray-900 to-[#121212]';
  }, [activeTab, currentTrack]);


  return (
    <div className="flex flex-col h-screen text-white bg-black font-sans overflow-hidden select-none">
      
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={() => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                if (progressRef.current) {
                    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    progressRef.current.style.width = `${pct}%`;
                }
            }
        }}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleNext}
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-black p-6 flex flex-col gap-6 hidden md:flex resize-x min-w-[200px] max-w-[400px]">
          <div className="flex items-center gap-2 mb-2 cursor-pointer text-white hover:text-[#1DB954] transition-colors" onClick={() => navigateTo('Home')}>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-black rounded-full" />
            </div>
            <span className="font-bold text-2xl tracking-tighter">SpotifyClone</span>
          </div>

          <nav>
            <SidebarItem Icon={Home} label="Home" active={activeTab === 'Home'} onClick={() => navigateTo('Home')} />
            <SidebarItem Icon={Search} label="Search" active={activeTab === 'Search'} onClick={() => navigateTo('Search')} />
            <SidebarItem Icon={Library} label="Your Library" active={activeTab === 'Library'} onClick={() => navigateTo('Library')} />
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <SidebarItem Icon={PlusSquare} label="Create Playlist" onClick={createPlaylist} />
            <SidebarItem Icon={Heart} label="Liked Songs" active={activeTab === 'Liked'} onClick={() => navigateTo('Liked')} />
          </div>

          <div className="flex-1 overflow-y-auto mt-2 pr-2 scrollbar-hide">
            {playlists.map(pl => (
              <PlaylistItem 
                key={pl.id} 
                name={pl.name} 
                active={activeTab === 'Playlist' && activePlaylistId === pl.id}
                onClick={() => navigateTo('Playlist', pl.id)} 
              />
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-[#121212] rounded-lg m-2 overflow-hidden flex flex-col relative isolate">
          
          {/* Header */}
          <header className="absolute top-0 left-0 right-0 h-16 bg-black/0 z-20 flex items-center justify-between px-8 transition-colors duration-500 hover:bg-black/20">
            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                disabled={historyIndex <= 0}
                className="bg-black/70 rounded-full p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              </button>
              <button disabled className="bg-black/70 rounded-full p-1 text-gray-400 hover:text-white cursor-not-allowed">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
              
              {activeTab === 'Search' && (
                <div className="relative group">
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 group-focus-within:text-white pointer-events-none">
                        <SearchIcon size={20} />
                    </div>
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="What do you want to play?" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-64 md:w-96 rounded-full bg-[#242424] text-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all border border-transparent hover:bg-[#2a2a2a]"
                    />
                    {searchQuery && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-gray-400 hover:text-white" onClick={() => setSearchQuery('')}>
                            <X size={16} />
                        </div>
                    )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button className="bg-black/70 p-1.5 rounded-full hover:scale-105 transition-transform">
                  <User size={20} />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent bg-[#121212]">
            {/* Dynamic Background */}
            <div className={`${bgGradient} h-80 absolute top-0 left-0 right-0 opacity-60 transition-colors duration-700 -z-10`} />
            
            {renderContent()}

          </div>
        </main>
      </div>

      {/* Player Footer */}
      <footer className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between relative z-50">
        
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
          <img src={currentTrack.cover} alt="Cover" className="h-14 w-14 rounded shadow-sm" />
          <div className="flex flex-col justify-center overflow-hidden">
            <div className="font-medium text-sm text-white hover:underline cursor-pointer truncate pr-2">{currentTrack.title}</div>
            <div className="text-xs text-gray-400 hover:underline cursor-pointer hover:text-white truncate pr-2">{currentTrack.artist}</div>
          </div>
          <Heart 
            size={16} 
            className={`hidden md:block cursor-pointer ${likedTrackIds.has(currentTrack.id) ? 'text-[#1DB954] fill-[#1DB954]' : 'text-gray-400 hover:text-white'}`} 
            onClick={() => toggleLike(currentTrack.id)} 
          />
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center max-w-[40%] w-full gap-2">
          <div className="flex items-center gap-6">
            <Shuffle 
                size={16} 
                className={`cursor-pointer transition-colors ${isShuffle ? 'text-[#1DB954] dot-indicator' : 'text-gray-400 hover:text-white'}`} 
                onClick={() => setIsShuffle(!isShuffle)}
            />
            <SkipBack size={20} className="text-gray-300 hover:text-white cursor-pointer" fill="currentColor" onClick={handlePrev} />
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black"
            >
              {isPlaying ? <Pause fill="black" size={16} /> : <Play fill="black" size={16} className="ml-0.5"/>}
            </button>

            <SkipForward size={20} className="text-gray-300 hover:text-white cursor-pointer" fill="currentColor" onClick={handleNext} />
            <Repeat 
                size={16} 
                className={`cursor-pointer transition-colors ${repeatMode > 0 ? 'text-[#1DB954]' : 'text-gray-400 hover:text-white'}`} 
                onClick={() => setRepeatMode((repeatMode + 1) % 3)}
            />
            {repeatMode === 2 && <span className="text-[8px] absolute ml-28 mt-[-8px] font-bold text-[#1DB954] bg-[#181818] px-1">1</span>}
          </div>

          <div className="w-full flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="h-1 flex-1 bg-gray-600 rounded-full cursor-pointer relative group"
              onClick={(e) => {
                  const w = e.currentTarget.clientWidth;
                  const x = e.nativeEvent.offsetX;
                  if (audioRef.current && duration) {
                      audioRef.current.currentTime = (x / w) * duration;
                  }
              }}
            >
              <div 
                ref={progressRef}
                className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-[#1DB954]"
                style={{ width: '0%' }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Extras */}
        <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
           <div className="flex items-center gap-2 w-32 group">
             <Volume2 size={18} className="text-gray-400" />
             <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-full accent-white hover:accent-[#1DB954] cursor-pointer bg-gray-600 rounded-full"
             />
           </div>
           <Maximize2 size={16} className="text-gray-400 hover:text-white cursor-pointer ml-2" />
        </div>

      </footer>
    </div>
  );
}
