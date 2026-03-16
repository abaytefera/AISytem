import React from 'react';
import { useSelector } from 'react-redux'; // Added this

export default function LoginVisual() {
  // Pulling state directly from Redux as requested
  const { DarkMode } = useSelector((state) => state.webState);

  return (
    <div className={`hidden md:flex w-1/2 items-center justify-center transition-all duration-500 p-10 ${
      DarkMode 
        ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-100'
    }`}>
      
      <div className="relative group">
        {/* Subtle glow effect behind the image */}
        <div className={`absolute inset-0 blur-3xl rounded-full transition-opacity duration-500 ${
          DarkMode ? 'bg-cyan-500/20 opacity-50' : 'bg-blue-400/30 opacity-40'
        }`} />
        
        <img
          src="/aiImage.png"
          alt="AI Illustration"
          className={`relative w-full max-w-md object-contain transition-all duration-500 transform group-hover:scale-105 ${
            DarkMode ? 'opacity-90 brightness-100' : 'opacity-100 brightness-110'
          }`}
        />
      </div>
    </div>
  );
}