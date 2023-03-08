import react, { useState } from "react";
import { theme } from "../theme/theme";
import {
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { CalculatorAppBar } from "../component/general/CalculatorAppBar";
import TabPanel from "../component/general/TabPanel";

import { MainMenuPanel } from "../component/panel/MainMenuPanel";
import { WorkerInfoPanel } from "../component/panel/WorkerInfoPanel";
import { WorkerScheduleInputPanel } from "../component/panel/WorkerScheduleInputPanel";

const CalculatorPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isUserDev, setIsUserDev] = useState(false);
  // const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const tabPanelProps = (index: number) => {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  };

  const handleTabPanelChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box
        width="100%"
        height="auto"
        bgcolor={theme.palette.background.default}
      >
        <Fade in={true}>
          <Box display="flex" flexDirection="column" height="100%">
            <CalculatorAppBar />
            <Box display="flex" height="100%">
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabIndex}
                onChange={handleTabPanelChange}
                sx={{
                  width: 125,
                  minWidth: 125,
                  bgcolor: "white",
                }}
              >
                <Tab
                  label="메뉴"
                  {...tabPanelProps(0)}
                  sx={{
                    textTransform: "none",
                  }}
                />
                <Tab
                  label="아르바이트생 정보"
                  {...tabPanelProps(1)}
                  sx={{ textTransform: "none" }}
                />
                <Tab
                  label="아르바이트생 근무표"
                  {...tabPanelProps(1)}
                  sx={{ textTransform: "none" }}
                />
              </Tabs>
              <Divider orientation="vertical" />

              <TabPanel value={tabIndex} index={0}>
                <MainMenuPanel />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <WorkerInfoPanel />
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                <WorkerScheduleInputPanel />
              </TabPanel>
            </Box>
          </Box>
        </Fade>
      </Box>
    </>
  );
};

export default CalculatorPage;
