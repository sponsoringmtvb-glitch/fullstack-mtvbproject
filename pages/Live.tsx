import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { FaRegFutbol, FaChartBar, FaComments } from 'react-icons/fa';

const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;

    let videoId: string | null = null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        }
    } catch (e) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        if(match) videoId = match[1];
    }
    
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    
    return null;
};

const Live: React.FC = () => {
    const { liveMatchId, matches, generalSettings, teams } = useContext(DataContext);
    const liveMatch = matches.find(m => m.id === liveMatchId);

    if (!liveMatch) {
        return (
            <div className="text-center py-20">
                <FaRegFutbol className="mx-auto h-16 w-16 text-gray-400" />
                <h2 className="mt-4 text-2xl font-bold">No match is currently live.</h2>
                <p className="text-gray-500">Check the schedule for upcoming games.</p>
            </div>
        );
    }
    
    const ourTeam = { name: generalSettings.clubName, logo: generalSettings.logoUrl };
    const opponentTeam = teams.find(t => t.name === liveMatch.opponent);
    const placeholderLogo = 'https://via.placeholder.com/150x150/cccccc/808080?text=?';
    const embedUrl = getYouTubeEmbedUrl(liveMatch.liveStreamUrl);
    const { liveScore } = liveMatch;
    
    const ourTeamServing = liveScore?.servingTeam === 'us';
    const opponentTeamServing = liveScore?.servingTeam === 'opponent';

    return (
        <div className="space-y-8">
            <div className="flex justify-center items-center gap-4">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
                <h1 className="text-4xl font-bold text-red-500 uppercase tracking-wider">Live</h1>
            </div>

            {/* Dynamic Video Player */}
            <div className="aspect-video bg-black rounded-lg shadow-2xl flex items-center justify-center text-white">
                {embedUrl ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="rounded-lg"
                    ></iframe>
                ) : (
                    <p>The live stream will appear here. Awaiting broadcast link.</p>
                )}
            </div>

            {/* Scoreboard */}
            <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-around text-center">
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 relative">
                        {ourTeamServing && <div className="absolute top-0 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Serving"></div>}
                        <img src={ourTeam.logo} alt={ourTeam.name} className="h-20 w-20 object-contain" />
                        <span className="font-bold text-2xl text-brand-dark-text dark:text-white">{ourTeam.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-6xl font-extrabold font-display">{liveScore?.ourSets ?? 0}</span>
                        <span className="text-3xl font-light text-gray-400">-</span>
                        <span className="text-6xl font-extrabold font-display">{liveScore?.opponentSets ?? 0}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center space-y-2 relative">
                        {opponentTeamServing && <div className="absolute top-0 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Serving"></div>}
                        <img src={opponentTeam?.logo || placeholderLogo} alt={liveMatch.opponent} className="h-20 w-20 object-contain" />
                        <span className="font-bold text-2xl text-brand-dark-text dark:text-white">{liveMatch.opponent}</span>
                    </div>
                </div>
                 <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Set {liveScore?.currentSet ?? 1} | {liveScore?.ourPoints ?? 0} - {liveScore?.opponentPoints ?? 0}</p>
            </div>

            {/* Stats and Chat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg p-6">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaChartBar /> Live Stats</h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p><strong>Aces:</strong> 8</p>
                        <p><strong>Blocks:</strong> 12</p>
                        <p><strong>Spike Success:</strong> 45%</p>
                        <p><strong>Serve Errors:</strong> 5</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-lg p-6 flex flex-col">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaComments /> Fan Chat</h3>
                    <div className="flex-grow bg-gray-100 dark:bg-brand-dark rounded p-4 space-y-3 overflow-y-auto h-48">
                        <p><strong className="text-blue-500">Fan123:</strong> Go Mouloudia!</p>
                        <p><strong className="text-green-500">SupporterX:</strong> What a point!</p>
                        <p><strong className="text-purple-500">VB_Lover:</strong> Let's get this set!</p>
                    </div>
                     <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Type your message..." className="flex-grow p-2 rounded-md border bg-gray-50 dark:bg-gray-800 dark:border-gray-600" />
                        <button className="bg-brand-green text-white px-4 rounded-md">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Live;