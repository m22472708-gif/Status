import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Image as ImageIcon, Type, Palette, AlignLeft, AlignCenter, AlignRight, SlidersHorizontal, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { toPng } from 'html-to-image';

const ModernQuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.874 3.874 0 01-2.743-1.12zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.874 3.874 0 01-2.743-1.12z"/>
  </svg>
);

import { FONTS, INITIAL_STATUSES } from '../data';
import { cn } from '../lib/utils';
import { Status } from '../types';
import { motion } from 'motion/react';

interface Props {
  initialStatus: Status | null;
  onBack: () => void;
  onGoHome: () => void;
  onOpenAiModal: () => void;
}

const TEMPLATES = [
  { id: '1', bg: 'bg-[#0f172a]', color: 'text-white', quoteColor: 'text-white/10' }, // slate-900
  { id: '2', bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900', color: 'text-white', quoteColor: 'text-white/10' }, 
  { id: '3', bg: 'bg-gradient-to-tr from-[#1a1a2e] to-[#16213e]', color: 'text-indigo-100', quoteColor: 'text-indigo-500/20' },
  { id: '4', bg: 'bg-gradient-to-br from-rose-900/80 to-slate-900', color: 'text-rose-50', quoteColor: 'text-rose-500/20' },
  { id: '5', bg: 'bg-gradient-to-tr from-emerald-900/80 to-slate-900', color: 'text-emerald-50', quoteColor: 'text-emerald-500/20' },
  { id: '6', bg: 'bg-gradient-to-br from-amber-900/80 to-slate-900', color: 'text-amber-50', quoteColor: 'text-amber-500/20' },
  { id: '7', bg: 'bg-white', color: 'text-slate-900', quoteColor: 'text-slate-200' },
  { id: '8', bg: 'bg-gradient-to-br from-slate-100 to-slate-200', color: 'text-slate-800', quoteColor: 'text-slate-300' },
];

export default function ImageEditorPage({ initialStatus, onBack, onGoHome, onOpenAiModal }: Props) {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(() => {
    if (initialStatus) {
      const idx = INITIAL_STATUSES.findIndex(s => s.id === initialStatus.id);
      return idx >= 0 ? idx : 0;
    }
    return Math.floor(Math.random() * INITIAL_STATUSES.length);
  });
  
  const [text, setText] = useState(() => {
    if (initialStatus) return initialStatus.text;
    return INITIAL_STATUSES[currentStatusIndex].text;
  });
  
  const [templateIdx, setTemplateIdx] = useState(0);
  const [font, setFont] = useState(FONTS.find(f => f.name === 'Hind Siliguri') || FONTS[0]);
  const [fontSize, setFontSize] = useState(32);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState<'default' | 'white' | 'black'>('default');
  const [watermark, setWatermark] = useState('শব্দাঞ্জলি');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  
  const captureRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (initialStatus) {
      setText(initialStatus.text);
      const idx = INITIAL_STATUSES.findIndex(s => s.id === initialStatus.id);
      if (idx >= 0) setCurrentStatusIndex(idx);
    }
  }, [initialStatus]);

  const handleNext = () => {
    const nextIdx = (currentStatusIndex + 1) % INITIAL_STATUSES.length;
    setCurrentStatusIndex(nextIdx);
    setText(INITIAL_STATUSES[nextIdx].text);
  };

  const handlePrev = () => {
    const prevIdx = (currentStatusIndex - 1 + INITIAL_STATUSES.length) % INITIAL_STATUSES.length;
    setCurrentStatusIndex(prevIdx);
    setText(INITIAL_STATUSES[prevIdx].text);
  };

  const currentTemplate = TEMPLATES[templateIdx];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(captureRef.current, { 
        pixelRatio: 3, 
        skipAutoScale: true,
        cacheBust: true,
        backgroundColor: 'rgba(0,0,0,0)'
      });
      const link = document.createElement("a");
      link.download = `shobdanjoli-studio-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to export. Please try again or use a different backdrop.");
    } finally {
      setDownloading(false);
    }
  };

  const getTextColorClass = () => {
    if (textColor === 'white') return 'text-white';
    if (textColor === 'black') return 'text-slate-900';
    return !customImage ? currentTemplate.color : 'text-white';
  };

  const getQuoteColorClass = () => {
    if (textColor === 'white') return 'text-white/10';
    if (textColor === 'black') return 'text-slate-900/5';
    return !customImage ? currentTemplate.quoteColor : 'text-white/20';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-mesh-dark flex flex-col font-bangla"
    >
      {/* Header */}
      <header className="glass-panel border-b-white/5 h-20 flex items-center px-4 sm:px-8 z-20 sticky top-0 justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors font-medium text-xs tracking-widest uppercase font-display group"
        >
          <div className="w-10 h-10 rounded-xl border border-white/10 group-hover:bg-white/10 flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="hidden sm:inline">Go Back</span>
        </button>

        <div className="mx-auto font-display text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-indigo-400" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Studio</span>
        </div>

        <div className="flex items-center">
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 text-xs tracking-widest uppercase font-display"
          >
            <Download size={14} />
            <span className="hidden sm:inline">{downloading ? 'Saving...' : 'Export'}</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden h-[calc(100dvh-80px)]">
        {/* Canvas Area (Top on mobile, Right on Desktop) */}
        <div className="flex-1 lg:flex-1 overflow-y-auto lg:overflow-hidden bg-black/40 p-4 sm:p-8 lg:p-20 flex items-center justify-center relative min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
          
          <div 
            ref={captureRef}
            className={cn(
              "relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] aspect-square shadow-2xl flex flex-col p-6 sm:p-10 lg:p-16 overflow-hidden transition-all duration-300 rounded-2xl lg:rounded-3xl shrink-0",
              !customImage ? currentTemplate.bg : ''
            )}
            style={{
              ...(customImage ? {
                backgroundImage: `url(${customImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : {})
            }}
          >
            {/* Overlay */}
            {customImage && (
              <div 
                className="absolute inset-0 bg-black transition-opacity" 
                style={{ opacity: overlayOpacity / 100 }} 
              />
            )}
            
            {/* Background Quote Mark */}
            <div className={cn(
               "absolute top-6 left-6 sm:top-8 sm:left-8 opacity-60 transition-colors duration-300 pointer-events-none",
               getQuoteColorClass()
            )}>
              <ModernQuoteIcon className="w-[80px] h-[80px] fill-current scale-50 sm:scale-75 lg:scale-100 origin-top-left" />
            </div>

            <div className={cn("relative z-10 flex-1 flex flex-col justify-center w-full", {
              'items-start text-left': textAlign === 'left',
              'items-center text-center': textAlign === 'center',
              'items-end text-right': textAlign === 'right',
            })}>
               <p 
                  className={cn(
                    font.class, 
                    getTextColorClass(),
                    "leading-[1.7] transition-all duration-200 break-words whitespace-pre-wrap mt-4 sm:mt-8 z-10 drop-shadow-md text-sm sm:text-2xl lg:text-3xl"
                  )}
                  style={{ fontSize: window.innerWidth < 640 ? `${Math.max(14, fontSize * 0.6)}px` : `${fontSize}px` }}
               >
                 {text || 'স্ট্যাটাস লিখুন...'}
               </p>
            </div>

            {watermark && (
              <div className={cn(
                "relative z-10 mt-6 sm:mt-10 w-full flex text-[7px] sm:text-[9px] tracking-[0.4em] uppercase opacity-70",
                getTextColorClass(),
                "font-sans font-bold",
                {
                  'justify-start': textAlign === 'left',
                  'justify-center': textAlign === 'center',
                  'justify-end': textAlign === 'right',
                }
              )}>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className={cn("h-[1px] w-6 sm:w-8", textColor === 'white' ? 'bg-white' : textColor === 'black' ? 'bg-slate-900' : !customImage ? `bg-current` : 'bg-white')} />
                  {watermark}
                  <div className={cn("h-[1px] w-6 sm:w-8", textColor === 'white' ? 'bg-white' : textColor === 'black' ? 'bg-slate-900' : !customImage ? `bg-current` : 'bg-white')} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor Sidebar (Bottom on mobile, Left on Desktop) */}
        <div className="w-full lg:w-[420px] bg-white/5 lg:border-r border-t lg:border-t-0 border-white/5 overflow-y-auto custom-scrollbar h-[50vh] lg:h-auto lg:flex-none z-10 flex flex-col backdrop-blur-3xl order-last lg:order-first border-t-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] lg:shadow-none relative">
          <div className="p-6 sm:p-8 space-y-8 sm:space-y-10">
            {/* Text Edit */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] font-display">
                  <Type size={14} /> Canvas Text
                </label>
                <button
                  onClick={onOpenAiModal}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/40 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/30 uppercase tracking-widest"
                >
                  <Sparkles size={12} /> AI Magic
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 sm:p-5 rounded-2xl border border-white/10 focus:ring-2 focus:ring-indigo-500/50 outline-none text-sm sm:text-base font-bangla min-h-[100px] sm:min-h-[140px] resize-none bg-black/20 transition-all text-white shadow-inner"
                placeholder="Type your verses here..."
              />
              <div className="flex items-center gap-2 mt-3">
                 <button onClick={handlePrev} className="flex-1 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 border border-white/5">
                    <ChevronLeft size={14} /> Prev
                 </button>
                 <button onClick={handleNext} className="flex-1 py-2 sm:py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 border border-white/5">
                    Next <ChevronRight size={14} />
                 </button>
              </div>
            </div>

            {/* Templates */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 mb-3 uppercase tracking-[0.2em] font-display">
                <Palette size={14} /> Base Aesthetics
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {TEMPLATES.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => { setTemplateIdx(idx); setCustomImage(null); }}
                    className={cn(
                      "aspect-square rounded-xl border border-white/5 transition-all shadow-sm relative overflow-hidden",
                      t.bg,
                      templateIdx === idx && !customImage ? 'ring-2 ring-indigo-400 scale-[1.05]' : 'hover:scale-[1.02] hover:border-white/20'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 mb-3 uppercase tracking-[0.2em] font-display">
                <ImageIcon size={14} /> Custom Backdrop
              </label>
              <label className="cursor-pointer flex flex-col items-center justify-center w-full py-4 sm:py-6 border border-dashed border-white/20 rounded-2xl hover:bg-white/5 hover:border-indigo-400/50 transition-all text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] bg-black/20 group font-display">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
                  <ImageIcon size={16} />
                </div>
                <span>Upload Layer</span>
              </label>
              
              {customImage && (
                <div className="mt-4 p-4 bg-black/20 rounded-2xl border border-white/10">
                  <label className="flex justify-between text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-[0.2em] font-display">
                    <span>Alpha Depth</span>
                    <span className="text-indigo-300">{overlayOpacity}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="90" value={overlayOpacity} 
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Typography Controls */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 mb-3 uppercase tracking-[0.2em] font-display">
                <Type size={14} /> Typography Matrix
              </label>
              
              <div className="space-y-4 sm:space-y-5 bg-black/20 p-4 sm:p-5 rounded-3xl border border-white/10">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest font-display">Typeface</span>
                  <select 
                    className="w-full p-2.5 sm:p-3.5 rounded-xl border border-white/10 bg-white/5 text-white shadow-sm focus:ring-2 focus:ring-indigo-500/50 outline-none text-xs sm:text-sm cursor-pointer transition-all hover:bg-white/10"
                    value={font.name}
                    onChange={(e) => setFont(FONTS.find(f => f.name === e.target.value) || FONTS[0])}
                  >
                    {FONTS.map(f => <option key={f.name} value={f.name} className="text-slate-900">{f.name}</option>)}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Scale</span>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-md font-display">{fontSize}px</span>
                  </div>
                  <input 
                    type="range" min="20" max="80" value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest font-display">Structure</span>
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                    {[
                      { id: 'left', icon: AlignLeft },
                      { id: 'center', icon: AlignCenter },
                      { id: 'right', icon: AlignRight }
                    ].map(align => (
                      <button
                        key={align.id}
                        onClick={() => setTextAlign(align.id as any)}
                        className={cn(
                          "flex-1 py-1.5 sm:py-2.5 flex justify-center rounded-lg transition-all",
                          textAlign === align.id ? "bg-white/20 text-white border border-white/10" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <align.icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest font-display">Pigment</span>
                  <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                    <button onClick={() => setTextColor('default')} className={cn("flex-1 py-1.5 sm:py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all font-display", textColor === 'default' ? 'bg-white/20 text-white border border-white/10' : 'text-slate-400 hover:text-white')}>Auto</button>
                    <button onClick={() => setTextColor('white')} className={cn("flex-1 py-1.5 sm:py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all font-display", textColor === 'white' ? 'bg-white text-slate-900 border border-white/10' : 'text-slate-400 hover:text-white')}>Light</button>
                    <button onClick={() => setTextColor('black')} className={cn("flex-1 py-1.5 sm:py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all font-display", textColor === 'black' ? 'bg-slate-900 text-white border border-slate-700' : 'text-slate-400 hover:text-white')}>Dark</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark */}
            <div>
              <label className="block text-[10px] font-bold text-indigo-400 mb-3 uppercase tracking-[0.2em] font-display">Signature Tag</label>
              <input 
                type="text" 
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500/50 outline-none text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase bg-black/20 transition-all font-bold text-center text-white shadow-inner"
                placeholder="TAG"
              />
            </div>
            
            <div className="pb-10"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
