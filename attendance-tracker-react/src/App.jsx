import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/user/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';
import HistoryPage from './pages/user/HistoryPage';
import Announcement from './pages/user/Announcement';
import ALayout from './components/adminLayout/ALayout';
import ADashboard from './pages/admin/AdminDashboard';
import OfficesPage from './pages/admin/OfficesPage';
import ReportPage from "./pages/admin/ReportPage";
import SessionsPage from "./pages/admin/SessionsPage";
import UsersPage from "./pages/admin/UsersPage";
import Loading from './components/app/Loading';

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading/>;

  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading/>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
            } />
          <Route path="/register" element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          } />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <Layout>
                  <HistoryPage/>
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/announcement" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Announcement/>
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ALayout>
                  <ADashboard/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/offices" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ALayout>
                  <OfficesPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ALayout>
                  <ReportPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/sessions" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ALayout>
                  <SessionsPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ALayout>
                  <UsersPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;