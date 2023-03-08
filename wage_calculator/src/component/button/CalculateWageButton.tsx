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
  Typography,
  List,
} from "@mui/material/";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { theme } from "../../theme/theme";
import { CalculateWageButtonProps } from "./interface";
import { useState } from "react";
import { toPng } from "html-to-image";

const CalculateWageButton: React.FC<CalculateWageButtonProps> = (
  props: CalculateWageButtonProps
) => {
  const printRef = React.useRef<HTMLDivElement>(null);
  const downloadWageCalculation = () => {
    props.downloadWorkerSchedule();

    if (printRef.current === null) {
      console.log("It was null");
      return;
    }

    toPng(printRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "급여 계산 결과.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const convertTimeStringtoNumber = (timeString: string): number => {
    let totalHour: number = 0;
    if (timeString !== "") {
      totalHour += +timeString.split(":")[0];
      totalHour += +timeString.split(":")[1] / 60;
    }

    return totalHour;
  };

  const calculateTotalholidayAllowanceTime = (workerIndex: number): number => {
    let totalHolidayAllowance: number = 0;
    props.workers[workerIndex].weeklyHours.forEach((weeklyHour) => {
      if (
        convertTimeStringtoNumber(weeklyHour) >=
        props.holidayAllowanceMinimumWorkTime
      ) {
        totalHolidayAllowance +=
          convertTimeStringtoNumber(weeklyHour) / props.weeklyWorkingDays;
      }
    });

    return totalHolidayAllowance;
  };

  const calculateDayNightWage = (workerIndex: number): number => {
    let totalDayNightWage: number = 0;
    totalDayNightWage +=
      convertTimeStringtoNumber(props.workers[workerIndex].dayNightHours[0]) *
      props.workers[workerIndex].wage;
    totalDayNightWage +=
      convertTimeStringtoNumber(props.workers[workerIndex].dayNightHours[1]) *
      props.minimumWage *
      props.lateNightWorkMultiplier;

    return totalDayNightWage;
  };

  const calculateTotalholidayAllowance = (workerIndex: number): number => {
    return calculateTotalholidayAllowanceTime(workerIndex) * props.minimumWage;
  };

  const calculateTotalWage = (): number => {
    let totalWage: number = 0;
    props.workers.forEach((worker, i) => {
      totalWage += calculateDayNightWage(i) + calculateTotalholidayAllowance(i);
    });

    return totalWage;
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{ textTransform: "none" }}
        onClick={handleClickOpen}
      >
        급여 계산
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        sx={{ bgcolor: "transparent" }}
        PaperProps={{
          style: {
            backgroundColor: "white",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" align="center">
            급여 계산 결과
          </Typography>
        </DialogTitle>

        <DialogContent>
          <div ref={printRef}>
            <Box padding={1}>
              {/* 리스트 제목 */}
              <Box display="flex" marginLeft="50px" marginTop={2}>
                {/* 이름 */}
                <Box
                  width={120}
                  minWidth={120}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    이름
                  </Typography>
                </Box>
                {/* 평균 주휴 수당 시간 */}
                <Box
                  width={200}
                  minWidth={200}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    평균 주휴 수당 시간
                  </Typography>
                </Box>
                {/* 월급 */}
                <Box
                  width={200}
                  minWidth={200}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    월급
                  </Typography>
                </Box>
                {/* 주휴 수당 */}
                <Box
                  width={200}
                  minWidth={200}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    주휴 수당
                  </Typography>
                </Box>
                {/* 월급 + 주휴 수당 */}
                <Box
                  width={200}
                  minWidth={200}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    월급 + 주휴 수당
                  </Typography>
                </Box>
                {/* 비고 */}
                <Box
                  width={150}
                  minWidth={150}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    비고
                  </Typography>
                </Box>
              </Box>

              {/* 리스트 값 */}
              <List sx={{ marginTop: -1 }}>
                {props.workers.map((info, i) => (
                  <Box key={i} display="flex" width="100%" height={50}>
                    {/* 번호 */}
                    <Box
                      width={50}
                      minWidth={50}
                      // bgcolor={theme.palette.background.default}
                      bgcolor="white"
                      paddingTop={1}
                    >
                      <Typography variant="h6" align="center" fontWeight="bold">
                        {i}
                      </Typography>
                    </Box>
                    {/* 이름 */}
                    <Box display="flex">
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width={120}
                        minWidth={120}
                        // bgcolor={theme.palette.background.default}
                        bgcolor="white"
                        border={1}
                      >
                        <Typography variant="h6" align="center">
                          {info.name}
                        </Typography>
                      </Box>{" "}
                    </Box>
                    {/* 총 주휴 수당 시간 */}
                    <Box display="flex">
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width={200}
                        minWidth={200}
                        // bgcolor={theme.palette.background.default}
                        bgcolor="white"
                        border={1}
                      >
                        <Typography variant="h6" align="center">
                          {calculateTotalholidayAllowanceTime(i).toFixed(2)}{" "}
                          시간
                        </Typography>
                      </Box>
                    </Box>
                    {/* 월급 */}
                    <Box display="flex">
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width={200}
                        minWidth={200}
                        // bgcolor={theme.palette.background.default}
                        bgcolor="white"
                        border={1}
                      >
                        <Typography variant="h6" align="center">
                          {calculateDayNightWage(i).toFixed(2)} 원
                        </Typography>
                      </Box>
                    </Box>
                    {/* 주휴 수당 */}
                    <Box display="flex">
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width={200}
                        minWidth={200}
                        // bgcolor={theme.palette.background.default}
                        bgcolor="white"
                        border={1}
                      >
                        <Typography variant="h6" align="center">
                          {calculateTotalholidayAllowance(i).toFixed(2)} 원
                        </Typography>
                      </Box>
                    </Box>
                    {/* 월급 + 주휴 수당 */}
                    <Box display="flex">
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width={200}
                        minWidth={200}
                        // bgcolor={theme.palette.background.default}
                        bgcolor="white"
                        border={1}
                      >
                        <Typography variant="h6" align="center">
                          {(
                            calculateDayNightWage(i) +
                            calculateTotalholidayAllowance(i)
                          ).toFixed(2)}{" "}
                          원
                        </Typography>
                      </Box>
                    </Box>

                    {/* 비고 */}
                    <Box
                      display="flex"
                      width={150}
                      minWidth={150}
                      // bgcolor={theme.palette.background.default}
                      bgcolor="white"
                      border={1}
                    />
                  </Box>
                ))}
              </List>
              <Box display="flex" flexDirection="column" marginLeft="980px">
                <Box
                  width={150}
                  // bgcolor={theme.palette.background.paper}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    총 급여
                  </Typography>
                </Box>
                <Box
                  width={150}
                  height={35}
                  // bgcolor={theme.palette.background.default}
                  bgcolor="white"
                  border={1}
                >
                  <Typography variant="h6" align="center">
                    {calculateTotalWage().toFixed(2)} 원
                  </Typography>
                </Box>
              </Box>
            </Box>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={downloadWageCalculation}
            sx={{ textTransform: "none" }}
          >
            다운로드
          </Button>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ textTransform: "none" }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CalculateWageButton;
