import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import UserManagement from './components/admin/UserManagement';
// import OfficeManagement from './components/admin/OfficeManagement';
// import SessionManagement from './components/admin/SessionManagement';
import { Toaster } from 'react-hot-toast';
import './App.css';

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
              
                <Layout>
                  <Dashboard />
                </Layout>
              
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