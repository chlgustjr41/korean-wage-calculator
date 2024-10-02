import React from "react";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import CalculatorPage from "./page/CalculatorPage";
import LoginPage from "./page/LoginPage";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme/theme";
import AlreadyLoggedInRoute from "./route/AlreadyLoggedInRoute";
import AuthRoute from "./route/AuthRoute";
import 'tailwindcss/tailwind.css'
import "./style.css"
import { QueryClient, QueryClientProvider } from "react-query";


const App: React.FC = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
