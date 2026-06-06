import React, { useState } from 'react';
import { Copy, Image as ImageIcon, Check } from 'lucide-react';
import { Status } from '../types';
import { motion } from 'motion/react';

const ModernQuoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.874 3.874 0 01-2.743-1.12zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.874 3.874 0 01-2.743-1.12z"/>
  </svg>
);

interface StatusCardProps {
  status: Status;
  onOpenImageEditor: (status: Status) => void;
  index?: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, onOpenImageEditor, index = 0 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(status.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group glass-card rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col h-full relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <ModernQuoteIcon className="absolute w-[60px] h-[60px] top-4 right-4 text-white/5 group-hover:text-white/10 transition-colors duration-500 pointer-events-none fill-current" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <span className="inline-flex max-w-fit items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-300 mb-5 font-display backdrop-blur-sm">
          {status.category}
        </span>
        <p className="text-[1.2rem] sm:text-[1.3rem] text-slate-100 font-bangla leading-relaxed flex-1 font-medium drop-shadow-sm">
          {status.text}
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
        <button 
          onClick={() => onOpenImageEditor(status)}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group/btn px-2 py-2 -ml-2 rounded-lg hover:bg-white/5"
        >
          <ImageIcon size={16} className="text-indigo-400 group-hover/btn:text-indigo-300 transition-colors" />
          <span className="font-display">Studio</span>
        </button>
        
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group/copy px-3 py-2 -mr-2 rounded-lg hover:bg-white/5"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="text-slate-500 group-hover/copy:text-slate-300 transition-colors" />}
          <span className="font-display">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};

export default StatusCard;
