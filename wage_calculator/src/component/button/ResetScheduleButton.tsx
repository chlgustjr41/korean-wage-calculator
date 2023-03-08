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
import { ResetScheduleButtonProps } from "./interface";
import { theme } from "../../theme/theme";

const ResetScheduleButton: React.FC<ResetScheduleButtonProps> = (
  props: ResetScheduleButtonProps
) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleClose = () => {
    props.handleResetSchedule();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ marginRight: 1 }}
      >
        초기화
      </Button>

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
        <DialogTitle>
          알르바이트생들의 시간표를 초기화 하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            초기화된 정보는 회복이 불가합니다.
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
            초기화
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetScheduleButton;
