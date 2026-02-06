import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

const VerifyOtp = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: false
    });

    // 1. Recover Email from Storage on Mount
    useEffect(() => {
        const storedEmail = localStorage.getItem('pending_email');
        const storedPhone = localStorage.getItem('pending_phone');
        
        if (!storedEmail) {
            // If user tries to access this route directly without registering first
            navigate('/register');
        } else {
            setEmail(storedEmail);
            setPhone(storedPhone);
        }
    }, [navigate]);

    // 2. Verify Logic
    const handleVerify = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/varify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: otp
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Invalid OTP");

            setStatus({ loading: false, error: '', success: true });

            // Cleanup storage
            localStorage.removeItem('pending_email');
            localStorage.removeItem('pending_phone');

            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    // 3. Resend Logic
    const handleResend = async () => {
        try {
            setStatus({ ...status, loading: true });
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone })
            });
            
            if(!res.ok) throw new Error("Failed to resend");
            alert("OTP Resent Successfully!");
        } catch (err) {
            alert(err.message);
        } finally {
            setStatus({ ...status, loading: false });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                
                <div className="bg-amber-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Mail className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Verify Account</h2>
                    <p className="text-amber-100 mt-2 text-sm">
                        Enter the code sent to <br/> <span className="font-semibold">{email}</span>
                    </p>
                </div>

                <div className="p-8">
                    {status.error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded flex items-center gap-2 border border-red-200">
                            <AlertCircle size={16} /> {status.error}
                        </div>
                    )}

                    {status.success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded flex items-center gap-2 border border-green-200">
                            <CheckCircle size={16} /> Verification Successful!
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                        <FormInput
                            label="One-Time Password"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="123456"
                            className="text-center text-2xl tracking-widest font-mono"
                        />

                        <Button 
                            text={status.loading ? "Verifying..." : "Verify & Login"} 
                            type="submit" 
                            disabled={status.loading} 
                        />
                    </form>

                    <div className="flex justify-between mt-6 text-sm px-1">
                        <button 
                            type="button" 
                            onClick={() => {
                                localStorage.removeItem('pending_email');
                                navigate('/register');
                            }} 
                            className="text-stone-500 hover:text-stone-700 underline"
                        >
                            Change Email
                        </button>
                        <button 
                            type="button" 
                            onClick={handleResend} 
                            disabled={status.loading}
                            className="text-amber-600 font-semibold hover:underline disabled:opacity-50"
                        >
                            Resend Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;