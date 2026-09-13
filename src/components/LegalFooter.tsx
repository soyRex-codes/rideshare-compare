"use client";

import { useState } from "react";

export default function LegalFooter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className="text-center py-6 mt-auto">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-[12px] text-neutral-400 hover:text-neutral-600 font-medium underline underline-offset-4 transition-colors"
        >
          Terms of Use & Disclaimer
        </button>
      </footer>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 transition-colors bg-neutral-100 hover:bg-neutral-200 p-1.5 rounded-full"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            
            <h3 className="text-[18px] font-bold text-neutral-900 mb-2">Terms of Use & Disclaimer</h3>
            <p className="text-[14px] text-neutral-500 leading-relaxed mb-6">
              We are not associated with the drivers in any way. We are simply a price comparison app and take no responsibility or liability for the drivers. Please do your own independent research and exercise caution before booking and riding with any drivers listed on this platform.
            </p>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] transition-all text-white rounded-xl text-[14px] font-bold shadow-lg shadow-neutral-900/20"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
}
