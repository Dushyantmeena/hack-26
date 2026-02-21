import { RouteSignIn, RouteProfile, RouteIndex, RouteUpload, RouteDashboard } from "@/helper/RouteName"; // Assuming RouteDashboard exists
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/redux/user.slice";
import { showToast } from "@/helper/ShowToast";

// eslint-disable-next-line no-unused-vars
export default function Navbar({ onOpenUpload = () => { } }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    }
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        dispatch(removeUser());
        showToast("Logged out successfully", "success");
        setMobileOpen(false);
        navigate(RouteIndex); // Redirect to home after logout
      }
    } catch (error) {
      dispatch(removeUser());
      showToast("Error", error);
      setMobileOpen(false);
    }
  };

  const handlePlayAlongClick = () => {
    if (isLoggedIn) {
      navigate(RouteUpload);
      setMobileOpen(false);
    } else {
      navigate(RouteSignIn);
      showToast("Please sign in to try the demo", "info");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={RouteIndex} className="flex items-center gap-2 flex-shrink-0">
          <img src="/AarohAI.jpg" alt="Aaroh AI" className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" />
          <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">Aaroh AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          <a href="/#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary pb-2 border-b-2 border-b-transparent hover:border-b-primary transition-all duration-200">
            Features
          </a>
          <a href="/#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary pb-2 border-b-2 border-b-transparent hover:border-b-primary transition-all duration-200">
            How it works
          </a>
          
          {/* Dashboard Link - Only Visible When Logged In */}
          {isLoggedIn && (
            <Link 
              to={RouteDashboard} 
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary pb-2 border-b-2 border-b-transparent hover:border-b-primary transition-all duration-200"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handlePlayAlongClick}
                className="relative overflow-hidden px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span className="relative z-10">Try Play-Along Demo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              <Link
                to={RouteProfile}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                title={`Welcome ${user?.name || "User"}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/30 via-accent/30 to-secondary/30 flex items-center justify-center border border-primary/30">
                  <span className="text-xs font-bold text-primary">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden md:inline">{user?.name || "Profile"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={RouteSignIn} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign in
              </Link>

              <button
                onClick={handlePlayAlongClick}
                className="relative overflow-hidden px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span className="relative z-10">Try Play-Along Demo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="lg:hidden p-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
        className={`fixed top-16 left-0 right-0 z-50 lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 top-16 bg-black/50 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`relative bg-white dark:bg-gray-950 shadow-lg overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen" : "max-h-0"
            }`}
        >
          <div className="px-4 sm:px-6 py-6 space-y-4">
            <a
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              How it works
            </a>

            {/* Mobile Dashboard Link - Only Visible When Logged In */}
            {isLoggedIn && (
              <Link
                to={RouteDashboard}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handlePlayAlongClick}
                    className="w-full px-4 py-3 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    Try Play-Along Demo
                  </button>
                  <Link
                    to={RouteProfile}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    {user?.name || "Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-destructive text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={RouteSignIn}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-primary hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                  >
                    Sign in
                  </Link>

                  <button
                    onClick={handlePlayAlongClick}
                    className="w-full px-4 py-3 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    Try Play-Along Demo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}