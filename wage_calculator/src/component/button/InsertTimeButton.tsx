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
} from "@mui/material/";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { theme } from "../../theme/theme";
import { InsertTimeButtonProps } from "./interface";
import { useEffect, useState } from "react";
import { pullBasicInfo } from "../../database/api/api";
import { auth } from "../../database/authentication/firebaseAuthentifcation";

const InsertTimeButton: React.FC<InsertTimeButtonProps> = (
  props: InsertTimeButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [hour, setName] = useState(
    props.timeString === "" ? "" : props.timeString.split(":")[0]
  );
  const [minute, setWage] = useState(
    props.timeString === "" ? "" : props.timeString.split(":")[1]
  );

  const handleClickOpen = () => {
    setName(props.timeString === "" ? "" : props.timeString.split(":")[0]);
    setWage(props.timeString === "" ? "" : props.timeString.split(":")[1]);
    setOpen(true);
  };

  const handleClose = () => {
    props.handleInsertTime(+hour, +minute, props.workerIndex, props.timeIndex);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="center">
        {props.timeString === "" ? (
          <IconButton onClick={handleClickOpen} sx={{ width: 40, height: 40 }}>
            <AccessTimeIcon
              fontSize="medium"
              sx={{ color: theme.palette.primary.main }}
            />
          </IconButton>
        ) : (
          <Button onClick={handleClickOpen}>
            <Typography variant="body1">{props.timeString}</Typography>
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
      >
        <DialogTitle>{props.timeIndex + 1}째주 시간</DialogTitle>
        <DialogContent>
          <Box display="flex">
            <TextField
              autoFocus
              type="number"
              margin="dense"
              id="name"
              label="시간"
              variant="standard"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={hour}
              inputProps={{
                step: "1",
                form: {
                  autocomplete: "off",
                },
              }}
              sx={{ width: 100 }}
            />
            <TextField
              type="number"
              margin="dense"
              id="name"
              label="분"
              variant="standard"
              onChange={(e) => {
                setWage(e.target.value);
              }}
              value={minute}
              inputProps={{
                step: "5",
                form: {
                  autocomplete: "off",
                },
              }}
              sx={{ width: 100, marginLeft: 1 }}
            />
          </Box>
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
