import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from "./buttons/PlayButton.js"
import PauseButton from "./buttons/PauseButton.js"
import SettingsButton from "./buttons/SettingsButton.js"
import {useContext, useState, useEffect, useRef} from "react";
import SettingsContext from "./SettingsContext";

const red = '#f54e4e';
const green = '#4aec8c';

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState('work'); // work/shortBreak/longBreak/null
  const [secondsLeft, setSecondsLeft] = useState(0);

  const workCountRef = useRef(0)
  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  function tick() {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  }

  useEffect(() => {

    function switchMode() {

      console.log(workCountRef.current)

      var nextMode = ''
      var nextSeconds = 0;
      if (modeRef.current === 'work' && workCountRef.current < 3){
        workCountRef.current++;;
        nextMode = 'shortBreak';
        nextSeconds = settingsInfo.shortBreakMinutes * 60;
      }
      else if (modeRef.current === 'work' && workCountRef.current === 3){
        nextMode = 'longBreak';
        nextSeconds = settingsInfo.longBreakMinutes * 60;
        workCountRef.current = 0;
      }
      else{
        nextMode = 'work';
        nextSeconds = settingsInfo.workMinutes * 60;
      }

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    }

    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        return switchMode();
      }

      tick();
    },1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  var totalSeconds = 0;
  if (mode === 'work'){
    totalSeconds = settingsInfo.workMinutes * 60;
  }
  else if (mode === 'shortBreak'){
    totalSeconds = settingsInfo.shortBreakMinutes * 60;
  }
  else{
    totalSeconds = settingsInfo.longBreakMinutes * 60;
  }

  const percentage = Math.round(secondsLeft / totalSeconds * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(seconds < 10) seconds = '0'+seconds;

  return (
    <div>

      <CircularProgressbar
        value={percentage}
        text={minutes + ':' + seconds}
        styles={buildStyles({
        textColor:'#fff',
        pathColor:mode === 'work' ? red : green,
        tailColor:'rgba(255,255,255,.2)',
      })} />
      <div style={{marginTop:'20px'}}>
        {isPaused
          ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
          : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
      </div>
      <div style={{marginTop:'20px'}}>
        <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
      </div>
    </div>
  );
}

export default Timer;