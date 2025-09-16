import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import './App.css';
import HistoryPage from './pages/HistoryPage';
import Announcement from './pages/Announcement';
import ALayout from './components/adminLayout/ALayout';
import ADashboard from './pages/admin/AdminDashboard';
import OfficesPage from './pages/admin/OfficesPage';
import ReportPage from "./pages/admin/ReportPage";
import SessionsPage from "./pages/admin/SessionsPage";
import UsersPage from "./pages/admin/UsersPage";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
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
              <ProtectedRoute>
                <ALayout>
                  <ADashboard/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/offices" 
            element={
              <ProtectedRoute>
                <ALayout>
                  <OfficesPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute>
                <ALayout>
                  <ReportPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/sessions" 
            element={
              <ProtectedRoute>
                <ALayout>
                  <SessionsPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <ALayout>
                  <UsersPage/>
                </ALayout>
              </ProtectedRoute> 
            } 
          />
          {/* <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/offices" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <OfficeManagement />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/sessions" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <SessionManagement />
                </Layout>
              </ProtectedRoute>
            } 
          /> */}
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;