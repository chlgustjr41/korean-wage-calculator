import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Alert, Button, Divider, Fade, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { pushBasicInfo, pullBasicInfo } from "../../database/api/api";
import {
  auth,
  currentUser,
} from "../../database/authentication/firebaseAuthentifcation";
import { theme } from "../../theme/theme";

export const MainMenuPanel: React.FC = () => {
  const [minimumWage, setMinimumWage] = useState("0");
  const [lateNightWorkMultiplier, setLateNightWorkMultiplier] = useState("0");
  const [holidayAllowanceMinimumWorkTime, setHolidayAllowanceMinimumWorkTime] =
    useState("0");
  const [weeklyWorkingDays, setWeeklyWorkingDays] = useState("0");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser !== null) {
        setUid(auth.currentUser.uid);
        pullBasicInfo(auth.currentUser.uid).then(
          (info) => {
            setMinimumWage(info.minimumWage.toString());
            setLateNightWorkMultiplier(info.lateNightWorkMultiplier.toString());
            setHolidayAllowanceMinimumWorkTime(
              info.holidayAllowanceMinimumWorkTime.toString()
            );
            setWeeklyWorkingDays(info.weeklyWorkingDays.toString());
            setLoading(false);
          },
          (errorStr) => {
            if (errorStr.indexOf("do not exist") !== -1) {
              pushBasicInfo(
                {
                  minimumWage: 0,
                  lateNightWorkMultiplier: 0,
                  holidayAllowanceMinimumWorkTime: 0,
                  weeklyWorkingDays: 0,
                },
                uid
              ).then(() => {
                setLoading(false);
              });
            }
          }
        );
      }
    });
  }, []);

  const onMinimumWageChange = (e: any) => {
    setMinimumWage(e.target.value);
    pushBasicInfo(
      {
        minimumWage: +e.target.value,
        lateNightWorkMultiplier: +lateNightWorkMultiplier,
        holidayAllowanceMinimumWorkTime: +holidayAllowanceMinimumWorkTime,
        weeklyWorkingDays: +weeklyWorkingDays,
      },
      uid
    );
  };
  const onLateNightWorkMultiplierChange = (e: any) => {
    setLateNightWorkMultiplier(e.target.value);
    pushBasicInfo(
      {
        minimumWage: +minimumWage,
        lateNightWorkMultiplier: +e.target.value,
        holidayAllowanceMinimumWorkTime: +holidayAllowanceMinimumWorkTime,
        weeklyWorkingDays: +weeklyWorkingDays,
      },
      uid
    );
  };
  const onHolidayAllowanceMinimumWorkTimeChange = (e: any) => {
    setHolidayAllowanceMinimumWorkTime(e.target.value);
    pushBasicInfo(
      {
        minimumWage: +minimumWage,
        lateNightWorkMultiplier: +lateNightWorkMultiplier,
        holidayAllowanceMinimumWorkTime: +e.target.value,
        weeklyWorkingDays: +weeklyWorkingDays,
      },
      uid
    );
  };
  const onWeeklyWorkingDaysChange = (e: any) => {
    setWeeklyWorkingDays(e.target.value);
    pushBasicInfo(
      {
        minimumWage: +minimumWage,
        lateNightWorkMultiplier: +lateNightWorkMultiplier,
        holidayAllowanceMinimumWorkTime: +holidayAllowanceMinimumWorkTime,
        weeklyWorkingDays: +e.target.value,
      },
      uid
    );
  };

  return (
    <Fade in={!loading} timeout={300}>
      <Box padding={2} height="auto" bgcolor={theme.palette.background.default}>
        <Typography variant="h5">계산기 기본 정보 입력</Typography>
        <Divider />

        <Box display="flex" flexDirection="column">
          {/* minimumWage */}
          <Box
            display="flex"
            justifyContent="space-between"
            width={400}
            marginTop={2}
          >
            <Typography variant="h6" marginTop={0.5}>
              최저 시급:
            </Typography>
            <Box display="flex" minWidth={150} width={150}>
              <TextField
                variant="standard"
                type="number"
                value={minimumWage}
                sx={{ minWidth: 100, width: 100 }}
                onChange={onMinimumWageChange}
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    setMinimumWage("");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setMinimumWage("0");
                  }
                }}
                inputProps={{
                  step: "100",
                }}
              />
              <Typography variant="h6" marginTop={0.5}>
                원
              </Typography>
            </Box>
          </Box>
          {/* lateNightWorkMultiplier */}
          <Box
            display="flex"
            justifyContent="space-between"
            width={400}
            marginTop={2}
          >
            <Typography variant="h6">야간 수당 비율:</Typography>
            <Box display="flex" minWidth={150} width={150}>
              <TextField
                variant="standard"
                type="number"
                value={lateNightWorkMultiplier}
                sx={{ minWidth: 100, width: 100 }}
                onChange={onLateNightWorkMultiplierChange}
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    setLateNightWorkMultiplier("");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setLateNightWorkMultiplier("0");
                  }
                }}
                inputProps={{
                  step: "0.1",
                }}
              />
              <Typography variant="h6" marginTop={0.5}>
                배
              </Typography>
            </Box>
          </Box>
          {/* holidayAllowanceMinimumWorkTime */}
          <Box
            display="flex"
            justifyContent="space-between"
            width={400}
            marginTop={2}
          >
            <Typography variant="h6">주휴 수당 최소 근무 시간:</Typography>
            <Box display="flex" minWidth={150} width={150}>
              <TextField
                variant="standard"
                type="number"
                value={holidayAllowanceMinimumWorkTime}
                sx={{ minWidth: 100, width: 100 }}
                onChange={onHolidayAllowanceMinimumWorkTimeChange}
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    setHolidayAllowanceMinimumWorkTime("");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setHolidayAllowanceMinimumWorkTime("0");
                  }
                }}
                inputProps={{
                  step: "1",
                }}
              />
              <Typography variant="h6" marginTop={0.5}>
                시간
              </Typography>
            </Box>
          </Box>
          {/* weeklyWorkingDays */}
          <Box
            display="flex"
            justifyContent="space-between"
            width={400}
            marginTop={2}
          >
            <Typography variant="h6">주 근무 일수:</Typography>
            <Box display="flex" minWidth={150} width={150}>
              <TextField
                variant="standard"
                type="number"
                value={weeklyWorkingDays}
                sx={{ minWidth: 100, width: 100 }}
                onChange={onWeeklyWorkingDaysChange}
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    setWeeklyWorkingDays("");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setWeeklyWorkingDays("0");
                  }
                }}
                inputProps={{
                  step: "1",
                }}
              />
              <Typography variant="h6" marginTop={0.5}>
                일
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};
