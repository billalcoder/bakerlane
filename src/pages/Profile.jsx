import React, { useEffect, useState } from 'react';
import { User, Mail, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch User Data
    const fetchProfile = async () => {
      try {
        // Adjust endpoint to match your backend (e.g., /client/profile or /auth/me)
        const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/profile`, { 
            credentials: "include" 
        });
        
        const data = await res.json();
        
        if (data.success || data.user) {
            setUser(data.user || data.data);
        } else {
            // Fallback for demo if API isn't ready yet
            // setUser({ name: "Guest User", email: "guest@example.com" });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    // 1. Call logout API if exists
    await fetch(`${import.meta.env.VITE_BASEURL}/auth/logout`, { method: "POST" });
    alert("Logut successfull")
    // 3. Redirect
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-stone-400">
        <Loader2 className="animate-spin mr-2" /> Loading Profile...
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-10 animate-fade-in">
      
      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
        
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-amber-500 to-orange-600 relative">
             <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
                 <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                     <div className="w-full h-full bg-stone-100 rounded-full flex items-center justify-center text-stone-400 overflow-hidden">
                        {/* Avatar / Placeholder */}
                        <img 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                        />
                     </div>
                 </div>
             </div>
        </div>

        {/* Profile Content */}
        <div className="pt-14 pb-8 px-8 text-center">
            
            <h1 className="text-2xl font-bold text-stone-800 mb-1">
                {user?.name || "Guest Customer"}
            </h1>
            <p className="text-sm text-stone-400 mb-8">
                BakerApp Member
            </p>

            {/* Info Cards */}
            <div className="space-y-4 text-left">
                
                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 font-bold uppercase">Full Name</p>
                        <p className="font-semibold text-stone-700">{user?.name || "Not available"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="p-2 bg-white rounded-full text-amber-600 shadow-sm">
                        <Mail size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 font-bold uppercase">Email Address</p>
                        <p className="font-semibold text-stone-700">{user?.email || "Not available"}</p>
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-stone-100">
                <button 
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut size={18} /> Log Out
                </button>
            </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;