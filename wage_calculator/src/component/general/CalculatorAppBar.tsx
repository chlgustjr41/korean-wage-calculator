import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AdbIcon from "@mui/icons-material/Adb";
import { Box, Grid } from "@mui/material";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../database/authentication/firebaseAuthentifcation";

export const CalculatorAppBar: React.FC = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <AppBar position="sticky" elevation={1} sx={{ height: 55 }}>
      <Box display="flex" justifyContent="space-between" padding={1}>
        <Typography marginTop={1} marginLeft={1}>
          급여 계산기
        </Typography>
        {!loading && !user && (
          <Button href="/" sx={{ textTransform: "none" }}>
            <Typography color="white">Login</Typography>
          </Button>
        )}
        {!loading && user && (
          <Button
            href="/"
            onClick={() => signOut(auth)}
            sx={{ textTransform: "none" }}
          >
            <Typography color="white">로그아웃</Typography>
          </Button>
        )}
      </Box>
    </AppBar>
  );
};
