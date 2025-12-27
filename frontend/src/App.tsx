import { useState, useEffect } from 'react';
import ImageOCR from './components/ImageOCR';
import AudioToText from './components/AudioToText';
import { FileText, Sparkles, Sun, Moon, Zap } from 'lucide-react'; 

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    // Theme setter
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';
  
  return (
    // Base theme
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-900'}`}>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-lime-200 dark:bg-lime-900 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-3 rounded-2xl shadow-xl">
              <FileText className="text-white" size={40} />
            </div>
            {/* Title */}
            <h1 className="text-5xl font-extrabold text-black dark:text-gray-100">
              IntelliScan
            </h1>
            <Sparkles className="text-yellow-500" size={32} />
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-colors duration-300 ${isDark ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
        
        {/* Sub-header text */}
        <div className="text-center -mt-10 mb-8">
            <p className="text-xl font-medium text-gray-900 dark:text-gray-300">
                AI-Powered Text & Media Analyzer
            </p>
            <p className="text-md mt-2 text-gray-800 dark:text-gray-500">
                Full-Stack Application Built with Python Flask and React/TypeScript.
            </p>
        </div>
        
        {/* What We Do Button */}
        <div className="text-center mb-12">
            <button 
                onClick={() => setShowFlow(!showFlow)}
                className="bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center mx-auto gap-2"
            >
                <Zap size={20} />
                {showFlow ? 'Hide Working Flow' : 'What We Do'}
            </button>
        </div>

        {/* Flow Summary Section */}
        {showFlow && (
            <div className="max-w-4xl mx-auto mb-12 transition-opacity duration-500">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-300 dark:border-gray-700">
                    <p className="text-lg text-gray-900 dark:text-gray-300 leading-relaxed text-center">
                        IntelliScan delivers a highly efficient, decoupled architecture for advanced media processing. Our platform is built on a high-performance React frontend and a scalable Python Flask API backend, specifically engineered for core services like image audio and video.
                    </p>
                </div>
            </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <ImageOCR />
          <AudioToText />
        </div>

        
        {/* FINAL FOOTER */}
        <div className="mt-20 text-center">
          <div className="py-4 border-t border-gray-300 dark:border-gray-700">
            <p className="text-md font-semibold text-gray-900 dark:text-gray-400">
              IntelliScan OCR @2025
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* Blob animation styles */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default App;