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
  Checkbox,
} from "@mui/material/";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { theme } from "../../theme/theme";
import { CalculateWageButtonProps } from "./interface";
import { useState } from "react";
import writeXlsxFile from "write-excel-file";

const CalculateWageButton: React.FC<CalculateWageButtonProps> = (
  props: CalculateWageButtonProps
) => {
  const [calculatedListDisplay, setCalculatedListDisplay] = useState({
    holidayWageHour: true,
    wage: true,
    holidayWage: true,
    totalWage: true,
    note: true,
  });

  const onChecklistChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalculatedListDisplay({
      ...calculatedListDisplay,
      [event.target.name]: event.target.checked,
    });
  };

  async function generateExcelFile() {
    let checkedCount = 0;

    // For cell column width setting
    const columns = [{ width: 5 }, { width: 10 }];

    // Header Row
    const header_row: Object[] = [
      {
        value: "#",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      },
      {
        value: "이름",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      },
    ];

    if (calculatedListDisplay.holidayWageHour) {
      columns.push({ width: 15 });
      header_row.push({
        value: "주휴 수당 시간",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      });

      checkedCount++;
    }
    if (calculatedListDisplay.wage) {
      columns.push({ width: 15 });
      header_row.push({
        value: "월급",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      });

      checkedCount++;
    }
    if (calculatedListDisplay.holidayWage) {
      columns.push({ width: 15 });
      header_row.push({
        value: "주휴 수당",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      });

      checkedCount++;
    }
    if (calculatedListDisplay.totalWage) {
      columns.push({ width: 15 });
      header_row.push({
        value: "월급 + 주휴 수당",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      });

      checkedCount++;
    }
    if (calculatedListDisplay.note) {
      columns.push({ width: 15 });
      header_row.push({
        value: "비고",
        fontWeight: "bold",
        align: "center",
        borderColor: "#C0C0C0",
        borderStyle: "thin",
      });

      checkedCount++;
    }

    // Data Array
    const data = [header_row];

    // Value
    props.workers.map((info, i) => {
      const list_row: any = [
        {
          value: (i + 1).toString(),
          align: "center",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        },
        {
          value: info.name,
          align: "center",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        },
      ];

      if (calculatedListDisplay.holidayWageHour) {
        list_row.push({
          value: calculateTotalholidayAllowanceTime(i),
          align: "center",
          format: "#,##0.00",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        });
      }
      if (calculatedListDisplay.wage) {
        list_row.push({
          value: calculateDayNightWage(i),
          align: "right",
          format: "#,##0",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        });
      }
      if (calculatedListDisplay.holidayWage) {
        list_row.push({
          value: calculateTotalholidayAllowance(i),
          align: "right",
          format: "#,##0",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        });
      }
      if (calculatedListDisplay.totalWage) {
        list_row.push({
          value: calculateDayNightWage(i) + calculateTotalholidayAllowance(i),
          align: "right",
          format: "#,##0",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        });
      }
      if (calculatedListDisplay.note) {
        list_row.push({
          value: "",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        });
      }

      data.push(list_row);
    });

    // Empty Spacing
    const spacing = [{}, {}];
    for (let i = 0; i < checkedCount - 1; i++) spacing.push({});
    data.push([...spacing, {}]);

    // Total Wage of all workers - condition: displayed only if total wage is checked or both of wage and holiday wage are checked
    if (
      calculatedListDisplay.totalWage ||
      (calculatedListDisplay.wage && calculatedListDisplay.holidayWage)
    ) {
      data.push([
        ...spacing,
        {
          value: "총 급여",
          fontWeight: "bold",
          align: "center",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        },
      ]);
      data.push([
        ...spacing,
        {
          value: calculateTotalWage(),
          align: "right",
          format: "#,##0",
          borderColor: "#C0C0C0",
          borderStyle: "thin",
        },
      ]);
    }

    await writeXlsxFile(data, {
      columns,
      fileName: "급여 계산 결과.xlsx",
      orientation: "landscape",
      //#080808
    });
  }

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
          <Box padding={1}>
            {/* 리스트 체크 리스트 */}
            <Box display="flex" marginLeft="50px" marginTop={2}>
              {/* 이름칸 - 공백 */}
              <Box width={122} minWidth={122} />

              {/* 평균 주휴 수당 시간 칸 */}
              <Box
                width={202}
                minWidth={202}
                display="flex"
                justifyContent="center"
              >
                <Checkbox
                  checked={calculatedListDisplay.holidayWageHour}
                  onChange={onChecklistChange}
                  name="holidayWageHour"
                />
              </Box>
              {/* 월급 칸 */}
              <Box
                width={202}
                minWidth={202}
                display="flex"
                justifyContent="center"
              >
                <Checkbox
                  checked={calculatedListDisplay.wage}
                  onChange={onChecklistChange}
                  name="wage"
                />
              </Box>
              {/* 주휴 수당 칸 */}
              <Box
                width={202}
                minWidth={202}
                display="flex"
                justifyContent="center"
              >
                <Checkbox
                  checked={calculatedListDisplay.holidayWage}
                  onChange={onChecklistChange}
                  name="holidayWage"
                />
              </Box>
              {/* 월급 + 주휴 수당 칸 */}
              <Box
                width={202}
                minWidth={202}
                display="flex"
                justifyContent="center"
              >
                <Checkbox
                  checked={calculatedListDisplay.totalWage}
                  onChange={onChecklistChange}
                  name="totalWage"
                />
              </Box>
              {/* 비고 칸 */}
              <Box
                width={152}
                minWidth={152}
                display="flex"
                justifyContent="center"
              >
                <Checkbox
                  checked={calculatedListDisplay.note}
                  onChange={onChecklistChange}
                  name="note"
                />
              </Box>
            </Box>

            {/* 리스트 제목 */}
            <Box display="flex" marginLeft="50px">
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
                        {calculateTotalholidayAllowanceTime(i).toFixed(2)} 시간
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
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            // onClick={downloadWageCalculation}
            onClick={generateExcelFile}
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
