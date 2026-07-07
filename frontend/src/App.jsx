import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PromptTesting from './pages/PromptTesting';
import Hallucination from './pages/Hallucination';
import Sensitivity from './pages/Sensitivity';
import ContextLeakage from './pages/ContextLeakage';
import SafetyAnalysis from './pages/SafetyAnalysis';
import Consistency from './pages/Consistency';
import Regression from './pages/Regression';
import BugReports from './pages/BugReports';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

const SidebarLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-darkbg text-slate-100 flex">
      {/* Sidebar navigation panel */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content viewport */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
        sidebarOpen ? 'md:pl-64' : 'md:pl-20'
      }`}>
        <Navbar 
          toggleMobileSidebar={() => setSidebarOpen(!sidebarOpen)} 
          currentPathName={location.pathname.substring(1).replace('-', ' ')} 
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Layout Portal */}
          <Route 
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/prompts" element={<PromptTesting />} />
            <Route path="/hallucination" element={<Hallucination />} />
            <Route path="/sensitivity" element={<Sensitivity />} />
            <Route path="/leakage" element={<ContextLeakage />} />
            <Route path="/safety" element={<SafetyAnalysis />} />
            <Route path="/consistency" element={<Consistency />} />
            <Route path="/regression" element={<Regression />} />
            <Route path="/bug-reports" element={<BugReports />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback Catchall */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
