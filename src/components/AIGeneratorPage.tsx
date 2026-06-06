import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Loader2, Wand2, Palette } from 'lucide-react';
import { Category, Size, Vibe, Status } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import StatusCard from './StatusCard';

interface Props {
  onBack: () => void;
  onGoHome: () => void;
  onDesign: (text: string, category: Category) => void;
  onGenerateSuccess: (statuses: string[], category: Category) => void;
}

const CATEGORIES: Category[] = ['❤️ ভালোবাসা', '💔 কষ্ট', '✨ অনুপ্রেরণা', '😎 অ্যাটিটিউড', '🤝 বন্ধুত্ব', '😂 মজার', '🕌 ইসলামিক', '🌱 জীবন'];
const VIBES: Vibe[] = ['Romantic', 'Sad', 'Aggressive', 'Peaceful', 'Funny', 'Philosophical'];
const SIZES: Size[] = ['small', 'medium', 'long'];
const COUNTS = [1, 3, 5];

export default function AIGeneratorPage({ onBack, onGoHome, onDesign, onGenerateSuccess }: Props) {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [vibe, setVibe] = useState<Vibe>('Peaceful');
  const [size, setSize] = useState<Size>('small');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
  const [copiedIndices, setCopiedIndices] = useState<number[]>([]);
  const [error, setError] = useState('');

  const categoryColors: Record<string, string> = {
    '❤️ ভালোবাসা': 'from-rose-500 to-pink-600',
    '💔 কষ্ট': 'from-blue-600 to-indigo-700',
    '✨ অনুপ্রেরণা': 'from-emerald-500 to-teal-600',
    '😎 অ্যাটিটিউড': 'from-amber-500 to-orange-600',
    '🤝 বন্ধুত্ব': 'from-purple-500 to-indigo-600',
    '😂 মজার': 'from-yellow-400 to-amber-500',
    '🕌 ইসলামিক': 'from-cyan-500 to-blue-600',
    '🌱 জীবন': 'from-green-500 to-emerald-600',
  };

  const handleGenerate = async () => {
    setLoading(true);
    setGeneratedTexts([]);
    setError('');
    
    try {
      let data;
      let usedFallback = false;

      try {
        const response = await fetch('/api/generate-caption', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, vibe, length: size, prompt, count })
        });
        
        const responseText = await response.text();
        
        if (response.status === 404 || responseText.includes("NOT_FOUND") || responseText.includes("could not be found") || responseText.includes("Cannot POST")) {
          // Fallback to client-side direct Groq call
          usedFallback = true;
          data = await callGroqDirectly();
        } else {
          try {
            data = JSON.parse(responseText);
          } catch (parseErr) {
            throw new Error(`Server returned invalid response. Please try again. (Details: ${responseText.substring(0, 50)}...)`);
          }
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to generate caption');
          }
        }
      } catch (backendErr: any) {
        // If it's a network error or routing error, try the client-side direct call
        console.warn("Backend API failed, trying direct client-side fallback...", backendErr);
        usedFallback = true;
        try {
          data = await callGroqDirectly();
        } catch (fallbackErr: any) {
          throw new Error(fallbackErr.message || backendErr.message || "Failed to generate caption");
        }
      }
      
      const captions = data?.captions || [];
      setGeneratedTexts(captions);
      if (captions.length > 0) {
        // We notify Success but it no longer redirects or adds to home
        onGenerateSuccess(captions, category);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const callGroqDirectly = async () => {
    const apiKey = "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";
    
    let lengthInstruction = "Keep it very short and punchy (max 10-12 words).";
    if (size === "medium") lengthInstruction = "Keep it moderate (20-30 words).";
    if (size === "long") lengthInstruction = "Make it deep, poetic and detailed (50+ words).";

    const systemPrompt = `You are an expert Bengali creative writer. 
Generate exactly ${count} unique, high-quality social media status(es) in Bengali.
Category: ${category}
Vibe: ${vibe}
Length: ${lengthInstruction}

Rules:
1. Language: Elegant Bengali (Cholitobhasha).
2. Poetic: Use metaphors and emotional depth.
3. Emojis: End each status with 1-2 simple, relevant emojis.
4. JSON ONLY: Return ONLY a JSON object: {"captions": ["status 1", "status 2", ...]}. No text before or after.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt ? `Topic Context: ${prompt}` : "Generate beautiful Bengali statuses." }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = "Failed to connect to Groq API directly.";
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.error?.message || errMsg;
      } catch (_) {}
      throw new Error(errMsg);
    }

    const resText = await response.text();
    try {
      const resData = JSON.parse(resText);
      const content = resData.choices?.[0]?.message?.content || '{"captions": []}';
      const cleanedContent = content.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (_) {
      throw new Error("Unable to parse generated statuses. Please retry.");
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndices(prev => [...prev, index]);
    setTimeout(() => {
      setCopiedIndices(prev => prev.filter(i => i !== index));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-0 sm:p-8 lg:p-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex-1 flex flex-col z-10 glass-card rounded-none sm:rounded-[3rem] border-x-0 sm:border-x border-y sm:border-y border-white/10 shadow-2xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.1)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <header className="px-4 py-4 sm:px-10 sm:py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <button 
            onClick={onBack}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/10 group"
            title="Go Back"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Wand2 size={16} className="sm:hidden" />
              <Wand2 size={20} className="hidden sm:block" />
            </div>
            <h2 className="text-sm sm:text-2xl font-bold font-display text-white tracking-tight uppercase">AI Studio</h2>
          </div>
          
          <div className="w-10 sm:w-12" /> {/* Spacer for symmetry */}
        </header>

        <div className="p-4 sm:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex-1 space-y-8 sm:space-y-12">
          <div>
            <label className="block text-[10px] sm:text-xs font-bold text-indigo-300 mb-3 sm:mb-4 uppercase tracking-[0.2em] font-display">Prompt Context (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. বৃষ্টি ভেজা বিকেল, কফির কাপ..."
              className="w-full px-4 py-4 sm:px-6 sm:py-5 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 font-bangla text-white bg-black/20 transition-all text-base sm:text-lg placeholder:text-slate-500 shadow-inner"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-indigo-300 mb-3 sm:mb-4 uppercase tracking-[0.2em] font-display">Theme Category</label>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-bangla transition-all tracking-wide border relative overflow-hidden",
                      category === c 
                        ? "text-white border-transparent scale-105 shadow-lg" 
                        : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200"
                    )}
                  >
                    {category === c && (
                      <div className={cn("absolute inset-0 bg-gradient-to-tr", categoryColors[c] || 'from-indigo-600 to-purple-600')} />
                    )}
                    <span className="relative z-10">{c}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-indigo-300 mb-3 sm:mb-4 uppercase tracking-[0.2em] font-display">Emotional Vibe</label>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {VIBES.map(v => (
                  <button
                    key={v}
                    onClick={() => setVibe(v)}
                    className={cn(
                      "px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all tracking-wide font-sans border",
                      vibe === v 
                        ? "bg-purple-500/20 text-purple-200 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]" 
                        : "bg-white/5 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-indigo-300 mb-3 sm:mb-4 uppercase tracking-[0.2em] font-display">Output Length</label>
              <div className="flex bg-black/20 p-1 sm:p-1.5 rounded-2xl w-full border border-white/5">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "flex-1 py-3 sm:py-3.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] transition-all",
                      size === s ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-indigo-300 mb-3 sm:mb-4 uppercase tracking-[0.2em] font-display">How many results?</label>
              <div className="flex bg-black/20 p-1 sm:p-1.5 rounded-2xl w-full border border-white/5">
                {COUNTS.map(c => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={cn(
                      "flex-1 py-3 sm:py-3.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] transition-all",
                      count === c ? "bg-white/10 text-white shadow-sm border border-white/10" : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {c} {c === 1 ? 'Quote' : 'Quotes'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 sm:pt-4">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="relative w-full py-4 sm:py-5 lg:py-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-3 sm:gap-4 transition-all disabled:opacity-50 overflow-hidden group shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 group-hover:opacity-100 opacity-50 transition-opacity" />
              {loading ? <Loader2 className="animate-spin relative z-10" size={24} /> : <Sparkles size={24} className="relative z-10 text-indigo-400" />}
              <span className="relative z-10 font-display tracking-[0.2em] uppercase text-sm">
                {loading ? 'Synthesizing...' : 'Generate Magic'}
              </span>
            </button>
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 text-red-400 rounded-2xl text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}

          {generatedTexts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {generatedTexts.map((text, idx) => {
                const status: Status = {
                  id: `ai-${idx}-${Date.now()}`,
                  text,
                  category
                };
                return (
                  <StatusCard 
                    key={status.id}
                    status={status}
                    onOpenImageEditor={() => onDesign(text, category)}
                    index={idx}
                  />
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
