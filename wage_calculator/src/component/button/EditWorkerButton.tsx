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
} from "@mui/material/";
import EditIcon from "@mui/icons-material/Edit";
import { theme } from "../../theme/theme";
import { EditWorkerButtonProps } from "./interface";
import { useEffect, useState } from "react";
import { pullBasicInfo } from "../../database/api/api";
import { auth } from "../../database/authentication/firebaseAuthentifcation";

const EditWorkerButton: React.FC<EditWorkerButtonProps> = (
  props: EditWorkerButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(props.currentName);
  const [wage, setWage] = useState(props.currentWage.toString());

  const handleClickOpen = () => {
    setName(props.currentName);
    setWage(props.currentWage.toString());
    setOpen(true);
  };

  const handleClose = () => {
    props.handleEditWorker(name, +wage, props.index);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <IconButton onClick={handleClickOpen} sx={{ width: 40, height: 40 }}>
          <EditIcon
            fontSize="medium"
            sx={{ color: theme.palette.primary.main }}
          />
        </IconButton>
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
        <DialogTitle>아르바이트생 정보 변경</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="이름"
              variant="standard"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <TextField
              autoFocus
              type="number"
              margin="dense"
              id="name"
              label="시급"
              variant="standard"
              onChange={(e) => {
                setWage(e.target.value);
              }}
              value={wage}
              inputProps={{
                step: "100",
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                setWage(props.minimumWage);
              }}
            >
              최저 시급으로 설정
            </Button>
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
            변경
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditWorkerButton;
