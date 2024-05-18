import './App.css';
import Timer from "./Timer";
import Settings from "./Settings";
import {useState} from "react";
import SettingsContext from "./SettingsContext";
import Login from './Login';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(15);
  const [longBreakMinutes, setLongBreakMinutes] = useState(45);


  return (
    <main>
      <Login/>
      <SettingsContext.Provider value={{
        showSettings,setShowSettings,
        workMinutes,setWorkMinutes,
        shortBreakMinutes,setShortBreakMinutes,
        longBreakMinutes,setLongBreakMinutes
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;