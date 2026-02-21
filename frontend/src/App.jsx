import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/user.slice' // Ensure this path matches your project structure

// Route Names
import { 
  RouteSignIn, 
  RouteSignUp, 
  RouteIndex, 
  RouteProfile, 
  RouteOTP 
} from './helper/RouteName'

// Pages
import Signin from './pages/SignIn'
import Signup from './pages/SignUp'
import Home from './pages/Home'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function Layout() {
  const location = useLocation()

  // Logic to determine if layout elements should be hidden
  const hideLayout =
    location.pathname === RouteSignIn ||
    location.pathname === RouteSignUp ||
    location.pathname === RouteUpload ||
    location.pathname === RoutePlayground ||
    location.pathname === RouteResult ||
    location.pathname === RouteOTP 

  return (
    <>
      {/* Conditionally render Navbar */}
      {!hideLayout && <Navbar />}
      
      <Routes>
        <Route path={RouteIndex} element={<Home />} />
        <Route path={RouteSignIn} element={<Signin />} />
        <Route path={RouteSignUp} element={<Signup />} />
        <Route path={RouteOTP} element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route path={RouteUpload} element={<ProtectedRoute element={<UploadSong />} />} />
        <Route path={RoutePlayground} element={<ProtectedRoute element={<Playground />} />} />
        <Route path={RouteDashboard} element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path={RouteProfile} element={<ProtectedRoute element={<Profile />} />} />
        <Route path={RouteResult} element={<ProtectedRoute element={<PerformanceResult />} />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!hideLayout && <Footer />}
    </>
  )
}

function App() {
  const dispatch = useDispatch()

  // ✅ SESSION RESTORE LOGIC
  // This runs once when the app mounts (e.g., on refresh)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/check-auth`, {
          method: "GET",
          credentials: "include", // ✅ Important: Sends the 7-day cookie to backend
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
          console.log("🔄 Session Restored for:", data.user.name);
          dispatch(setUser(data.user)); // Restore user state in Redux
        }
      } catch (error) {
        // If error or 401/404, it just means user isn't logged in. 
        // No action needed, they stay on public pages or get redirected by ProtectedRoute.
        console.log("No active session found.");
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App