import react, { useState } from "react";
import { theme } from "../theme/theme";
import {
  Alert,
  Box,
  Button,
  Fade,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React from "react";
import GoogleIcon from "../component/image/icon/icons8-google-48.png";
import { signInWithGoogle } from "../database/authentication/firebaseAuthentifcation";
import { useNavigate } from "react-router-dom";
import JacobChoi from "../component/image/profile/jacob_choi.jpg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        bgcolor={theme.palette.background.default}
        width="100%"
        height="100%"
      >
        <Box display="flex" justifyContent="center" height="100%">
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Fade in={true} timeout={1000}>
              <Box display="flex" flexDirection="column">
                <Box
                  display="flex"
                  justifyContent="center"
                  padding={5}
                  borderRadius={5}
                  width={350}
                  height="auto"
                  bgcolor={theme.palette.background.paper}
                  boxShadow={5}
                >
                  <Box display="flex" flexDirection="column">
                    <Typography align="center" fontWeight="bold">
                      급여 계산기
                    </Typography>
                    <Typography align="center" marginTop={2}>
                      한국 법에 맞춰진 아르바이트 급여 계산기
                    </Typography>
                    <Typography align="center" marginTop={2}>
                      주유 수당, 야간 수당 계산도 포함
                    </Typography>
                    <Typography align="center" marginTop={2} color="grey.700">
                      * 이 계산기는 정확하지 않을 수 있습니다. 이 계산기의
                      개발자는 이 계산기의 사용으로 인한 불이익에 일절 책임을
                      지지 않습니다
                    </Typography>
                    <Button
                      onClick={() => {
                        signInWithGoogle().then(() => {
                          navigate("/calculator");
                        });
                      }}
                      variant="outlined"
                      sx={{
                        width: 350,
                        fontSize: 20,
                        textTransform: "none",
                        // bgcolor: "white",
                        bgcolor: theme.palette.background.default,
                        marginTop: 5,
                        "&:hover": {
                          backgroundColor: "#c4c2b9",
                        },
                      }}
                    >
                      <img src={GoogleIcon} width={30} height={30} />
                      <Typography marginLeft={1}>구글로 로그인</Typography>
                    </Button>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  width="100%"
                  position="absolute"
                  bottom="3%"
                  left={0}
                >
                  <Typography variant="body2" align="center" marginBottom={1}>
                    개발자
                  </Typography>
                  <Box
                    component="img"
                    src={JacobChoi}
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                    alignSelf="center"
                  />
                  <Typography
                    variant="body2"
                    align="center"
                    marginTop={1}
                    fontWeight="bold"
                  >
                    최현석
                  </Typography>
                  <Typography variant="body2" align="center" fontSize="small">
                    chlgustjr41@naver.com
                  </Typography>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
