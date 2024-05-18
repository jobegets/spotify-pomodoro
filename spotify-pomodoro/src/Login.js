import React, { useState } from 'react';




function Login() {
    const [playlistLink, setPlaylistLink] = useState('');
    const [playlistEmbed, setPlaylistEmbed] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(playlistLink)
        embedPlaylist(playlistLink);
    }

    const embedPlaylist = (link) => {
        var embeddedLink = link.slice(0, 24) + "/embed/" + link.slice(24, link.length)
        setPlaylistEmbed(embeddedLink)
        
       
    }
`z  `
    return (
        <div className="App">
            <header className="App-header">
                <form className = "p-3" onSubmit = {onSubmit}>
                    <input type="text" value = {playlistLink} onChange = {(e) => {setPlaylistLink(e.target.value);console.log(e.target.value)}} placeholder="Enter Playlist Embed"/>
                    <button type = "submit">Search</button>
                </form>
                <iframe id= "spotify-embed" src= {playlistEmbed} width="1500" height="200" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            </header>
        </div>
    );
}

export default Login;

