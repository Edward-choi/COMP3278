import './style.css';
import { Route, Routes } from 'react-router-dom';
import React from "react";

import Home from './pages/Home';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Timetable from './pages/Timetable';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/timetable" element={<Timetable />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
