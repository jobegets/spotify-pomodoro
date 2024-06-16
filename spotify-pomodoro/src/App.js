import './App.css';
import Timer from "./Timer";
import Settings from "./Settings";
import {useState} from "react";
import SettingsContext from "./SettingsContext";
import Spotify from './Spotify';
import Login from './Login';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import Select from 'react-select'

  
function App() {

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
  

  const { isLoading, error, isAuthenticated } = useAuth0();

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(15);
  const [longBreakMinutes, setLongBreakMinutes] = useState(45);


  return (
    <main>
      {isLoading && <div>Loading...</div>}
      {! error && !isLoading && (
        <>
          <LoginButton/>
          <LogoutButton/>
          <Profile/>
        </>
      )}

      {isAuthenticated && (
        <div>

        <Select options={options} />
        <Spotify/>
        <SettingsContext.Provider value={{
          showSettings,setShowSettings,
          workMinutes,setWorkMinutes,
          shortBreakMinutes,setShortBreakMinutes,
          longBreakMinutes,setLongBreakMinutes
        }}>
          {showSettings ? <Settings /> : <Timer />}
        </SettingsContext.Provider>
      </div>
      )}
    </main>
  );
}

export default App;