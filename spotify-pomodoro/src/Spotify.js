    import React, { useState, useEffect } from 'react';
    import axios from 'axios'
    import { useAuth0 } from '@auth0/auth0-react';  
    import {getSpotifyAccessToken, fetchPlaylistDetails} from './fetchPlaylistDetails';

    function Spotify() {
        const [playlistLink, setPlaylistLink] = useState('');
        const [playlistEmbed, setPlaylistEmbed] = useState('');
        const [userPlaylist, setUserPlaylist] = useState([]);
        const [playlistDetails, setPlaylistDetails] = useState([]);
        const {getAccessTokenSilently, user} = useAuth0();
        
        useEffect(() => {
            console.log("fetching playlists from ddb.....")
            // Fetch user's playlists from ddb
            const fetchPlaylists = async () => {
                const token = await getAccessTokenSilently();
                const userId = user.sub;
                const spotifyToken = await getSpotifyAccessToken();
                // console.log(spotifyToken)
                // console.log(playlistLink)
                // if (userPlaylist.length !=0){
                //     const name = await fetchPlaylistDetails(playlistLink, spotifyToken);
                //     setPlaylistName(name);
                // }

                try {
                    const res = await axios.get(
                        `https://0ygg20o36c.execute-api.us-east-1.amazonaws.com/dev/users/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    // Add all unique playlists to userPlaylist
                    const uniquePlaylists = new Set(JSON.parse(res.data.body).playlists || [])
                    setUserPlaylist(Array.from(uniquePlaylists)); 
                } catch (error) {

                    // If user has no playlists, set userPlaylist to empty array
                    setUserPlaylist([]);
                }
            };
            fetchPlaylists();
        }, [getAccessTokenSilently, user, setPlaylistLink, playlistLink]);


        useEffect(() => {
            console.log("fetching playlisttDetails.....")
            const fetchPlaylistNameImg = async () => {
                const spotifyToken = await getSpotifyAccessToken();
    
                const details = await Promise.all(
                    userPlaylist.map(async (playlistLink) => {
                        try {
                            const detail = await fetchPlaylistDetails(playlistLink, spotifyToken);
                            return detail;
                        } catch (error) {
                            console.error(`Error fetching playlist/album details for ${playlistLink}:`, error);
                            return 'Unknown Playlist/Album';
                        }
                    })
                );
    
                setPlaylistDetails(details);
                console.log(playlistDetails)
            };
    
            if (userPlaylist.length > 0) {
                fetchPlaylistNameImg();
            }
        }, [playlistLink, userPlaylist, setPlaylistLink]);

        const onSubmit = async (e) => {
            e.preventDefault();
            embedPlaylist(playlistLink);
            if (userPlaylist.includes(playlistLink)) { // Check if playlist is already in db
                setPlaylistLink('');
                console.log('Duplicate playlist detected. not adding to db');
                return;
            }

            const token = await getAccessTokenSilently();
            const userId = user.sub;  
            try {
                const res = await axios.post(
                    `https://0ygg20o36c.execute-api.us-east-1.amazonaws.com/dev`,
                        {
                            pathParameters: {
                                userId: userId
                            },
                            body: playlistLink
                        },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                // console.log(userId)
                // console.log(playlistLink)
                console.log('Response:', res.data);
                // Handle response data as needed
            } catch (error) {
                console.error('Error:', error);
            }

            setPlaylistLink('');
        }

        const embedPlaylist = (link) => {
            var embeddedLink = link.slice(0, 24) + "/embed/" + link.slice(24, link.length)
            setPlaylistEmbed(embeddedLink)
        }

        return (
            <div className="App">
                <header className="App-header">
                 
                    <div>
                        {userPlaylist}
                    </div>
                    <div class=" justify-center align-center  flex-col">
                        <form class="max-w-md mx-auto p-5" onSubmit = {onSubmit} >   
                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search" value = {playlistLink} onChange = {(e) => {setPlaylistLink(e.target.value)}} class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Playlist Link..." required />
                                <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>
                        <iframe id= "spotify-embed" src= {playlistEmbed} width="340" height="200" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                    </div>
                    <div>
                    {playlistDetails.map((detail, index) => (
                        <div key={index}>
                            <img src={detail.imageUrl} alt={detail.name} style={{ width: '100px', height: '100px' }} />
                            <p>{detail.name}</p>
                        </div>
                    ))}
                </div>
                </header>
            </div>
        );
    }

    export default Spotify;

