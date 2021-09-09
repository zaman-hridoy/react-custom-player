import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Popover, Tooltip } from "@material-ui/core";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import {
  Button,
  Grid,
  Typography,
  IconButton,
  Slider,
} from "@material-ui/core";

const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },
  controlIcon: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.8)",
    "&:hover": {
      transform: "scale(0.9)",
      color: "#fff",
    },
  },
  bottomIcon: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },
  volumeSlider: {
    width: 100,
  },
}));

export default React.forwardRef(
  (
    {
      onPlayPause,
      playing,
      onFastForward,
      onRewind,
      onMute,
      muted,
      onVolumeChange,
      onVolumeSeekUp,
      volume,
      onPlayBackRate,
      playbackRate,
      toggleFullscren,
      played,
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      elapseTime,
      totalDuration,
      onChangeDisplayFormat,
      onBookmark,
    },
    ref
  ) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopover = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handlePlayback = (rate) => {
      onPlayBackRate(rate);
      handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? "playbackrate-popover" : undefined;

    return (
      <div className={classes.controlsWrapper} ref={ref}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ padding: 16 }}
        >
          <Grid item>
            <Typography variant="h6" style={{ color: "#fff" }}>
              Video Title
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BookmarkIcon />}
              onClick={onBookmark}
            >
              Bookmark
            </Button>
          </Grid>
        </Grid>

        {/* middle controls */}
        <Grid container alignItems="center" justifyContent="center">
          <IconButton
            onClick={onRewind}
            aria-label="reqind"
            className={classes.controlIcon}
          >
            <FastRewindIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={onPlayPause}
            aria-label="reqind"
            className={classes.controlIcon}
          >
            {playing ? (
              <PauseIcon fontSize="inherit" />
            ) : (
              <PlayIcon fontSize="inherit" />
            )}
          </IconButton>
          <IconButton
            onClick={onFastForward}
            aria-label="reqind"
            className={classes.controlIcon}
          >
            <FastForwardIcon fontSize="inherit" />
          </IconButton>
        </Grid>

        {/* middle controls */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{ padding: 16 }}
        >
          <Grid item xs={12}>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              value={played * 100}
              min={0}
              max={100}
              onChange={onSeek}
              onMouseDown={onSeekMouseDown}
              onChangeCommitted={onSeekMouseUp}
              ValueLabelComponent={(props) => (
                <ValueLabelComponent {...props} value={elapseTime} />
              )}
            />
          </Grid>
          <Grid item>
            <Grid container alignItems="center" direction="row">
              <IconButton onClick={onPlayPause} className={classes.bottomIcon}>
                {playing ? (
                  <PauseIcon fontSize="inherit" />
                ) : (
                  <PlayIcon fontSize="inherit" />
                )}
              </IconButton>
              <IconButton onClick={onMute} className={classes.bottomIcon}>
                {muted ? (
                  <VolumeOffIcon fontSize="large" />
                ) : (
                  <VolumeUpIcon fontSize="large" />
                )}
              </IconButton>
              <Slider
                min={0}
                max={100}
                value={volume * 100}
                className={classes.volumeSlider}
                onChange={onVolumeChange}
                onChangeCommitted={onVolumeSeekUp}
              />
              <Button
                onClick={onChangeDisplayFormat}
                variant="text"
                style={{ color: "#fff", marginLeft: 16 }}
              >
                <Typography>
                  {elapseTime}/{totalDuration}
                </Typography>
              </Button>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="text"
              className={classes.bottomIcon}
              aria-describedby={id}
              onClick={handlePopover}
            >
              <Typography>{playbackRate}X</Typography>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <Grid container direction="column-reverse">
                {[0.5, 1, 1.5, 1.2].map((rate) => (
                  <Button variant="text" onClick={() => handlePlayback(rate)}>
                    <Typography
                      color={rate === playbackRate ? "secondary" : "default"}
                    >
                      {rate}X
                    </Typography>
                  </Button>
                ))}
              </Grid>
            </Popover>
            <IconButton
              onClick={toggleFullscren}
              className={classes.bottomIcon}
            >
              <FullscreenIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  }
);
