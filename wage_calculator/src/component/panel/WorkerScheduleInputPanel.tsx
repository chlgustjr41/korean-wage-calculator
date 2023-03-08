import * as React from "react";
import { Divider, Fade, List, Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import {
  pullBasicInfo,
  pushWorkersInfo,
  pullWorkersInfo,
} from "../../database/api/api";
import { auth } from "../../database/authentication/firebaseAuthentifcation";
import { WorkerInfo } from "../../database/component/WorkerInfo";
import InsertTimeButton from "../button/InsertTimeButton";
import CalculateWageButton from "../button/CalculateWageButton";
import ResetScheduleButton from "../button/ResetScheduleButton";
import { theme } from "../../theme/theme";
import { toPng } from "html-to-image";

export const WorkerScheduleInputPanel: React.FC = () => {
  const printRef = React.useRef<HTMLDivElement>(null);
  const downloadWorkerSchedule = () => {
    if (printRef.current === null) {
      console.log("It was null");
      return;
    }

    toPng(printRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "아르바이트생 근무표.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");

  const [minimumWage, setMinimumWage] = useState("0");
  const [lateNightWorkMultiplier, setLateNightWorkMultiplier] = useState("0");
  const [holidayAllowanceMinimumWorkTime, setHolidayAllowanceMinimumWorkTime] =
    useState("0");
  const [weeklyWorkingDays, setWeeklyWorkingDays] = useState("0");

  const [workers, setWorkers] = useState<Array<WorkerInfo>>([]);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser !== null) {
        setUid(auth.currentUser.uid);
        pullBasicInfo(auth.currentUser.uid).then((info) => {
          setMinimumWage(info.minimumWage.toString());
          setLateNightWorkMultiplier(info.lateNightWorkMultiplier.toString());
          setHolidayAllowanceMinimumWorkTime(
            info.holidayAllowanceMinimumWorkTime.toString()
          );
          setWeeklyWorkingDays(info.weeklyWorkingDays.toString());
        });
        pullWorkersInfo(auth.currentUser.uid).then((info) => {
          setWorkers(info);
        });

        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isChanged) {
      pushWorkersInfo(workers, uid).then(() => {
        setIsChanged(false);
      });
    }
  }, [isChanged]);

  const handleInsertWeeklyTime = (
    hour: number,
    minute: number,
    workerIndex: number,
    timeIndex: number
  ) => {
    let hoursArray: string[] = workers[workerIndex].weeklyHours;
    if (hour < 10) {
      hoursArray[timeIndex] = "0" + hour;
    } else {
      hoursArray[timeIndex] = hour.toString();
    }
    hoursArray[timeIndex] += ":";
    if (minute < 10) {
      hoursArray[timeIndex] += "0" + minute;
    } else {
      hoursArray[timeIndex] += minute.toString();
    }

    let workersArray: WorkerInfo[] = workers;
    workersArray[workerIndex].weeklyHours = hoursArray;
    setWorkers(workersArray);
    setIsChanged(true);
  };

  const handleInsertDayNightTime = (
    hour: number,
    minute: number,
    workerIndex: number,
    timeIndex: number
  ) => {
    let hoursArray: string[] = workers[workerIndex].dayNightHours;
    if (hour < 10) {
      hoursArray[timeIndex] = "0" + hour;
    } else {
      hoursArray[timeIndex] = hour.toString();
    }
    hoursArray[timeIndex] += ":";
    if (minute < 10) {
      hoursArray[timeIndex] += "0" + minute;
    } else {
      hoursArray[timeIndex] += minute.toString();
    }

    let workersArray: WorkerInfo[] = workers;
    workersArray[workerIndex].dayNightHours = hoursArray;
    setWorkers(workersArray);
    setIsChanged(true);
  };

  const handleResetSchedule = () => {
    let workersArray = workers;
    workersArray.forEach((worker, i) => {
      workersArray[i].weeklyHours = ["", "", "", "", "", ""];
      workersArray[i].dayNightHours = ["", ""];
    });
    setWorkers(workersArray);
    setIsChanged(true);
  };

  const calculateTotalHours = (timeArray: string[]): string => {
    let totalHour: number = 0;
    timeArray.forEach((hour) => {
      if (hour !== "") {
        totalHour += +hour.split(":")[0];
        totalHour += +hour.split(":")[1] / 60;
      }
    });
    return totalHour.toFixed(2);
  };

  return (
    <Fade in={!loading} timeout={1000}>
      <Box padding={2} height="auto" bgcolor={theme.palette.background.default}>
        <Typography variant="h5">아르바이트생 근무표 입력</Typography>
        <Divider />
        <div ref={printRef}>
          {/* 리스트 제목 */}
          <Box display="flex" marginLeft="50px" marginTop={2}>
            <Box
              width={120}
              minWidth={120}
              bgcolor={theme.palette.background.paper}
              border={1}
            >
              <Typography variant="h6" align="center" fontWeight="bold">
                이름
              </Typography>
            </Box>
            <Box
              display="flex"
              width={400 - 1}
              bgcolor={theme.palette.background.paper}
            >
              <Box width={1 / 6} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  1주
                </Typography>
              </Box>
              <Box width={1 / 6} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  2주
                </Typography>
              </Box>
              <Box width={1 / 6} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  3주
                </Typography>
              </Box>
              <Box width={1 / 6} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  4주
                </Typography>
              </Box>
              <Box width={1 / 6} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  5주
                </Typography>
              </Box>
              <Box width={1 / 6} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  6주
                </Typography>
              </Box>
            </Box>
            <Box
              width={100}
              minWidth={100}
              bgcolor={theme.palette.background.paper}
              border={1}
            >
              <Typography variant="h6" align="center" fontWeight="bold">
                총합 근무 시간 1
              </Typography>
            </Box>
            <Box
              display="flex"
              width={200}
              minWidth={200}
              bgcolor={theme.palette.background.paper}
            >
              <Box width={90} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  낮 근무 시간
                </Typography>
              </Box>
              <Box width={110} border={1}>
                <Typography variant="h6" align="center" fontWeight="bold">
                  야간 근무 시간
                </Typography>
              </Box>
            </Box>
            <Box
              width={100}
              minWidth={100}
              bgcolor={theme.palette.background.paper}
              border={1}
            >
              <Typography variant="h6" align="center" fontWeight="bold">
                총합 근무 시간 2
              </Typography>
            </Box>
          </Box>

          {/* 리스트 값 */}
          <List sx={{ marginTop: -1 }}>
            {workers.map((info, i) => (
              <Box key={i} display="flex" width="100%" height={50}>
                {/* 번호 */}
                <Box
                  width={50}
                  minWidth={50}
                  bgcolor={theme.palette.background.default}
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
                    bgcolor={theme.palette.background.default}
                    border={1}
                  >
                    <Typography variant="h6" align="center">
                      {info.name}
                    </Typography>
                  </Box>
                  {/* 주별 시간 1 */}
                  <Box
                    display="flex"
                    width={400 - 1}
                    bgcolor={theme.palette.background.default}
                  >
                    <Box
                      width={1 / 6}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].weeklyHours[0]}
                          workerIndex={i}
                          timeIndex={0}
                          handleInsertTime={handleInsertWeeklyTime}
                        />
                      </Box>
                    </Box>
                    <Box
                      width={1 / 6}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].weeklyHours[1]}
                          workerIndex={i}
                          timeIndex={1}
                          handleInsertTime={handleInsertWeeklyTime}
                        />
                      </Box>
                    </Box>
                    <Box
                      width={1 / 6}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].weeklyHours[2]}
                          workerIndex={i}
                          timeIndex={2}
                          handleInsertTime={handleInsertWeeklyTime}
                        />
                      </Box>
                    </Box>
                    <Box
                      width={1 / 6}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].weeklyHours[3]}
                          workerIndex={i}
                          timeIndex={3}
                          handleInsertTime={handleInsertWeeklyTime}
                        />
                      </Box>
                    </Box>
                    <Box
                      width={1 / 6}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].weeklyHours[4]}
                          workerIndex={i}
                          timeIndex={4}
                          handleInsertTime={handleInsertWeeklyTime}
                        />
                      </Box>
                    </Box>
                    <Box
                      width={1 / 6}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].weeklyHours[5]}
                          workerIndex={i}
                          timeIndex={5}
                          handleInsertTime={handleInsertWeeklyTime}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* 총합 시간 1 */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    width={100}
                    bgcolor={theme.palette.background.default}
                    border={1}
                  >
                    <Typography variant="body1" align="center">
                      {calculateTotalHours(workers[i].weeklyHours)} 시간
                    </Typography>
                  </Box>

                  {/* 낮 야간 시간 */}
                  <Box
                    display="flex"
                    width={200}
                    bgcolor={theme.palette.background.default}
                  >
                    <Box
                      width={90}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].dayNightHours[0]}
                          workerIndex={i}
                          timeIndex={0}
                          handleInsertTime={handleInsertDayNightTime}
                        />
                      </Box>
                    </Box>
                    <Box
                      width={110}
                      border={1}
                      display="flex"
                      justifyContent="center"
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                      >
                        <InsertTimeButton
                          timeString={workers[i].dayNightHours[1]}
                          workerIndex={i}
                          timeIndex={1}
                          handleInsertTime={handleInsertDayNightTime}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* 총합 시간 2 */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    width={100}
                    bgcolor={theme.palette.background.default}
                    border={1}
                  >
                    <Typography variant="body1" align="center">
                      {calculateTotalHours(workers[i].dayNightHours)} 시간
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </List>
        </div>
        <Box display="flex" justifyContent="flex-end" marginTop={5} width={975}>
          <ResetScheduleButton handleResetSchedule={handleResetSchedule} />
          <CalculateWageButton
            workers={workers}
            minimumWage={+minimumWage}
            lateNightWorkMultiplier={+lateNightWorkMultiplier}
            holidayAllowanceMinimumWorkTime={+holidayAllowanceMinimumWorkTime}
            weeklyWorkingDays={+weeklyWorkingDays}
            downloadWorkerSchedule={downloadWorkerSchedule}
          />
        </Box>
      </Box>
    </Fade>
  );
};
