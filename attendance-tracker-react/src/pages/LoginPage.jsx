import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoginSidebar from '../components/login/LoginSidebar';
import LoginHeader from '../components/login/LoginHeader';
import LoginForm from '../components/login/LoginForm';
import LoginFooter from '../components/login/LoginFooter';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(credentials);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      <LoginSidebar />
      
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginHeader />
          
          <LoginForm
            credentials={credentials}
            showPassword={showPassword}
            isLoading={isLoading}
            setCredentials={setCredentials}
            setShowPassword={setShowPassword}
            handleSubmit={handleSubmit}
          />
          
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;