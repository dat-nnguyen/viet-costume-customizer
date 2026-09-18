import React from 'react';
import { Sparkles, Camera, BookOpen, Shirt, Bookmark, MessageSquare } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'explorer' | 'saved';
  setActiveTab: (tab: 'studio' | 'explorer' | 'saved') => void;
  onOpenAIStylist: () => void;
  onOpenFaceFitter: () => void;
  onOpenChat: () => void;
  savedCount: number;
  hasCustomFace: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIStylist,
  onOpenFaceFitter,
  onOpenChat,
  savedCount,
  hasCustomFace
}) => {

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0e0f13]/90 backdrop-blur-md border-b border-[#282a36] px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9e2a2b] via-[#c94b4b] to-[#e09f3e] flex items-center justify-center shadow-lg shadow-[#9e2a2b]/25 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15 8H21L16.5 12L18.5 18L12 14.5L5.5 18L7.5 12L3 8H9L12 2Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  VIỆT PHỤC <span className="text-[#ffd166] font-bold text-xs px-2 py-0.5 rounded-lg bg-[#e09f3e]/20 border border-[#e09f3e]/40">REMIX</span>
                </h1>
              </div>
              <p className="text-xs text-[#a0a5b8] font-normal hidden sm:block">
                Khám Phá Cổ Phục Việt & Phối Đồ Gen Z Cùng AI Stylist
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop only: md+) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#171821] p-1 rounded-xl border border-[#2b2d3d]">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-[#9e2a2b] to-[#b33939] text-white shadow-md shadow-[#9e2a2b]/30'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#20222f]'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Phòng Thử Đồ</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explorer'
                  ? 'bg-gradient-to-r from-[#9e2a2b] to-[#b33939] text-white shadow-md shadow-[#9e2a2b]/30'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#20222f]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Bách Khoa Cổ Phục</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-[#9e2a2b] to-[#b33939] text-white shadow-md shadow-[#9e2a2b]/30'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#20222f]'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bộ Sưu Tập</span>
              {savedCount > 0 && (
                <span className="bg-[#e09f3e] text-[#121214] font-bold text-[11px] w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons: Ghép Mặt & AI Stylist & API Key */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Ghép Mặt Chân Dung Button (Desktop) */}
            <button
              onClick={onOpenFaceFitter}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                hasCustomFace
                  ? 'bg-[#2d6a4f]/20 border-[#2d6a4f] text-[#52b788] shadow-sm shadow-[#2d6a4f]/40'
                  : 'bg-[#1a1b24] border-[#313445] text-[#d1d5db] hover:bg-[#242635] hover:border-[#e09f3e]/40 hover:text-white'
              }`}
              title="Ghép khuôn mặt của bạn vào búp bê thời trang"
            >
              <Camera className="w-3.5 h-3.5 text-[#e09f3e]" />
              <span>
                {hasCustomFace ? 'Đã Ghép Mặt' : 'Ghép Mặt Của Bạn'}
              </span>
            </button>

            {/* Chatbot Cố Vấn Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1a1b24] border border-[#3b3e55] text-white hover:border-[#e09f3e] hover:text-[#ffd166] transition-all cursor-pointer shadow-sm"
              title="Mở Chatbot Cố Vấn Cổ Phục & Gen Z Remix"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#e09f3e]" />
              <span>Cố Vấn AI</span>
            </button>

            {/* AI Stylist Button */}
            <button
              onClick={onOpenAIStylist}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d49b27] via-[#e09f3e] to-[#c94b4b] text-[#121214] shadow-md shadow-[#e09f3e]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>AI Stylist</span>
            </button>
          </div>

        </div>
      </header>

      {/* Fixed Ergonomic Bottom Navigation Bar for Mobile (<md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c0d14]/95 backdrop-blur-xl border-t border-[#232536] px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-around">
        {/* Tab 1: Studio */}
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'studio'
              ? 'text-[#e09f3e] font-bold'
              : 'text-[#8c91a4] hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'studio' ? 'bg-[#e09f3e]/15' : ''}`}>
            <Shirt className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight">Thử Đồ</span>
        </button>

        {/* Tab 2: Bách Khoa */}
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'explorer'
              ? 'text-[#e09f3e] font-bold'
              : 'text-[#8c91a4] hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'explorer' ? 'bg-[#e09f3e]/15' : ''}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight">Bách Khoa</span>
        </button>

        {/* Tab 3: Ghép Mặt Quick Trigger */}
        <button
          onClick={onOpenFaceFitter}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-[#8c91a4] hover:text-white transition-all relative"
        >
          <div className={`p-1 rounded-lg ${hasCustomFace ? 'bg-[#2d6a4f]/25 text-[#52b788]' : ''}`}>
            <Camera className="w-5 h-5 text-[#e09f3e]" />
          </div>
          <span className="text-[10px] leading-tight">
            {hasCustomFace ? 'Mặt Của Bạn' : 'Ghép Mặt'}
          </span>
          {hasCustomFace && (
            <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
          )}
        </button>

        {/* Tab 4: Chatbot Cố Vấn Quick Trigger */}
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl text-[#ffd166] transition-all"
        >
          <div className="p-1 rounded-lg bg-gradient-to-tr from-[#9e2a2b]/40 to-[#e09f3e]/30 border border-[#e09f3e]/40 shadow-sm">
            <MessageSquare className="w-5 h-5 text-[#ffd166]" />
          </div>
          <span className="text-[10px] font-bold leading-tight text-[#ffd166]">Cố Vấn AI</span>
        </button>

        {/* Tab 5: Bộ Sưu Tập */}
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'saved'
              ? 'text-[#e09f3e] font-bold'
              : 'text-[#8c91a4] hover:text-white font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'saved' ? 'bg-[#e09f3e]/15' : ''}`}>
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight">Đã Lưu</span>
          {savedCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-[#e09f3e] text-[#121214] font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
};
