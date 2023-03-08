import React from "react";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import CalculatorPage from "./page/CalculatorPage";
import LoginPage from "./page/LoginPage";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import AlreadyLoggedInRoute from "./route/AlreadyLoggedInRoute";
import AuthRoute from "./route/AuthRoute";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AlreadyLoggedInRoute>
                <LoginPage />
              </AlreadyLoggedInRoute>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/calculator"
            element={
              <AuthRoute>
                <CalculatorPage />
              </AuthRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
