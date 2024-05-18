import ReactSlider from 'react-slider';
import './slider.css'
import SettingsContext from "./SettingsContext";
import {useContext} from "react";
import BackButton from "./buttons/BackButton";


function Settings() {
  const settingsInfo = useContext(SettingsContext);
  return(
    <div style={{textAlign:'left'}}>
      <label>work: {settingsInfo.workMinutes}:00</label>
      <ReactSlider
        className={'slider'}
        thumbClassName={'thumb'}
        trackClassName={'track'}
        value={settingsInfo.workMinutes}
        onChange={newValue => settingsInfo.setWorkMinutes(newValue)}
        min={1}
        max={120}
     
      />
      <label>short break: {settingsInfo.shortBreakMinutes}:00</label>
      <ReactSlider
        className={'slider green'}
        thumbClassName={'thumb'}
        trackClassName={'track'}
        value={settingsInfo.shortBreakMinutes}
        onChange={newValue => settingsInfo.setShortBreakMinutes(newValue)}
        min={1}
        max={120}
      />
      <label>long break: {settingsInfo.longBreakMinutes}:00</label>
      <ReactSlider
        className={'slider '}
        thumbClassName={'thumb'}
        trackClassName={'track'}  
        value={settingsInfo.longBreakMinutes}
        onChange={newValue => settingsInfo.setLongBreakMinutes(newValue)}
        min={1}
        max={120}
      />
      <div style={{textAlign:'center', marginTop:'20px'}}>
        <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
      </div>

    </div>
  );
}

export default Settings;