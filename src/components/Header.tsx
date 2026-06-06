import React from 'react';
import { Sparkles, PenBox, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onOpenSearch: () => void;
  onGoHome: () => void;
}

export default function Header({ onOpenSearch, onGoHome }: Props) {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
    >
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Side: Logo & Name */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 sm:gap-4 group cursor-pointer border-none bg-transparent outline-none p-0 m-0 text-left"
        >
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 rounded-full group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-white shadow-xl shadow-indigo-500/20 border border-white/10 group-hover:scale-105 transition-transform duration-300">
              <PenBox size={22} className="group-hover:rotate-12 transition-transform duration-500 sm:w-[24px] sm:h-[24px]" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white font-bangla-stylish tracking-wider leading-none">
              শব্দাঞ্জলি
            </h1>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-display font-bold text-indigo-400/60 mt-1 hidden sm:inline-block">
              Shabdanjali
            </span>
          </div>
        </button>
        
        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">Live Collection</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group"
          >
            <Search size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <span className="hidden sm:inline-block text-xs font-display font-semibold text-slate-400 group-hover:text-white tracking-wide">সার্চ করুন</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
