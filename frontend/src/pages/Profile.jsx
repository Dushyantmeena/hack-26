import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser, setUser } from "@/redux/user.slice";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { RouteIndex } from "@/helper/RouteName";
import { showToast } from "@/helper/ShowToast";
import GuitarNotesBackground from "@/components/GuitarNotesBackground";
import { Edit2, Trash2, Save, X, User as UserIcon, Mail, FileText } from "lucide-react";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux Data
  const { user, currentUser } = useSelector((state) => state.user);
  const activeUser = user || currentUser;

  // Local State
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  // Sync state
  useEffect(() => {
    if (activeUser) {
      setFormData({
        name: activeUser.name || "",
        bio: activeUser.bio || "",
      });
    } else {
      navigate(RouteIndex);
    }
  }, [activeUser, navigate]);

  if (!activeUser) return null;

  // --- HANDLERS ---
  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      dispatch(setUser(data.user)); 
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      showToast(error.message || "Failed to update", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone and you will lose all data.")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/delete`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete account");
      dispatch(removeUser());
      showToast("Account deleted.", "info");
      navigate(RouteIndex);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
      if (response.ok) {
        dispatch(removeUser());
        showToast("Logged out successfully", "success");
        navigate(RouteIndex);
      }
    } catch (error) {
      showToast("Can't logout", "error");
    }
  };

  return (
    // ✅ FIX: Added `pt-20 sm:pt-24` to push content below the fixed navbar
    <div className="relative min-h-screen bg-slate-50/50 flex flex-col items-center justify-start font-sans pt-20 sm:pt-24 md:pt-32 pb-10">
      
      {/* Background Pattern */}
      <GuitarNotesBackground />

      <div className="z-10 w-full max-w-[95%] sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 animate-fade-in-up">
        
        {/* Header Text */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-pink-500">Profile</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Manage your identity</p>
        </div>

        {/* Profile Card */}
        <Card className="w-full bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] border border-slate-100 rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden mb-6">
          
          {/* Edit / Save Actions */}
          <div className="flex justify-end p-4 sm:p-5 md:p-6 pb-0">
             {isEditing ? (
                <div className="flex gap-1.5 sm:gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({ name: activeUser.name, bio: activeUser.bio });
                      }} 
                      disabled={loading} 
                      className="h-7 sm:h-8 text-[10px] sm:text-xs text-slate-500 px-2 sm:px-3"
                    >
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1"/> 
                        <span className="hidden xs:inline">Cancel</span>
                        <span className="xs:hidden">✕</span>
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleUpdateProfile} 
                      disabled={loading} 
                      className="h-7 sm:h-8 text-[10px] sm:text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg px-2 sm:px-3"
                    >
                        <Save className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1"/> 
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
             ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="flex items-center text-[10px] sm:text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider"
                >
                    <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5"/> 
                    <span className="hidden xs:inline">Edit Profile</span>
                    <span className="xs:hidden">Edit</span>
                </button>
             )}
          </div>

          <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-7 md:pb-8 flex flex-col items-center">
            
            {/* Avatar Circle */}
            <div className="mb-4 sm:mb-5 md:mb-6 relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-pink-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-white to-slate-50 border-2 sm:border-3 md:border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {activeUser?.avatar && !activeUser.avatar.includes("default") ? (
                  <img src={activeUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                    {activeUser?.name?.[0]?.toUpperCase() || "A"}
                  </span>
                )}
              </div>
            </div>

            {/* Info Fields */}
            <div className="w-full space-y-4 sm:space-y-5 md:space-y-6">
              
              {/* Full Name */}
              <div className="text-left group">
                <label className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1 sm:mb-1.5 group-hover:text-blue-500 transition-colors">
                  <UserIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Full Name
                </label>
                {isEditing ? (
                   <input
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full text-base sm:text-lg font-bold text-slate-900 border-b-2 border-blue-500 bg-blue-50/50 px-2 py-1 rounded-t focus:outline-none"
                   />
                ) : (
                   <div className="text-base sm:text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 break-words">
                     {activeUser?.name || "Aaroh User"}
                   </div>
                )}
              </div>

              {/* Bio */}
              <div className="text-left group">
                <label className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1 sm:mb-1.5 group-hover:text-purple-500 transition-colors">
                  <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Bio
                </label>
                {isEditing ? (
                   <textarea
                     rows={2}
                     value={formData.bio}
                     onChange={(e) => setFormData({...formData, bio: e.target.value})}
                     placeholder="Tell us about yourself..."
                     className="w-full text-xs sm:text-sm font-medium text-slate-700 border-b-2 border-purple-500 bg-purple-50/50 px-2 py-1 rounded-t focus:outline-none resize-none"
                   />
                ) : (
                   <div className="text-xs sm:text-sm font-medium text-slate-600 border-b border-slate-100 pb-2 italic min-h-[1.5em] break-words">
                     {activeUser?.bio || "No bio added yet."}
                   </div>
                )}
              </div>

              {/* Email */}
              <div className="text-left group opacity-80">
                <label className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1 sm:mb-1.5 group-hover:text-pink-500 transition-colors">
                  <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Email Address
                </label>
                <div className="text-sm sm:text-base md:text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 break-all">
                  {activeUser?.email}
                </div>
              </div>

            </div>

            {/* Logout */}
            {!isEditing && (
                <div className="mt-6 sm:mt-8 md:mt-10 w-full">
                <Button
                    onClick={handleLogout}
                    className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                    Logout
                </Button>
                </div>
            )}

          </div>
        </Card>

        {/* Danger Zone */}
        <div className="w-full bg-red-50/80 border border-red-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 backdrop-blur-sm mb-8">
            <h3 className="text-red-900 font-bold text-xs sm:text-sm mb-2 sm:mb-1">Waring</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <p className="text-red-600/70 text-[11px] sm:text-xs leading-relaxed max-w-full sm:max-w-[200px] md:max-w-[250px]">
                    Permanently delete your account and all data. This cannot be undone.
                </p>
                <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-colors w-full sm:w-auto justify-center whitespace-nowrap"
                >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Delete Account
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;