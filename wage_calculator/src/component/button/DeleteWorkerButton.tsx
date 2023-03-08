import * as React from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
} from "@mui/material/";
import ClearIcon from "@mui/icons-material/Clear";
import { DeleteWorkerButtonProps } from "./interface";
import { theme } from "../../theme/theme";

const DeleteWorkerButton: React.FC<DeleteWorkerButtonProps> = (
  props: DeleteWorkerButtonProps
) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    props.handleDeleteWorker(props.index);
    setOpen(false);
  };

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="center">
        <IconButton onClick={handleClickOpen} sx={{ width: 40, height: 40 }}>
          <ClearIcon
            fontSize="medium"
            sx={{ color: theme.palette.primary.main }}
          />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: "white",
          },
        }}
      >
        <DialogTitle>알르바이트생의 정보를 삭제하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            삭제된 정보는 회복이 불가합니다.
          </DialogContentText>
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
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteWorkerButton;
