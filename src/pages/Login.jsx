import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  
  // State for login credentials
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      // Assumed Login API Endpoint based on your previous register endpoint
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials : "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Check your credentials.');
      }

      // LOGIN SUCCESSFUL
      setStatus({ loading: false, error: '', success: true });
      console.log("Login successful, token:", data.token); // Assuming your backend sends a token
      
      // TODO: Store token in localStorage here if needed.
      // localStorage.setItem('token', data.token);

      // Redirect to dashboard after a short delay for user feedback
      setTimeout(() => {
         navigate('/home'); // We haven't built this page yet
         console.log("Redirecting to dashboard...");
      }, 1000);

    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      {/* Container: Responsive (Full width mobile, max-w-md desktop) */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
        
        {/* Header / Brand Area - Keeping consistency with Register page */}
        <div className="bg-amber-600 p-8 text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
          <p className="text-amber-100 mt-2">Sign in to your account</p>
        </div>

        {/* Form Area */}
        <div className="p-8">
          
          {/* Error / Success Messages */}
          {status.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
              Login successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormInput 
              label="Email Address" 
              type="email" 
              name="email" 
              value={credentials.email} 
              onChange={handleChange} 
              placeholder="john@example.com"
              required
            />

            <FormInput 
              label="Password" 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              required 
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-6">
               <Link to="/forgot-password" className="text-sm text-amber-600 hover:underline">
                 Forgot Password?
               </Link>
            </div>

            <Button 
              text="Sign In" 
              type="submit" 
              disabled={status.loading} 
            />
          </form>

          {/* Footer Link to Register */}
          <div className="mt-8 text-center border-t border-stone-100 pt-6">
            <p className="text-sm text-stone-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;