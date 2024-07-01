import './App.css';
import Timer from "./components/Timer";
import Settings from "./components/Settings";
import {useState} from "react";
import SettingsContext from "./SettingsContext";
import Spotify from './components/Spotify';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
import EmbedContext from './EmbedContext';
import SpotifyEmbed from './components/SpotifyEmbed';
import Header from './components/Header';
import Login from './components/Login';
import Gif from './components/Gif';

function App() {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(15);
  const [longBreakMinutes, setLongBreakMinutes] = useState(45);
  const [embed, setEmbed] = useState("");

  return (
    <main>
      {isLoading && <div>Loading...</div>}
      {!error && !isLoading && (
        <>
          <Header> 
            <LoginButton/> <LogoutButton/> 
          </Header>
        </>
      )}
      {!isAuthenticated &&  (<Gif/>)}
      {isAuthenticated && (
        <EmbedContext.Provider value = {{embed, setEmbed}}>
          <div class = "flex flex-col gap-5 justify-center items-center">
            <SettingsContext.Provider value={{
              showSettings,setShowSettings,
              workMinutes,setWorkMinutes,
              shortBreakMinutes,setShortBreakMinutes,
              longBreakMinutes,setLongBreakMinutes
            }}>
              {showSettings ? <Settings /> : <Timer />}
            </SettingsContext.Provider>
            <EmbedContext.Provider value = {{embed, setEmbed}}></EmbedContext.Provider>
            <div style={{ display: showPlaylist ? 'block' : 'none' }}>
                <Spotify/>
                <button class="bg-black" onClick={() => setShowPlaylist(false)}> Close </button>
              </div>
{!showSettings && !showPlaylist ? <button onClick={() => setShowPlaylist(true)}>Change Playlist</button> : null}
          </div>
          <SpotifyEmbed/>
        </EmbedContext.Provider>
      )}
    </main>
  );
}

export default App;