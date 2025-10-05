'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
} from 'framer-motion';

// Loader Component
const PageLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowLoader(false);
            onComplete();
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center"
          exit={{ 
            clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
            transition: { duration: 1, ease: "easeInOut" }
          }}
        >
          {/* Progress Bar */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-64 h-1 bg-gray-200 relative"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-black origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          </motion.div>

          {/* Progress Counter */}
          <motion.div
            className="absolute bottom-10 left-10 text-2xl font-bold text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {progress}%
          </motion.div>

          {/* L Shape Animation */}
          {progress === 100 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="w-32 h-32 border-l-4 border-b-4 border-black" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Floating Background Cards Component
const FloatingCards: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent) => {
    mouseX.set(event.clientX - window.innerWidth / 2);
    mouseY.set(event.clientY - window.innerHeight / 2);
  };

  const cards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {cards.map((i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const x = useTransform(mouseX, [-300, 300], [-20 + i * 5, 20 - i * 5]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(mouseY, [-300, 300], [-10 + i * 3, 10 - i * 3]);

        return (
          <motion.div
            key={i}
            className="absolute w-64 h-40 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
            style={{
              x,
              y,
              left: `${10 + (i % 3) * 30}%`, // Changed from 20% to 10% to center better
              top: `${15 + Math.floor(i / 3) * 35}%`, // Adjusted spacing
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Mock chart elements */}
            <div className="p-4 h-full">
              <div className="w-full h-2 bg-blue-400/20 rounded mb-2" />
              <div className="w-3/4 h-2 bg-purple-400/20 rounded mb-2" />
              <div className="w-1/2 h-2 bg-pink-400/20 rounded" />
              <div className="mt-4 flex space-x-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="w-6 h-8 bg-blue-400/30 rounded" />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Interactive Word Component with Hover Tooltips
const InteractiveWord: React.FC<{
  word: string;
  index: number;
  isInteractive: boolean;
}> = ({ word, index, isInteractive }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Dynamic positioning based on word index to prevent overflow
  const getTooltipPositioning = () => {
    // "reports" (index 1) - left side, use left-0
    // "forecasts" (index 2) - left-center, use left-1/2 -translate-x-1/2  
    // "dashboards" (index 3) - right-center, use left-1/2 -translate-x-1/2
    // "consolidations" (index 5) - right side, use right-0
    
    switch (index) {
      case 1: // "reports," - leftmost
        return "left-0";
      case 5: // "consolidations" - rightmost  
        return "left-0";
      default: // "forecasts," and "dashboards" - center
        return "right-0 transform -translate-x-1/2";
    }
  };

  const getTooltipContent = (word: string) => {
    switch (word.toLowerCase().replace(/[,&]/g, '')) {
      case 'reports':
        return {
          title: 'Advanced Reports',
          description: 'Real-time analytics with custom dashboards',
          visual: (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg p-2 sm:p-3 lg:p-4 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-600/30">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-300 font-medium">Analytics Dashboard</span>
                </div>
                <div className="text-xs text-green-400 font-semibold">95.2%</div>
              </div>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-2 sm:mb-3">
                {[
                  { value: '2.4K', label: 'Users', color: 'bg-blue-500' },
                  { value: '$142K', label: 'Revenue', color: 'bg-green-500' },
                  { value: '8.7%', label: 'Growth', color: 'bg-purple-500' }
                ].map((kpi, i) => (
                  <div key={i} className="bg-slate-700/60 rounded p-1 sm:p-2 border border-slate-600/30">
                    <div className={`w-0.5 h-3 sm:w-1 sm:h-4 lg:h-6 ${kpi.color} rounded-full mb-1`} />
                    <div className="text-xs text-white font-bold truncate">{kpi.value}</div>
                    <div className="text-xs text-slate-400 truncate">{kpi.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Chart */}
              <div className="relative h-8 sm:h-10 lg:h-12 bg-slate-800 rounded border border-slate-600/30 p-1 sm:p-2">
                <div className="flex items-end justify-between h-full space-x-0.5 sm:space-x-1">
                  {[65, 78, 52, 84, 72, 91, 68, 85].map((height, i) => (
                    <motion.div 
                      key={i}
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm flex-1"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  ))}
                </div>
                <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 text-xs text-slate-400">Real-time</div>
              </div>
            </div>
          )
        };
      case 'forecasts':
        return {
          title: 'Predictive Forecasts',
          description: 'AI-powered predictions and trend analysis',
          visual: (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg p-2 sm:p-3 lg:p-4 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-600/30">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-300 font-medium">Forecast Engine</span>
                </div>
                <div className="text-xs text-green-400 font-semibold">↗ +12.5%</div>
              </div>
              
              {/* Prediction Cards */}
              <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
                <div className="bg-slate-700/60 rounded p-1.5 sm:p-2 border border-slate-600/30">
                  <div className="text-xs text-slate-400 mb-1">Next Quarter</div>
                  <div className="text-xs sm:text-sm text-white font-bold">$186K</div>
                  <div className="w-full h-1 bg-slate-600 rounded mt-1">
                    <motion.div 
                      className="h-full bg-green-400 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
                <div className="bg-slate-700/60 rounded p-1.5 sm:p-2 border border-slate-600/30">
                  <div className="text-xs text-slate-400 mb-1">Confidence</div>
                  <div className="text-xs sm:text-sm text-white font-bold">94.2%</div>
                  <div className="flex space-x-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`w-1.5 h-1 sm:w-2 rounded ${i < 4 ? 'bg-green-400' : 'bg-slate-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Trend Line */}
              <div className="relative h-8 sm:h-10 lg:h-12 bg-slate-800 rounded border border-slate-600/30 p-1 sm:p-2">
                <svg className="w-full h-full" viewBox="0 0 100 32">
                  <motion.path 
                    d="M 2,28 Q 15,20 25,22 Q 35,18 45,16 Q 55,14 65,12 Q 75,10 85,8 Q 95,6 98,4"
                    stroke="#10B981" 
                    strokeWidth="2" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.3"/>
                    </linearGradient>
                  </defs>
                  <motion.path 
                    d="M 2,28 Q 15,20 25,22 Q 35,18 45,16 Q 55,14 65,12 Q 75,10 85,8 Q 95,6 98,4 L 98,32 L 2,32 Z"
                    fill="url(#forecastGradient)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                  />
                </svg>
                <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 text-xs text-slate-400">AI Predicted</div>
              </div>
            </div>
          )
        };
      case 'dashboards':
        return {
          title: 'Interactive Dashboards',
          description: 'Real-time monitoring and control panels',
          visual: (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg p-2 sm:p-3 lg:p-4 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-600/30">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-300 font-medium">Live Dashboard</span>
                </div>
                <div className="flex space-x-0.5 sm:space-x-1">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full" />
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-400 rounded-full" />
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-400 rounded-full" />
                </div>
              </div>
              
              {/* Widget Grid */}
              <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
                {/* Gauge Widget */}
                <div className="bg-slate-700/60 rounded p-1.5 sm:p-2 border border-slate-600/30">
                  <div className="text-xs text-slate-400 mb-1 sm:mb-2">CPU Usage</div>
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="12" stroke="#475569" strokeWidth="4" fill="none" />
                      <motion.circle 
                        cx="16" cy="16" r="12" 
                        stroke="#8B5CF6" strokeWidth="4" fill="none"
                        strokeDasharray={`${75.4 * 0.72} 75.4`}
                        initial={{ strokeDasharray: "0 75.4" }}
                        animate={{ strokeDasharray: `${75.4 * 0.72} 75.4` }}
                        transition={{ duration: 0.8 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">72%</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Widget */}
                <div className="bg-slate-700/60 rounded p-1.5 sm:p-2 border border-slate-600/30">
                  <div className="text-xs text-slate-400 mb-1 sm:mb-2">System Status</div>
                  <div className="space-y-0.5 sm:space-y-1">
                    {['API', 'DB', 'Cache'].map((service, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-300">{service}</span>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mini Chart */}
              <div className="bg-slate-800 rounded border border-slate-600/30 p-1 sm:p-2 h-6 sm:h-8 lg:h-10">
                <div className="flex items-end justify-between h-full space-x-0.5 sm:space-x-1">
                  {[45, 62, 38, 71, 54, 83, 67, 76, 59, 88].map((height, i) => (
                    <motion.div 
                      key={i}
                      className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm flex-1"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        };
      case 'consolidations':
        return {
          title: 'Data Consolidations',
          description: 'Unified data integration and processing',
          visual: (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg p-2 sm:p-3 lg:p-4 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-600/30">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-300 font-medium">Data Pipeline</span>
                </div>
                <div className="text-xs text-orange-400 font-semibold">Processing</div>
              </div>
              
              {/* Data Sources */}
              <div className="mb-2 sm:mb-3">
                <div className="text-xs text-slate-400 mb-1 sm:mb-2">Sources</div>
                <div className="flex justify-center space-x-1 sm:space-x-2">
                  {['DB', 'API', 'Files'].map((source, i) => (
                    <motion.div 
                      key={i}
                      className="w-6 h-4 sm:w-8 sm:h-6 bg-slate-700/60 rounded border border-orange-400/50 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <span className="text-xs text-orange-300 font-mono">{source}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Processing Flow */}
              <div className="flex flex-col items-center space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                {/* Flow Lines */}
                <motion.div 
                  className="w-px h-2 sm:h-4 bg-gradient-to-b from-orange-400 to-orange-600"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                
                {/* Consolidation Engine */}
                <motion.div 
                  className="w-12 h-6 sm:w-16 sm:h-8 bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded-lg border border-orange-400/60 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <span className="text-xs text-orange-200 font-bold">ETL</span>
                </motion.div>
                
                <motion.div 
                  className="w-px h-2 sm:h-4 bg-gradient-to-b from-orange-400 to-orange-600"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </div>
              
              {/* Output Grid */}
              <div className="grid grid-cols-4 gap-0.5 sm:gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    className="h-1.5 sm:h-2 bg-gradient-to-r from-red-500/60 to-orange-500/60 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3, delay: 1 + i * 0.05 }}
                  />
                ))}
              </div>
              
              <div className="text-xs text-center text-slate-400 mt-1 sm:mt-2">Unified Data Lake</div>
            </div>
          )
        };
      default:
        return null;
    }
  };

  const tooltipContent = isInteractive ? getTooltipContent(word) : null;

  return (
    <div className="relative inline-block">
      <motion.span
        className={`inline-block mr-2 sm:mr-4 ${
          isInteractive 
            ? 'cursor-pointer hover:text-blue-400 transition-colors duration-300 relative' 
            : ''
        }`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5 + index * 0.1,
          ease: "easeOut",
        }}
        onMouseEnter={() => isInteractive && setIsHovered(true)}
        onMouseLeave={() => isInteractive && setIsHovered(false)}
      >
        {word}
        {isInteractive && (
          <motion.div
            className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.span>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && tooltipContent && (
          <motion.div
            className={`absolute top-full ${getTooltipPositioning()} mt-2 sm:mt-4 z-50 px-2 sm:px-0`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-slate-900/98 backdrop-blur-md border border-slate-600/50 rounded-xl p-3 sm:p-4 lg:p-5 w-64 sm:w-72 lg:w-80 shadow-2xl shadow-black/50 max-w-[calc(100vw-2rem)]">
              <h4 className="text-white font-semibold mb-2 flex items-center text-sm sm:text-base">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
                {tooltipContent.title}
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{tooltipContent.description}</p>
              {tooltipContent.visual}
            </div>
            {/* Enhanced Arrow - adjust position based on tooltip alignment */}
            <div className={`absolute -top-1.5 sm:-top-2 ${
              index === 1 ? 'left-8' : 
              index === 5 ? 'right-8' : 
              'left-1/2 transform -translate-x-1/2'
            } w-3 h-3 sm:w-4 sm:h-4 bg-slate-900/98 border-l border-t border-slate-600/50 rotate-45`} />
            {/* Glow Effect */}
            <div className="absolute inset-0 -z-10 bg-blue-500/10 rounded-xl blur-xl scale-110" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hero Section Component
const HeroSection: React.FC = () => {
  const titleWords = [
    { word: "Create", interactive: false },
    { word: "reports,", interactive: true },
    { word: "forecasts,", interactive: true },
    { word: "dashboards", interactive: true },
    { word: "&", interactive: false },
    { word: "consolidations", interactive: true }
  ];
  
  return (
    <section className="relative min-h-screen bg-gray-950 aurora-gradient flex flex-col">
      <FloatingCards />
      
      {/* Social Proof Banner */}
      <motion.div 
        className="w-full bg-gray-900/50 backdrop-blur-sm py-3 sm:py-4 z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-400">
            <span className="text-xs sm:text-sm">Trusted by leading companies:</span>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <span className="text-sm sm:text-lg font-semibold">Capterra</span>
              <span className="text-sm sm:text-lg font-semibold">G2</span>
              <span className="text-sm sm:text-lg font-semibold">Xero</span>
              <span className="text-sm sm:text-lg font-semibold">QuickBooks</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative w-full z-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex flex-wrap justify-center items-center">
              {titleWords.map((item, index) => (
                <InteractiveWord
                  key={index}
                  word={item.word}
                  index={index}
                  isInteractive={item.interactive}
                />
              ))}
            </div>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-400 mb-8 sm:mb-12 font-semibold px-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Now with AI-insights
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start 14-day free trial
            </motion.button>
            <motion.button
              className="w-full sm:w-auto text-blue-400 hover:text-blue-300 text-base sm:text-lg font-semibold underline transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              See what we do →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Customer Logos Section
const CustomerLogosSection: React.FC = () => {
  const logos = [
    "OpenAI", "Brex", "Runway", "Anthropic", "Vercel", "Linear", "Notion", "Figma",
    "Stripe", "GitHub", "Discord", "Spotify", "Netflix", "Uber", "Airbnb", "Tesla"
  ];

  // Duplicate logos for infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.h2 
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Trusted by industry leaders
        </motion.h2>
      </div>
      
      <motion.div
        className="flex items-center space-x-8 sm:space-x-12 md:space-x-16"
        animate={{ x: [0, -50 * logos.length] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold text-gray-400 hover:text-white transition-colors whitespace-nowrap"
          >
            {logo}
          </div>
        ))}
      </motion.div>
    </section>
  );
};

// Tabbed Features Section
const TabbedFeaturesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    {
      label: "BILLING",
      title: "Real-Time Convergent Billing",
      content: "Instantaneous, accurate billing across all services and product lines with advanced rating engines and flexible pricing models.",
      mockup: "�"
    },
    {
      label: "CHARGING",
      title: "Dynamic Charging Engine",
      content: "Real-time charging capabilities with complex rating scenarios, promotional pricing, and multi-currency support for global operations.",
      mockup: "⚡"
    },
    {
      label: "CATALOG",
      title: "Product & Service Catalog",
      content: "Comprehensive catalog management with hierarchical product structures, bundling capabilities, and automated lifecycle management.",
      mockup: "📋"
    },
    {
      label: "EVENTS",
      title: "Event Management System",
      content: "High-throughput event processing with real-time mediation, data validation, and intelligent routing for seamless operations.",
      mockup: "🎯"
    }
  ];

  // Auto-rotate tabs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [tabs.length]);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Unparalleled BSS/OSS Capabilities
        </motion.h2>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="grid grid-cols-2 sm:flex sm:space-x-2 md:space-x-4 gap-2 sm:gap-0 bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 sm:p-3 w-full sm:w-auto max-w-md sm:max-w-none">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`relative px-3 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
                {activeTab === index && (
                  <motion.div
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                {tabs[activeTab].title}
              </h3>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                {tabs[activeTab].content}
              </p>
            </div>
            
            <motion.div
              className="flex items-center justify-center order-1 lg:order-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full max-w-sm sm:w-80 h-48 sm:h-60 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 flex items-center justify-center text-6xl sm:text-8xl">
                {tabs[activeTab].mockup}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// Parallax Image Section
const ParallaxImageSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900"
        style={{ y }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.h2 
            className="text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Experience the Future
          </motion.h2>
          <motion.p 
            className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Advanced analytics and AI-powered insights that transform your business operations with unprecedented efficiency and accuracy.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; duration?: number }> = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

// Stats & Graph Section
const StatsAndGraphSection: React.FC = () => {
  const statsData = [
    { title: "Revenue Growth", value: 2847, change: "+12.5%", bars: [85, 92, 78, 95, 88] },
    { title: "Active Users", value: 15632, change: "+8.2%", bars: [75, 88, 92, 86, 94] },
    { title: "Conversion Rate", value: 94, change: "+15.3%", bars: [82, 79, 85, 91, 89] }
  ];

  const chartData = [
    { label: "Q1", value: 40 },
    { label: "Q2", value: 65 },
    { label: "Q3", value: 45 },
    { label: "Q4", value: 80 },
    { label: "Q5", value: 55 },
    { label: "Q6", value: 90 }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Stats Part */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Performance Metrics
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-4">{stat.title}</h3>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={stat.value} />
                </div>
                <div className="text-green-600 font-semibold mb-6">{stat.change}</div>
                
                <div className="space-y-2">
                  {stat.bars.map((width, i) => (
                    <motion.div
                      key={i}
                      className="h-2 bg-gray-200 rounded"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${width}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="h-full bg-blue-600 rounded" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chart Part */}
        <div>
          <motion.h3 
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Embodied Carbon Emissions
          </motion.h3>
          
          <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-4">
            <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base">Type</button>
            <button className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm sm:text-base">Status</button>
          </div>
          
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <div className="flex items-end space-x-2 sm:space-x-4 md:space-x-6 h-48 sm:h-64">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <motion.div
                    className="bg-blue-600 w-full rounded-t"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${item.value}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />
                  <div className="mt-2 text-xs sm:text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      text: "Tech Zephyr's BSS platform transformed our billing operations. We've seen 40% reduction in billing cycles and 99.9% accuracy.",
      author: "Michael Rodriguez",
      role: "VP Operations",
      company: "Global Telecom Solutions",
      image: "�‍💼",
      metric: "40% faster billing"
    },
    {
      text: "The real-time convergent billing system handles our complex pricing models seamlessly. Best investment we've made.",
      author: "Sarah Chen",
      role: "CFO",
      company: "MetroNet Communications",
      image: "�‍�",
      metric: "99.9% accuracy"
    },
    {
      text: "Implementation took just 6 weeks. The team's expertise in BSS/OSS is unmatched in the industry.",
      author: "David Thompson",
      role: "CTO",
      company: "Fiber Solutions Inc",
      image: "�‍💻",
      metric: "6-week deployment"
    },
    {
      text: "Revenue assurance improved by 35% within the first quarter. The analytics capabilities are phenomenal.",
      author: "Jennifer Wu",
      role: "Revenue Director",
      company: "NextGen Networks",
      image: "�‍�",
      metric: "35% revenue boost"
    },
    {
      text: "Customer satisfaction scores increased 25% after deploying their self-service portal. Outstanding results.",
      author: "Robert Kim",
      role: "Customer Experience Lead",
      company: "TeleConnect Corp",
      image: "�‍💼",
      metric: "25% satisfaction increase"
    },
    {
      text: "The event processing engine handles millions of transactions daily without any performance issues.",
      author: "Maria Garcia",
      role: "IT Director",
      company: "Digital Communications",
      image: "�‍💼",
      metric: "Million+ daily events"
    }
  ];

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -75]);

  const columns = [
    { testimonials: testimonials.slice(0, 2), y: y1 },
    { testimonials: testimonials.slice(2, 4), y: y2 },
    { testimonials: testimonials.slice(4, 6), y: y3 }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center mb-14 sm:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-xs sm:text-sm uppercase tracking-wider text-blue-400 mb-4">CUSTOMER SUCCESS STORIES</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            See how leading telecommunications companies are transforming their operations with our BSS/OSS solutions
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {columns.map((column, colIndex) => (
            <motion.div key={colIndex} className="space-y-6" style={{ y: column.y }}>
              {column.testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: (colIndex * 0.1) + (index * 0.2) }}
                  viewport={{ once: true }}
                >
                  {/* Metric Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
                    {testimonial.metric}
                  </div>
                  
                  <p className="text-white mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">&ldquo;{testimonial.text}&rdquo;</p>
                  
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="text-xl sm:text-2xl">{testimonial.image}</div>
                    <div>
                      <div className="text-white font-semibold text-sm sm:text-base">{testimonial.author}</div>
                      <div className="text-blue-400 text-xs sm:text-sm font-medium">{testimonial.role}</div>
                      <div className="text-gray-400 text-xs">{testimonial.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">500M+</div>
            <div className="text-gray-400 text-xs sm:text-sm">Events Processed Daily</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">99.99%</div>
            <div className="text-gray-400 text-xs sm:text-sm">System Uptime</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-400 text-xs sm:text-sm">Enterprise Clients</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">6 Weeks</div>
            <div className="text-gray-400 text-xs sm:text-sm">Average Deployment</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Showcase Carousel Section
const ShowcaseCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const solutions = [
    {
      number: "01",
      title: "Convergent Billing Platform",
      subtitle: "Real-Time Rating & Billing",
      tags: ["Real-time", "Multi-service", "Cloud-native"],
      description: "Process millions of transactions with sub-second response times. Support complex rating scenarios across voice, data, SMS, and digital services.",
      features: ["Real-time rating engine", "Multi-currency support", "Flexible pricing models", "Revenue assurance"],
      metrics: "500M+ transactions/day"
    },
    {
      number: "02", 
      title: "Customer Experience Hub",
      subtitle: "Self-Service & Digital Engagement",
      tags: ["Self-service", "Mobile-first", "Omnichannel"],
      description: "Empower customers with comprehensive self-service capabilities and seamless digital experiences across all touchpoints.",
      features: ["Mobile-responsive portal", "Real-time account access", "Payment processing", "Service management"],
      metrics: "95% self-service adoption"
    },
    {
      number: "03",
      title: "Analytics & Intelligence",
      subtitle: "AI-Powered Business Insights",
      tags: ["AI/ML", "Predictive", "Real-time"],
      description: "Transform raw data into actionable insights with advanced analytics, machine learning, and predictive modeling capabilities.",
      features: ["Predictive analytics", "Churn prevention", "Revenue optimization", "Custom dashboards"],
      metrics: "40% improvement in KPIs"
    },
    {
      number: "04",
      title: "Integration Platform",
      subtitle: "Enterprise Connectivity",
      tags: ["API-first", "Microservices", "Scalable"],
      description: "Seamlessly connect with existing systems through our robust API gateway and integration platform built for enterprise scale.",
      features: ["RESTful APIs", "Message queuing", "Data synchronization", "Security protocols"],
      metrics: "99.99% uptime SLA"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % solutions.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [solutions.length]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 h-full">
        {/* Header */}
        <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-xs sm:text-sm uppercase tracking-wider text-blue-400 mb-3 sm:mb-4">OUR SOLUTIONS</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Enterprise-Grade BSS/OSS Solutions
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Comprehensive platforms designed for telecommunications and digital service providers
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Left Content */}
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-400 opacity-80">
                      {solutions[currentSlide].number}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                        {solutions[currentSlide].title}
                      </h3>
                      <p className="text-sm sm:text-lg md:text-xl text-blue-300 font-medium">
                        {solutions[currentSlide].subtitle}
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {solutions[currentSlide].tags.map((tag, index) => (
                      <span key={index} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs sm:text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                  
                  <motion.p 
                    className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed mb-6 sm:mb-8"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {solutions[currentSlide].description}
                  </motion.p>

                  <motion.div
                    className="space-y-2 sm:space-y-3 mb-6 sm:mb-8"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    {solutions[currentSlide].features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-sm sm:text-base font-semibold"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    {solutions[currentSlide].metrics}
                  </motion.div>
                </div>

                {/* Right Visual */}
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 h-60 sm:h-72 lg:h-80">
                      <div className="h-full flex flex-col justify-between">
                        {/* Mock UI Elements */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-16 sm:w-20 lg:w-24 h-2 sm:h-2.5 lg:h-3 bg-blue-400/40 rounded" />
                            <div className="w-10 sm:w-12 lg:w-16 h-2 sm:h-2.5 lg:h-3 bg-green-400/40 rounded" />
                          </div>
                          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="h-8 sm:h-10 lg:h-12 bg-gray-400/20 rounded" />
                            ))}
                          </div>
                        </div>
                        
                        {/* Mock Chart */}
                        <div className="flex items-end space-x-1 sm:space-x-2 h-12 sm:h-16 lg:h-20">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="bg-blue-400/60 rounded-t flex-1"
                              style={{ height: `${Math.random() * 80 + 20}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 bg-blue-500/20 rounded-full blur-xl" />
                    <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 bg-purple-500/20 rounded-full blur-xl" />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {solutions.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 sm:w-12 h-2 sm:h-3 bg-blue-400 rounded-full' 
                    : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/30 rounded-full hover:bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Manual Navigation Arrows */}
        <button
          className="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all text-sm sm:text-base"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + solutions.length) % solutions.length)}
        >
          ←
        </button>
        <button
          className="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all text-sm sm:text-base"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % solutions.length)}
        >
          →
        </button>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Tech Zephyr</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Transforming businesses with AI-powered solutions</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm sm:text-base text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-gray-500 text-xs sm:text-sm">
            © 2024 Tech Zephyr. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Homepage Component
const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen">
      <PageLoader onComplete={() => setIsLoading(false)} />
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection />
            <CustomerLogosSection />
            <TabbedFeaturesSection />
            <ParallaxImageSection />
            <StatsAndGraphSection />
            <TestimonialsSection />
            <ShowcaseCarousel />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;