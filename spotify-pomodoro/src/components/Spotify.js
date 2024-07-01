    import React, { useState, useEffect, useContext } from 'react';
    import axios from 'axios'
    import { useAuth0 } from '@auth0/auth0-react';  
    import {getSpotifyAccessToken, fetchPlaylistDetails} from '../fetchPlaylistDetails';
    import Select from 'react-select';
    import EmbedContext from '../EmbedContext';

    function Spotify() {
        const [playlistLink, setPlaylistLink] = useState('');
        const [playlistEmbed, setPlaylistEmbed] = useState('');
        const [userPlaylist, setUserPlaylist] = useState([]);
        const [playlistDetails, setPlaylistDetails] = useState([]);
        const {getAccessTokenSilently, user} = useAuth0();
        const [options, setOptions] = useState([]);

        const embedContext = useContext(EmbedContext);

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
                // console.log("details", details);
                console.log(userPlaylist)
                setPlaylistDetails(details);
                setOptions(details.map((detail) => ({ value: detail.url, label: detail.name })));
    
                
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
            embedContext.setEmbed(embeddedLink);
            // setPlaylistEmbed(embeddedLink)
        }

        return (
            <div className="App">
                <header className="App-header">
                    <Select options={options} onChange = {(e) => {
                        embedPlaylist(e.value)
                    }}theme = {(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: 'slategrey',
                            primary: 'black',
                        },
                        })} />
                    <div class=" justify-center align-center  flex-col">
                        <form class="max-w-md mx-auto p-5" onSubmit = {onSubmit} >   
                            <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-main" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search" value = {playlistLink} onChange = {(e) => {setPlaylistLink(e.target.value)}} class="block w-full p-4 ps-10 text-sm text-main border border-gray-300 rounded-lg bg-gray-50 focus:ring-main focus:border-main dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-main0 dark:focus:border-main" placeholder="Playlist Link..." required />
                                <button type="submit" class="text-main absolute end-2.5 bottom-2.5 bg-secondary hover:bg-main focus:ring-4 focus:outline-none focus:ring-main font-medium rounded-lg text-sm px-4 py-2 dark:bg-secondary 0 dark:hover:bg-secondary dark:focus:ring-main">Search</button>
                            </div>
                        </form>
        
                    </div>
                    <div>
                </div>
                </header>
            </div>
        );
    }

    export default Spotify;

