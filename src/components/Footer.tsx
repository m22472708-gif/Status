import React from 'react';
import { motion } from 'motion/react';
import { Heart, Github, Twitter, Facebook, Instagram, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/5 bg-slate-950/50 backdrop-blur-3xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                <Heart size={20} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-bangla-stylish tracking-wider">
                শব্দাঞ্জলি
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              বাঙালির আবেগের প্রতিটি কথা, স্ট্যাটাস আর ক্যাপশনের অনন্য সংগ্রহশালা। আমাদের সাথে আপনার মনের কথাগুলো ছড়িয়ে দিন সবার মাঝে।
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-semibold mb-6 tracking-wide uppercase text-xs">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-4">
              <FooterLink label="হোম" />
              <FooterLink label="এআই জেনারেটর" />
              <FooterLink label="জনপ্রিয় স্ট্যাটাস" />
              <FooterLink label="ক্যাটাগরি" />
            </ul>
          </div>

          {/* Categories Preview */}
          <div>
            <h3 className="text-white font-display font-semibold mb-6 tracking-wide uppercase text-xs">বিভাগসমূহ</h3>
            <ul className="space-y-4">
              <FooterLink label="ভালোবাসা" />
              <FooterLink label="অনুপ্রেরণা" />
              <FooterLink label="বন্ধুত্ব" />
              <FooterLink label="ইসলামিক" />
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-display font-semibold mb-6 tracking-wide uppercase text-xs">যোগাযোগ</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 text-slate-400 hover:text-indigo-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-indigo-500/30">
                  <Mail size={16} />
                </div>
                <span className="text-sm">support@kabyo.app</span>
              </a>
              <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-white/5">
                <p className="text-xs text-slate-400 italic font-bangla">
                  "শব্দের মায়ায় আমরা বাঁধি জীবনের হাজারো অনুভুতি।"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs font-medium">
            © {currentYear} শব্দাঞ্জলি (Shabdanjali) by Sakib Hossain. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">প্রাইভেসি পলিসি</a>
            <a href="#" className="text-slate-500 hover:text-white text-xs transition-colors">টার্মস অ্যান্ড কন্ডিশন</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -3, scale: 1.1 }}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300"
    >
      {icon}
    </motion.a>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <li>
      <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
        {label}
      </a>
    </li>
  );
}
