import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { LoginUser } from '../Redux/auth';

// Destructure darkMode from props
export default function LoginCard({ isloading, darkMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      
      dispatch(LoginUser({ email, password }));
    }
  };

  return (
    <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 transition-colors duration-500 ${darkMode ? 'bg-transparent' : 'bg-white/30'}`}>
      <div className={`w-full max-w-md p-10 rounded-3xl backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
        darkMode 
          ? 'bg-slate-900/40 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'bg-white/80 border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
      }`}>
        
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold transition-colors ${
            darkMode ? 'bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent' : 'text-slate-800'
          }`}>
            Welcome Back
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'} text-sm mt-2`}>
            Enter your credentials
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div className="relative group">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
              darkMode ? 'text-gray-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'
            }`} />
            <input
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email Address"
              className={`w-full pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 transition-all ${
                darkMode 
                  ? 'bg-slate-800/50 text-white border-slate-700 focus:ring-cyan-400/50 focus:border-cyan-400 placeholder:text-gray-500' 
                  : 'bg-slate-100 text-slate-900 border-slate-200 focus:ring-cyan-600/20 focus:border-cyan-600 placeholder:text-slate-400'
              }`}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
              darkMode ? 'text-gray-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-cyan-600'
            }`} />
            <input
              type={showPassword ? "text" : "password"}
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full pl-11 pr-12 py-3.5 rounded-xl outline-none focus:ring-2 transition-all ${
                darkMode 
                  ? 'bg-slate-800/50 text-white border-slate-700 focus:ring-cyan-400/50 focus:border-cyan-400 placeholder:text-gray-500' 
                  : 'bg-slate-100 text-slate-900 border-slate-200 focus:ring-cyan-600/20 focus:border-cyan-600 placeholder:text-slate-400'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${
                darkMode ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
           
            className={`w-full mt-2 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
              ${isloading 
                ? "bg-slate-700 text-slate-400 " 
                : darkMode
                  ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-[0.98]"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg active:scale-[0.98]"
              }`}
          >
            {isloading  ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}