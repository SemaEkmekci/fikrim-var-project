import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import UserHomePage from './components/UserHomePage';
import 'bootstrap/dist/css/bootstrap.css';
import Application from './components/Application';
import Messages from './components/Messages';
import AdminHomePage from './components/AdminHomePage';
import MailVerification from './components/MailVerification';
import ForgotPassword from './components/ForgotPassword';
import ProjectIdeas from './components/ProjectIdeas';
import SuperUserHomePage from './components/SuperUserHomePage';
import HomePage from './components/HomePage';
import UnitManagers from './components/UnitManagers';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsLoggedIn(token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage/>} />
        <Route path='/login' element={isLoggedIn ? <Navigate to="/userHomePage" /> : <Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path="/userHomePage" element={<UserHomePage />} />
        <Route path="/application" element={<Application />} />
        <Route path="/adminHomePage" element={<AdminHomePage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/projectIdeas" element={<ProjectIdeas/>} />
        <Route path="/mailVerification" element={<MailVerification/>} />
        <Route path="/messages" element={<Messages/>} />
        <Route path="/superUserPage" element={<SuperUserHomePage/>} />
        <Route path="/unitManagers" element={<UnitManagers/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
