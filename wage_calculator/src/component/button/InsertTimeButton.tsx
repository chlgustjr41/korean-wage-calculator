import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  IconButton,
  Typography,
  Fade,
} from "@mui/material/";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { theme } from "../../theme/theme";
import { InsertTimeButtonProps } from "./interface";
import { useEffect, useState } from "react";
import { pullBasicInfo } from "../../database/api/api";
import { auth } from "../../database/authentication/firebaseAuthentifcation";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { KeyboardEvent } from "react";

const InsertTimeButton: React.FC<InsertTimeButtonProps> = (
  props: InsertTimeButtonProps
) => {
  // Each line of schedules needs to track the "index" of the timeslots.
  // Requires only SINGLE worker information
  // May require additional "type" of the schedule slot for detecting the last index of the schedule slots
  // Instead of having timeString, have workers[i] so the weeklyHours array is accessible. Track with slots with timeIndex

  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(
    props.workerTimeInfo[props.timeIndex] === ""
      ? ""
      : props.workerTimeInfo[props.timeIndex].split(":")[0]
  );
  const [minute, setMinute] = useState(
    props.workerTimeInfo[props.timeIndex] === ""
      ? ""
      : props.workerTimeInfo[props.timeIndex].split(":")[1]
  );

  const [slotIndex, setSlotIndex] = useState(props.timeIndex);
  const [resetContent, setResetContent] = useState(true);

  const handleClickOpen = () => {
    setSlotIndex(props.timeIndex);
    setHour(
      props.workerTimeInfo[props.timeIndex] === ""
        ? ""
        : props.workerTimeInfo[props.timeIndex].split(":")[0]
    );
    setMinute(
      props.workerTimeInfo[props.timeIndex] === ""
        ? ""
        : props.workerTimeInfo[props.timeIndex].split(":")[1]
    );
    setOpen(true);
  };

  const handleClose = () => {
    props.handleInsertTime(+hour, +minute, props.workerIndex, slotIndex);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (slotIndex >= 0 || slotIndex < props.workerTimeInfo.length)
      setHour(
        props.workerTimeInfo[slotIndex] === ""
          ? ""
          : props.workerTimeInfo[slotIndex].split(":")[0]
      );
    setMinute(
      props.workerTimeInfo[slotIndex] === ""
        ? ""
        : props.workerTimeInfo[slotIndex].split(":")[1]
    );
  }, [slotIndex, setSlotIndex]);

  const handleNext = () => {
    setResetContent(false);
    props.handleInsertTime(+hour, +minute, props.workerIndex, slotIndex);
    setSlotIndex(slotIndex + 1);
  };

  const handlePrev = () => {
    setResetContent(false);
    props.handleInsertTime(+hour, +minute, props.workerIndex, slotIndex);
    setSlotIndex(slotIndex - 1);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    console.log(e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      handleClose();
    } else if (e.key === " ") {
      e.preventDefault();
      if (slotIndex < props.workerTimeInfo.length - 1) handleNext();
      else handleClose();
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="center">
        {props.workerTimeInfo[props.timeIndex] === "" ? (
          <IconButton onClick={handleClickOpen} sx={{ width: 40, height: 40 }}>
            <AccessTimeIcon
              fontSize="medium"
              sx={{ color: theme.palette.primary.main }}
            />
          </IconButton>
        ) : (
          <Button onClick={handleClickOpen}>
            <Typography variant="body1">
              {props.workerTimeInfo[props.timeIndex]}
            </Typography>
          </Button>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ bgcolor: "transparent" }}
        PaperProps={{
          style: {
            backgroundColor: "white",
          },
        }}
        onKeyDown={handleKeyPress}
      >
        <Fade
          in={resetContent}
          timeout={300}
          onExit={() => {
            setTimeout(() => {
              setResetContent(true);
            }, 150);
          }}
          exit={false}
        >
          <DialogTitle>{slotIndex + 1}째주 시간</DialogTitle>
        </Fade>
        <DialogContent sx={{ width: 250, height: 60 }}>
          <Fade
            in={resetContent}
            timeout={300}
            onExited={() => {
              setTimeout(() => {
                setResetContent(true);
              }, 150);
            }}
            exit={false}
            unmountOnExit
          >
            <Box display="flex">
              <Box marginTop={2} marginRight={2} width={40} height={40}>
                {slotIndex !== 0 && (
                  <IconButton color="primary" onClick={handlePrev}>
                    <NavigateBeforeIcon />
                  </IconButton>
                )}
              </Box>
              <TextField
                autoFocus
                type="number"
                margin="dense"
                id="name"
                label="시간"
                variant="standard"
                onChange={(e) => {
                  setHour(e.target.value);
                }}
                value={hour}
                inputProps={{
                  step: "1",
                }}
                autoComplete="off"
                sx={{ width: 100 }}
              />
              <TextField
                type="number"
                margin="dense"
                id="name"
                label="분"
                variant="standard"
                onChange={(e) => {
                  setMinute(e.target.value);
                }}
                value={minute}
                inputProps={{
                  step: "5",
                }}
                autoComplete="off"
                sx={{ width: 100, marginLeft: 1 }}
              />
              <Box marginTop={2} marginLeft={2} width={40} height={40}>
                {slotIndex !== props.workerTimeInfo.length - 1 && (
                  <IconButton color="primary" onClick={handleNext}>
                    <NavigateNextIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Fade>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ textTransform: "none" }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ textTransform: "none" }}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InsertTimeButton;
