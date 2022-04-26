function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [sound, setSound] = React.useState(new Audio("./beep.wav"));

  const playSound = () => {
    sound.currentTime = 0;
    sound.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
  };

  const changeTime = (amount, type) => {
    console.log(breakTime);

    if (type === "Break") {
      if (breakTime <= 60) {
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60) {
        return;
      }
      setSessionTime((prev) => prev + amount);
      setDisplayTime((prev) => prev + amount);
    }
  };

  const resetTime = () => {
    console.log("reset");
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(false);
    setOnBreak(false);
  };

  const controlTime = () => {
    const second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVar = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVar) {
              playSound();
              onBreakVar = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVar) {
              playSound();
              onBreakVar = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });

          nextDate += second;
          console.log(timerOn);
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }

    setTimerOn(!timerOn);
  };

  return (
    <div className="app-container">
      <h1>Pomodoro</h1>
      <div className="timer-settings">
        <Length type={"Break"} changeTime={changeTime} time={breakTime} formatTime={formatTime} />
        <Length type={"Session"} changeTime={changeTime} time={sessionTime} formatTime={formatTime} />
      </div>
      <h2>{onBreak ? "Break" : "Session"}</h2>
      <h2 className="display-time">{formatTime(displayTime)}</h2>
      <div className="buttons">
        <button className="btn-small deep-purple lighten-2" onClick={controlTime}>
          {timerOn ? <i className="large material-icons">pause</i> : <i className="large material-icons">play_arrow</i>}
        </button>
        <button className="btn-small deep-purple lighten-2" onClick={resetTime}>
          <i className="large material-icons">refresh</i>
        </button>
      </div>
    </div>
  );
}

function Length({ type, changeTime, time, formatTime }) {
  return (
    <div>
      <h3>{type} Length</h3>
      <div className="time-sets">
        <button className="btn-small deep-purple lighten-2" onClick={() => changeTime(-60, type)}>
          <i class="large material-icons">arrow_downward</i>
        </button>
        <h3>{formatTime(time)}</h3>
        <button className="btn-small deep-purple lighten-2" onClick={() => changeTime(60, type)}>
          <i class="large material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
