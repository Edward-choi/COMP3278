import "./style.css";
import { Route, Routes } from "react-router-dom";

import React from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Timetable from "./pages/Timetable";
import Register from "./pages/Register";
import Course from "./pages/Course";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthStateProvider } from "./demo-data/auth_provider";
import FaceRecognitionRegister from "./pages/FaceRecognitionRegister";
import FaceRecognitionLogin from "./pages/FaceRecognitionLogin";

function App() {
  return (
    <AuthStateProvider>
      <ThemeProvider
        theme={createTheme({
          spacing: 4,
          palette: {
            mode: "light",
            primary: {
              main: "#436DFF",
              dark: "#3657CC",
              light: "#698ADD",
              lighter: "#8EA7FF",
              lightest: "#B4C5FF",
            },
            action: { soft: "#F2F4FB", medium: "#E9EDFB", strong: "#D6DFFC" },
            neutral: {
              darkest: "#1C1C1C",
              medium: "#575757",
              mild: "#b4b4b4",
              lightest: "#E8EAEE",
            },
            background: { light: "#FBFBFB" },
            error: { main: "#CE1C1C", secondary: "#B62B2B" },
            success: { main: "#AAC842", secondary: "#94D37E" },
          },
          duration: {
            enteringScreen: 300,
            leavingScreen: 300,
          },
        })}
      >
        <CssBaseline enableColorScheme />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id/:academic_year" element={<Course />} />
          <Route
            path="/faceRecognitionRegister/:name"
            element={<FaceRecognitionRegister />}
          />
          <Route
            path="/faceRecognitionLogin"
            element={<FaceRecognitionLogin />}
          />
        </Routes>
      </ThemeProvider>
    </AuthStateProvider>
  );
}

export default App;
