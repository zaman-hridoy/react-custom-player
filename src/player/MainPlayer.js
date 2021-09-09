import React from "react";
import ReactPlayer from "react-player";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Typography } from "@material-ui/core";

// components
import PlayerControls from "./PlayerControls";
import screenfull from "screenfull";

const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
}));

const linkFromYoutube = "https://www.youtube.com/watch?v=iOPVX9YalUs";
const otherLink = "/videos/Rexy.mp4";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

function MainPlayer() {
  const classes = useStyles();
  const playerRef = React.useRef(null);
  const playerContainerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const controlsRef = React.useRef(null);

  const [state, setState] = React.useState({
    playing: false,
    muted: false,
    volume: 0.5,
    playBackRate: 1.0,
    played: 0,
    seeking: false,
  });
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");
  const [bookmarks, setBookmarks] = React.useState([]);

  const { playing, muted, volume, playBackRate, played, seeking } = state;

  // player controls actions
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handleVolumeSeekUp = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handlePlayBackRate = (rate) => {
    setState({ ...state, playBackRate: rate });
  };

  const toggleFullscren = () => {
    screenfull.toggle(playerContainerRef.current);
  };

  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }

    if (controlsRef.current.style.visibility == "visible") {
      count += 1;
    }

    if (!seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleOnSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };
  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };
  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  };

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      playerRef.current.getInternalPlayer(),
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageURL = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;

    setBookmarks([
      ...bookmarks,
      { time: currentTime, display: elapseTime, image: imageURL },
    ]);
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";
  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapseTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  return (
    <div>
      <div
        className={classes.playerWrapper}
        ref={playerContainerRef}
        onMouseMove={handleMouseMove}
      >
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          url={otherLink}
          muted={muted}
          playing={playing}
          volume={volume}
          playbackRate={playBackRate}
          onProgress={handleProgress}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
              },
            },
          }}
        />

        {/* player controls  */}
        <PlayerControls
          ref={controlsRef}
          onPlayPause={handlePlayPause}
          playing={playing}
          onRewind={handleRewind}
          onFastForward={handleFastForward}
          muted={muted}
          onMute={handleMute}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekUp={handleVolumeSeekUp}
          volume={volume}
          onPlayBackRate={handlePlayBackRate}
          playbackRate={playBackRate}
          toggleFullscren={toggleFullscren}
          played={played}
          onSeek={handleOnSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          elapseTime={elapseTime}
          totalDuration={totalDuration}
          onChangeDisplayFormat={handleChangeDisplayFormat}
          onBookmark={addBookmark}
        />
      </div>

      {/* show bookmarks */}
      <Grid container spacing={3} style={{ marginTop: 50 }}>
        {bookmarks.map((bookmark, index) => (
          <Grid item key={index}>
            <Paper onClick={() => playerRef.current.seekTo(bookmark.time)}>
              <img crossOrigin="anonymous" src={bookmark.image} alt="" />
              <Typography>Bookmark at {bookmark.display}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <br />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default MainPlayer;
