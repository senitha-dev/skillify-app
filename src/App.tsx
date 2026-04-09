import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import Careers from './pages/Careers';
import Resources from './pages/Resources';
import Progress from './pages/Progress';
import GapAnalysis from './pages/GapAnalysis';
import Layout from './components/Layout';
import { useEffect, useState, useCallback } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', checkAuth);
    // Custom event for same-tab changes
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={checkAuth} /> : <Navigate to="/" />} />
          
          <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/gap-analysis" element={<GapAnalysis />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}
