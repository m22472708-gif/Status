import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from './components/Header';
import StatusCard from './components/StatusCard';
import AIGeneratorPage from './components/AIGeneratorPage';
import ImageEditorPage from './components/ImageEditorPage';
import Footer from './components/Footer';
import { INITIAL_STATUSES } from './data';
import { Category, Status } from './types';
import { Sparkles, Search, Layers, Palette, LayoutGrid } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: Category[] = ['সব', '❤️ ভালোবাসা', '💔 কষ্ট', '✨ অনুপ্রেরণা', '😎 অ্যাটিটিউড', '🤝 বন্ধুত্ব', '😂 মজার', '🕌 ইসলামিক', '🌱 জীবন'];

export default function App() {
  const [statuses, setStatuses] = useState<Status[]>(INITIAL_STATUSES);
  const [activeCategory, setActiveCategory] = useState<Category>('সব');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [currentView, setCurrentView] = useState<'home' | 'editor' | 'ai'>('home');
  const [selectedStatusForImage, setSelectedStatusForImage] = useState<Status | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const statusGridRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const scrollToSearch = () => {
    if (searchInputRef.current) {
      const offset = 120;
      const elementPosition = searchInputRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Focus the input after scrolling starts
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 500);
    }
  };

  const scrollToContent = () => {
    if (statusGridRef.current) {
      const offset = 180; // Account for sticky header + sticky category bar
      const elementPosition = statusGridRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Only scroll if we are not on the first render and not on the first page initially
    // But actually, the user wants it whenever they click next/prev/page number.
    // So we can just check if currentPage > 1 or if it changed.
    if (currentPage > 1) {
      // scrollToContent(); // This might trigger on category change too which is good
    }
  }, [currentPage]);

  const categoryColors: Record<string, string> = {
    'সব': 'from-slate-600 to-slate-700',
    '❤️ ভালোবাসা': 'from-rose-500 to-pink-600',
    '💔 কষ্ট': 'from-blue-600 to-indigo-700',
    '✨ অনুপ্রেরণা': 'from-emerald-500 to-teal-600',
    '😎 অ্যাটিটিউড': 'from-amber-500 to-orange-600',
    '🤝 বন্ধুত্ব': 'from-purple-500 to-indigo-600',
    '😂 মজার': 'from-yellow-400 to-amber-500',
    '🕌 ইসলামিক': 'from-cyan-500 to-blue-600',
    '🌱 জীবন': 'from-green-500 to-emerald-600',
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'সব': statuses.length
    };
    CATEGORIES.forEach(cat => {
      if (cat !== 'সব') {
        counts[cat] = statuses.filter(s => s.category === cat).length;
      }
    });
    return counts;
  }, [statuses]);

  const filteredStatuses = useMemo(() => {
    return statuses.filter(s => {
      const matchCategory = activeCategory === 'সব' || s.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = s.text.toLowerCase().includes(searchLower) || 
                          s.id.toLowerCase().includes(searchLower) ||
                          s.category.toLowerCase().includes(searchLower);
      return matchCategory && matchSearch;
    });
  }, [statuses, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredStatuses.length / itemsPerPage);
  const currentStatuses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStatuses.slice(start, start + itemsPerPage);
  }, [filteredStatuses, currentPage]);

  const handleSetSearchQuery = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleAiGenerateSuccess = (newCaptions: string[], category: Category) => {
    // AI generated captions are no longer added to the home page list to keep it clean
    // The user can still copy them or use them from the AI page
  };

  const openImageEditor = (status: Status | null) => {
    setSelectedStatusForImage(status);
    setCurrentView('editor');
  };

  if (currentView === 'ai') {
    const handleGoHome = () => {
      setCurrentView('home');
      setActiveCategory('সব');
      setCurrentPage(1);
      setSearchQuery('');
    };

    const handleAiDesign = (text: string, category: Category) => {
      const mockStatus: Status = {
        id: 'ai-' + Date.now(),
        text,
        category
      };
      openImageEditor(mockStatus);
    };

    return (
      <AIGeneratorPage 
        onBack={() => setCurrentView('home')} 
        onGoHome={handleGoHome}
        onDesign={handleAiDesign}
        onGenerateSuccess={handleAiGenerateSuccess}
      />
    );
  }

  if (currentView === 'editor') {
    const handleGoHome = () => {
      setCurrentView('home');
      setActiveCategory('সব');
      setCurrentPage(1);
      setSearchQuery('');
    };

    return (
      <ImageEditorPage 
        initialStatus={selectedStatusForImage} 
        onBack={() => setCurrentView('home')} 
        onGoHome={handleGoHome}
        onOpenAiModal={() => setCurrentView('ai')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-mesh-dark relative font-bangla">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          onOpenSearch={scrollToSearch} 
          onGoHome={() => {
            setCurrentView('home');
            setActiveCategory('সব');
            setCurrentPage(1);
            setSearchQuery('');
          }}
        />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          
          {/* Hero Section */}
          <div className="relative mb-16 sm:mb-24 flex flex-col items-center text-center px-4 pt-12 sm:pt-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-cyan-500/20 rounded-full blur-[80px] sm:blur-[120px] mix-blend-screen pointer-events-none" />
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              <Layers size={14} />
              <span className="font-display">Shabdanjali Hub</span>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bangla font-black text-white mb-6 tracking-tighter leading-[1.2] sm:leading-[1.1] drop-shadow-2xl"
            >
              আপনার অনুভূতিগুলো হোক
              <span className="relative inline-block mx-2 sm:mx-4 mt-2 sm:mt-0">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 font-extrabold pr-2">আরও জীবন্ত</span>
                <span className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full opacity-50 blur-sm"></span>
                <span className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-full"></span>
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 text-slate-300 text-base sm:text-xl lg:text-2xl font-bangla max-w-3xl leading-relaxed font-light mx-4 mb-12"
            >
              ৫০০০+ সাজানো স্ট্যাটাস আর এআই ক্যাপশন জেনারেটরের জাদুতে আপনার মনের কথাগুলো প্রকাশ পাক <strong className="font-semibold text-white">সুন্দরতম রূপে</strong>।
            </motion.p>

            {/* Live Search Bar */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative z-10 w-full max-w-2xl px-4"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
                <div className="relative flex items-center bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-indigo-500/50 rounded-3xl p-1.5 sm:p-2 backdrop-blur-2xl transition-all shadow-2xl">
                  <div className="pl-4 sm:pl-6 pr-4 flex items-center text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    <Search size={22} className="sm:w-6 sm:h-6" />
                  </div>
                  <input 
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSetSearchQuery(e.target.value)}
                    placeholder="পছন্দের কথাগুলো এখানে খুঁজুন..."
                    className="flex-1 bg-transparent border-none outline-none text-white text-base sm:text-xl font-bangla placeholder:text-slate-500 py-3 sm:py-4"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => handleSetSearchQuery('')}
                      className="p-3 text-slate-400 hover:text-white transition-colors"
                    >
                      <LayoutGrid size={18} className="rotate-45" />
                    </button>
                  )}
                </div>

                {/* Live Search Quick Results Dropdown */}
                <AnimatePresence>
                  {searchQuery.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-[100] max-h-[60vh] overflow-y-auto custom-scrollbar"
                    >
                      <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                          <Search size={14} />
                          সার্চ রেজাল্ট ({filteredStatuses.length})
                        </h3>
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            scrollToContent();
                          }}
                          className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="p-2">
                        {filteredStatuses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredStatuses.slice(0, 10).map((status) => (
                              <button
                                key={status.id}
                                onClick={() => {
                                  setSelectedStatusForImage(status);
                                  setCurrentView('editor');
                                }}
                                className="group w-full text-left p-4 rounded-2xl hover:bg-white/5 transition-all flex items-start gap-4 border border-transparent hover:border-white/5"
                              >
                                <div className={cn(
                                  "w-10 h-10 rounded-xl bg-gradient-to-tr flex-shrink-0 flex items-center justify-center text-white font-bold opacity-80 group-hover:opacity-100 transition-opacity",
                                  categoryColors[status.category] || "from-slate-600 to-slate-700"
                                )}>
                                  {status.category.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-slate-200 text-sm font-bangla line-clamp-2 leading-relaxed">{status.text}</p>
                                  <span className="text-[10px] text-slate-500 uppercase mt-1 inline-block">{status.category}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-20 text-center">
                            <Layers className="mx-auto text-slate-700 mb-4" size={48} />
                            <p className="text-slate-400 font-bangla">দুঃখিত, কোনো স্ট্যাটাস পাওয়া যায়নি!</p>
                          </div>
                        )}
                      </div>
                      
                      {filteredStatuses.length > 10 && (
                        <button 
                          onClick={scrollToContent}
                          className="w-full py-4 bg-white/5 text-indigo-400 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors border-t border-white/5"
                        >
                          আরও {filteredStatuses.length - 10}টি দেখতে নিচে যান
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Filters & Search - Modern */}
          <div className="flex flex-col gap-6 items-center justify-center mb-8 sm:mb-12 sticky top-[70px] sm:top-[80px] z-40 bg-slate-950/90 backdrop-blur-3xl py-4 sm:py-6 -mt-2 sm:-mt-5 border-b border-white/5 mx-[-16px] px-4 sm:mx-0 sm:px-0">
            
            <div className="flex gap-2 sm:gap-3 overflow-x-auto w-full pb-2 lg:pb-0 custom-scrollbar items-center justify-start lg:justify-center max-w-full mask-edges px-4 lg:px-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                    setTimeout(scrollToContent, 10);
                  }}
                  className={cn(
                    "px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm whitespace-nowrap transition-all font-bangla font-medium outline-none flex-shrink-0 tracking-wide border relative overflow-hidden group",
                    activeCategory === cat 
                      ? "text-white border-transparent scale-105"
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200"
                  )}
                >
                  {activeCategory === cat && (
                    <motion.div 
                      layoutId="activeCategory"
                      className={cn("absolute inset-0 bg-gradient-to-tr opacity-100", categoryColors[cat] || 'from-indigo-600 to-purple-600')}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{cat}</span>
                    <span className={cn(
                      "text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors",
                      activeCategory === cat 
                        ? "bg-white/20 text-white" 
                        : "bg-white/10 text-slate-500 group-hover:text-slate-300"
                    )}>
                      {categoryCounts[cat] || 0}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout - No container animation (requested) */}
          <div ref={statusGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-h-[400px]">
            {currentStatuses.length > 0 ? (
              currentStatuses.map((status, index) => (
                <StatusCard 
                  key={status.id}
                  index={index}
                  status={status} 
                  onOpenImageEditor={openImageEditor}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center flex flex-col items-center glass-card rounded-[2.5rem] p-8 mt-4"
              >
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-full border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 backdrop-blur-xl">
                    <Search size={32} />
                  </div>
                  <h3 className="text-2xl font-bangla text-white mb-4 tracking-tight font-semibold drop-shadow-md">কোনো স্ট্যাটাস পাওয়া যায়নি</h3>
                  <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">আপনার খোঁজা বিষয়টি আমাদের বর্তমান সংগ্রহে নেই। এআই দিয়ে নতুন কিছু জেনারেট করে দেখতে পারেন।</p>
                  <button 
                    onClick={() => setCurrentView('ai')}
                    className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-full font-bold flex items-center gap-2 transition-all text-xs tracking-widest uppercase font-display"
                  >
                    <Sparkles size={16} className="text-indigo-400" />
                    Create with AI
                  </button>
                </motion.div>
              )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button 
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  setTimeout(scrollToContent, 10);
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-bold uppercase tracking-widest font-display"
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, i, arr) => {
                  const items = [];
                  if (i > 0 && p - arr[i - 1] > 1) {
                    items.push(<span key={`sep-${p}`} className="text-slate-600 px-1">...</span>);
                  }
                  items.push(
                    <button
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        setTimeout(scrollToContent, 10);
                      }}
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border transition-all text-sm font-bold",
                        currentPage === p 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      )}
                    >
                      {p}
                    </button>
                  );
                  return items;
                })}

              <button 
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  setTimeout(scrollToContent, 10);
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-bold uppercase tracking-widest font-display"
              >
                Next
              </button>
            </div>
          )}

        </main>

        <Footer />

        {/* Floating Action Buttons */}
        <div className="flex fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50 flex-col gap-4">
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openImageEditor(null)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.3)] group relative cursor-pointer"
          >
            <div className="absolute right-full mr-4 bg-slate-900 border border-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-display uppercase tracking-widest">
              Design Studio
            </div>
            <Palette size={20} className="text-indigo-400 group-hover:text-indigo-300 transition-colors sm:w-[22px] sm:h-[22px]" />
          </motion.button>
          
          <motion.button 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentView('ai')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] group relative border border-white/20 cursor-pointer"
          >
            <div className="absolute right-full mr-4 bg-slate-900 border border-indigo-500/30 backdrop-blur-md text-indigo-100 text-[10px] sm:text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-display uppercase tracking-widest">
              AI Generator
            </div>
            <Sparkles size={22} className="text-white sm:w-[24px] sm:h-[24px]" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
