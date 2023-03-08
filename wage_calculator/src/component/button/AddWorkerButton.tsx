import * as React from "react";
import {
  Button,
  Dialog,
  Grid,
  ListItemButton,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
} from "@mui/material/";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { theme } from "../../theme/theme";
import { AddWorkerButtonProps } from "./interface";
import { useState } from "react";

const AddWorkerButton: React.FC<AddWorkerButtonProps> = (
  props: AddWorkerButtonProps
) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [wage, setWage] = useState("");

  const handleClickOpen = () => {
    setName("");
    setWage("");
    setOpen(true);
  };

  const handleClose = () => {
    props.handleAddWorker(name, +wage);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <ListItemButton
        selected={false}
        onClick={handleClickOpen}
        sx={{
          "&.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          height: props.height,
          width: props.width,
          marginLeft: props.marginLeft,
        }}
      >
        <Box display="flex" justifyContent="center" width="100%">
          <AddCircleOutlineIcon
            fontSize="large"
            sx={{ color: theme.palette.primary.main }}
          />
        </Box>
      </ListItemButton>

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
        <DialogTitle>아르바이트생 추가</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="이름"
              variant="standard"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              inputProps={{
                form: {
                  autocomplete: "off",
                },
              }}
            />
            <TextField
              type="number"
              margin="dense"
              id="name"
              label="시급"
              variant="standard"
              value={wage}
              onChange={(e) => {
                setWage(e.target.value);
              }}
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
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddWorkerButton;
