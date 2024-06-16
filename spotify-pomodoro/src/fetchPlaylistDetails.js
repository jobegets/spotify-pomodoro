import axios from 'axios';

// Function to get Spotify access token
const getSpotifyAccessToken = async () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    
    // Check if Buffer is available, if not, use btoa for browser
    const authString = typeof Buffer !== 'undefined' 
        ? Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        : btoa(`${clientId}:${clientSecret}`);
    
    try {
        const response = await axios.post(tokenUrl, new URLSearchParams({
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authString}`
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        throw error;
    }
};

// Fetches playlist/album details from Spotify API
const fetchPlaylistDetails = async (url, token) => {
    const id = url.split('/').pop().split('?')[0];
    const type = url.includes('album') ? 'albums' : 'playlists';

    try {
        const response = await axios.get(`https://api.spotify.com/v1/${type}/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data;
        const name = data.name;
        const imageUrl = data.images.length > 0 ? data.images[0].url : null;

        return { name, imageUrl };
    } catch (error) {
        console.error(`Error fetching ${type} details:`, error);
        throw error;
    }
};



export { getSpotifyAccessToken, fetchPlaylistDetails };