import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import RegisterSidebar from '../components/register/RegisterSidebar';
import RegisterForm from '../components/register/RegisterForm';
import RegisterHeader from '../components/register/RegisterHeader';
import RegisterFooter from '../components/register/RegisterFooter';
import { authService } from '../services/authService';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    officeId: '',
    faceEmbedding: null,
    faceUrl: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Mock office data
  const offices = [
    { id: 1, name: 'Headquarters', latitude: -6.2088, longitude: 106.8456, radiusMeters: 200 },
    { id: 2, name: 'Branch Office - Downtown', latitude: -6.1805, longitude: 106.8283, radiusMeters: 200 },
    { id: 3, name: 'Tech Campus', latitude: -6.2216, longitude: 106.7981, radiusMeters: 200 },
    { id: 4, name: 'Operations Center', latitude: -6.2297, longitude: 106.8253, radiusMeters: 200 }
  ];

  // Effect to attach stream AFTER video element is mounted
  useEffect(() => {
    if (isScanning && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isScanning]);

  // Clean up camera on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOfficeSelect = (officeId) => {
    setFormData({
      ...formData,
      officeId
    });
  };

  const startCamera = async () => {
    try {
      setCameraError(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Your browser does not support camera access');
        setCameraError(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;
      setIsScanning(true);
      setHasCameraPermission(true);
    } catch (err) {
      setCameraError(true);
      console.error('Camera error:', err);

      if (err.name === 'NotAllowedError') {
        toast.error('Camera access denied. Please allow camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        toast.error('No camera found. Please check if you have a camera connected.');
      } else {
        toast.error('Cannot access camera. Please check your browser permissions.');
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas) {
      toast.error('Camera not ready. Please try again.');
      return;
    }

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setFormData({
        ...formData,
        faceEmbedding: URL.createObjectURL(blob),
        faceUrl: blob
      });
      
      stopCamera();
      toast.success('Face captured successfully!');
    }, 'image/jpeg', 0.8);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.faceEmbedding) {
      toast.error('Please complete face scan');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData to send both file and form fields
      const submitData = new FormData();
      submitData.append('file', formData.faceUrl, 'face.jpg');
      
      // Add all user data as individual form fields (not as JSON blob)
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('officeId', formData.officeId);

      console.log("Sending form data with fields:");
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      // Send the request using authService
      await authService.register(submitData);
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.username || !formData.email || !formData.password || !formData.confirmPassword)) {
      toast.error('Please fill all required fields');
      return;
    }
    if (step === 2 && !formData.officeId) {
      toast.error('Please select an office location');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      <RegisterSidebar step={step} />
      
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <RegisterHeader />
          
          <RegisterForm
            step={step}
            formData={formData}
            offices={offices}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isLoading}
            isScanning={isScanning}
            cameraError={cameraError}
            videoRef={videoRef}
            canvasRef={canvasRef}
            handleInputChange={handleInputChange}
            handleOfficeSelect={handleOfficeSelect}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            startCamera={startCamera}
            stopCamera={stopCamera}
            captureFace={captureFace}
            handleSubmit={handleSubmit}
            nextStep={nextStep}
            prevStep={prevStep}
          />
          
          <RegisterFooter />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;