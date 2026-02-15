import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { ArrowLeft, MapPin } from 'lucide-react';

const AddAddress = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [address, setAddress] = useState({
        flatNo: '',
        buildingName: '',
        area: '',
        city: '',
        pincode: '',
        state: ''
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Assuming you have a route /auth/address or /user/address
            // You need to add this route in your backend router pointing to addUserAddress controller
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for auth check
                body: JSON.stringify(address)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save address");

            alert("Address Saved Successfully!");
            navigate(-1); // Go back to profile or home

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 p-4">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
                
                {/* Header */}
                <div className="bg-white p-4 border-b border-stone-100 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-stone-800">Add Delivery Address</h2>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                <MapPin size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Flat / House No" name="flatNo" value={address.flatNo} onChange={handleChange} required />
                            <FormInput label="Building Name" name="buildingName" value={address.buildingName} onChange={handleChange} required />
                        </div>

                        <FormInput label="Area / Colony" name="area" value={address.area} onChange={handleChange} required />

                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="City" name="city" value={address.city} onChange={handleChange} required />
                            <FormInput label="Pincode" name="pincode" value={address.pincode} onChange={handleChange} required />
                        </div>

                        <FormInput label="State" name="state" value={address.state} onChange={handleChange} required />

                        <div className="pt-4">
                            <Button text={loading ? "Saving..." : "Save Address"} type="submit" disabled={loading} />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAddress;