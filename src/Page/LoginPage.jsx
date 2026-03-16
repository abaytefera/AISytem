import LoginCard from "../Component/LoginCard";
import LoginVisual from "../Component/LoginVisual";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react"; 
import { ToastContainer, toast } from "react-toastify";
import { Sun, Moon } from "lucide-react"; 
import "react-toastify/dist/ReactToastify.css";
// IMPORT FIX: Move to the top of the file
import { ToggleDarkMode } from "../Redux/WebState"; 

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pulling from Redux
  const { isAuthenticate, isloading, error ,user} = useSelector((state) => state.auth);
  const { DarkMode } = useSelector((state) => state.webState);

  const toastId = useRef(null);

  useEffect(() => {
    // 1. Handle START of Loading
    if (isloading) {
      if (!toastId.current || !toast.isActive(toastId.current)) {
        toastId.current = toast.loading("Authenticating...", { 
          theme: DarkMode ? "dark" : "light",
          position: "top-right" 
        });
      }
    }

    // 2. Handle SUCCESS 
    if (!isloading && isAuthenticate) {
      if (toastId.current) {
       
        toast.update(toastId.current, {
          render: "Welcome back! Redirecting...",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          theme: DarkMode ? "dark" : "light",
        });
      }
      console.log(user)
       
      const timer = setTimeout(() => navigate("/wwsssssssssssdkakkaksdnsndjsd"), 2000);
      return () => clearTimeout(timer);
    }

    // 3. Handle ERROR
    if (!isloading && error) {
      if (toastId.current) {
        toast.update(toastId.current, {
          render: error,
          type: "error",
          isLoading: false,
          autoClose: 3000,
          theme: DarkMode ? "dark" : "light",
        });
      } else {
        toast.error(error, { theme: DarkMode ? "dark" : "light", autoClose: 3000 });
      }
    }

    // Cleanup on Unmount
    return () => {
      if (toastId.current) toast.dismiss(toastId.current);
    };
  }, [isAuthenticate, isloading, error, navigate, DarkMode]);

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen px-4 py-12 transition-colors duration-500 ${DarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => dispatch(ToggleDarkMode())} 
        aria-label="Toggle Theme"
        className={`fixed top-4 right-4 sm:top-8 sm:right-8 z-50 p-3 rounded-full transition-all hover:scale-110 active:scale-95 border backdrop-blur-xl shadow-xl ${
          DarkMode 
          ? 'bg-white/10 border-white/20 hover:bg-white/20' 
          : 'bg-black/5 border-black/10 hover:bg-black/10'
        }`}
      >
        {DarkMode ? (
          <Sun className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Moon className="text-slate-700 w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* SYNC TOAST THEME: Added theme prop to ToastContainer */}
      <ToastContainer theme={DarkMode ? "dark" : "light"} />
      
      <div className={`flex flex-col lg:flex-row w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg transition-all duration-500 ${
        DarkMode 
        ? 'bg-black/40' 
        : 'bg-white/70 border border-white/40'
      }`}>
        <LoginVisual />
        <LoginCard isloading={isloading} darkMode={DarkMode} />
      </div>
    </div>
  );
}