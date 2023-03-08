import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Divider, Fade, List } from "@mui/material";
import { useEffect, useState } from "react";
import {
  pullBasicInfo,
  pushWorkersInfo,
  pullWorkersInfo,
} from "../../database/api/api";
import { auth } from "../../database/authentication/firebaseAuthentifcation";
import { WorkerInfo } from "../../database/component/WorkerInfo";
import AddWorkerButton from "../button/AddWorkerButton";
import EditWorkerButton from "../button/EditWorkerButton";
import DeleteWorkerButton from "../button/DeleteWorkerButton";
import { theme } from "../../theme/theme";

export const WorkerInfoPanel: React.FC = () => {
  const [workers, setWorkers] = useState<Array<WorkerInfo>>([]);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [uid, setUid] = useState("");
  const [minimumWage, setMinimumWage] = useState("0");

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser !== null) {
        setUid(auth.currentUser.uid);
        pullWorkersInfo(auth.currentUser.uid).then(
          (info) => {
            setWorkers(info);
            setLoading(false);
          },
          (errorStr) => {
            if (errorStr.indexOf("do not exist") !== -1) {
              setLoading(false);
            }
          }
        );
        pullBasicInfo(auth.currentUser.uid).then((info) => {
          setMinimumWage(info.minimumWage.toString());
        });
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

  const handleAddWorker = (name: string, wage: number) => {
    let array = workers;
    array.push({
      name: name,
      wage: wage,
      weeklyHours: ["", "", "", "", "", ""],
      dayNightHours: ["", ""],
    });
    setWorkers(array);
    setIsChanged(true);
  };

  const handleEditWorker = (name: string, wage: number, index: number) => {
    let array = workers;
    array[index] = {
      name: name,
      wage: wage,
      weeklyHours: workers[index].weeklyHours,
      dayNightHours: workers[index].dayNightHours,
    };
    setWorkers(array);
    setIsChanged(true);
  };

  const handleDeleteWorker = (index: number) => {
    let array = workers;
    array.splice(index, 1);
    setWorkers(array);
    setIsChanged(true);
  };

  return (
    <Fade in={!loading} timeout={300}>
      <Box padding={2} height="auto" bgcolor={theme.palette.background.default}>
        <Typography variant="h5">아르바이트생 정보 입력</Typography>
        <Divider />

        <Box display="flex" width={300} marginLeft="50px" marginTop={2}>
          <Box width="100%" bgcolor={theme.palette.background.paper} border={1}>
            <Typography variant="h6" align="center" fontWeight="bold">
              아르바이트생 정보
            </Typography>
          </Box>
        </Box>
        <List sx={{ width: 350, marginTop: -1 }}>
          {workers.map((info, i) => (
            <Box key={i} display="flex" width="100%" height={50}>
              <Box
                width={50}
                bgcolor={theme.palette.background.default}
                paddingTop={1}
              >
                <Typography variant="h6" align="center" fontWeight="bold">
                  {i}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                width={300}
                bgcolor={theme.palette.background.default}
                border={1}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ marginLeft: 2, marginTop: 1 }}
                >
                  {info.name}, {info.wage}원
                </Typography>

                <Box display="flex">
                  <EditWorkerButton
                    minimumWage={minimumWage}
                    currentName={info.name}
                    currentWage={info.wage}
                    index={i}
                    handleEditWorker={handleEditWorker}
                  />
                  <DeleteWorkerButton
                    index={i}
                    handleDeleteWorker={handleDeleteWorker}
                  />
                </Box>
              </Box>
            </Box>
          ))}
          <AddWorkerButton
            minimumWage={minimumWage}
            handleAddWorker={handleAddWorker}
            height={50}
            width={300}
            marginLeft="50px"
          />
        </List>
      </Box>
    </Fade>
  );
};
