import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from "../buttons/PlayButton.js"
import PauseButton from "../buttons/PauseButton.js"
import SettingsButton from "../buttons/SettingsButton.js"
import {useContext, useState, useEffect, useRef, memo} from "react";
import SettingsContext from "../SettingsContext.js";

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
    console.log(secondsLeft, '- Has changed')
},[secondsLeft]) // <-- here put the parameter to listen, react will re-render component when your state will be changed


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
    <div class = "w-1/5 min-w-max mt-28">

      <CircularProgressbar
        value={percentage}
        text={minutes + ':' + seconds}
        styles={buildStyles({
        textColor:'#8a817c',
        pathColor:mode === 'work' ? '#8a817c' : 'd6ccc2',
        tailColor:'#8a817cf',
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