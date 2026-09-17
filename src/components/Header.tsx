import React, { useState } from 'react';
import { Sparkles, Camera, BookOpen, Shirt, Bookmark, Key, Check } from 'lucide-react';

interface HeaderProps {
  activeTab: 'studio' | 'explorer' | 'saved';
  setActiveTab: (tab: 'studio' | 'explorer' | 'saved') => void;
  onOpenAIStylist: () => void;
  onOpenFaceFitter: () => void;
  savedCount: number;
  apiKey: string;
  setApiKey: (key: string) => void;
  hasCustomFace: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIStylist,
  onOpenFaceFitter,
  savedCount,
  apiKey,
  setApiKey,
  hasCustomFace
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKey = () => {
    setApiKey(tempKey);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

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

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-[#171821] p-1 rounded-xl border border-[#2b2d3d]">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-[#9e2a2b] to-[#b33939] text-white shadow-md shadow-[#9e2a2b]/30'
                  : 'text-[#9ca3af] hover:text-white hover:bg-[#20222f]'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span className="hidden sm:inline">Phòng Thử Đồ</span>
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
              <span className="hidden sm:inline">Bách Khoa Cổ Phục</span>
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
              <span className="hidden sm:inline">Bộ Sưu Tập</span>
              {savedCount > 0 && (
                <span className="bg-[#e09f3e] text-[#121214] font-bold text-[11px] w-4 h-4 rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons: Ghép Mặt & AI Stylist & API Key */}
          <div className="flex items-center gap-2">
            {/* Ghép Mặt Chân Dung Button */}
            <button
              onClick={onOpenFaceFitter}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                hasCustomFace
                  ? 'bg-[#2d6a4f]/20 border-[#2d6a4f] text-[#52b788] shadow-sm shadow-[#2d6a4f]/40'
                  : 'bg-[#1a1b24] border-[#313445] text-[#d1d5db] hover:bg-[#242635] hover:border-[#e09f3e]/40 hover:text-white'
              }`}
              title="Ghép khuôn mặt của bạn vào búp bê thời trang"
            >
              <Camera className="w-3.5 h-3.5 text-[#e09f3e]" />
              <span className="hidden md:inline">
                {hasCustomFace ? 'Đã Ghép Mặt' : 'Ghép Mặt Của Bạn'}
              </span>
            </button>

            {/* AI Stylist Button */}
            <button
              onClick={onOpenAIStylist}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d49b27] via-[#e09f3e] to-[#c94b4b] text-[#121214] shadow-md shadow-[#e09f3e]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>AI Stylist</span>
            </button>

            {/* Gemini API Key Setting */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-2 rounded-xl bg-[#171821] border border-[#2b2d3d] text-[#9ca3af] hover:text-white hover:border-[#42465d] transition-all"
              title="Cấu hình Gemini API Key (Tùy chọn)"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Modal Cài Đặt Gemini API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#181922] border border-[#2f3244] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#282a38]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#e09f3e]/15 text-[#e09f3e]">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Cấu Hình Google Gemini API Key</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Ứng dụng đã tích hợp sẵn <strong>Offline Cultural Expert AI</strong> hoạt động 100% mượt mà ngay cả khi không có mạng.
              Nếu bạn muốn kết nối trực tiếp với mô hình <strong>Gemini 1.5 Flash</strong> từ Google Cloud, hãy dán API key của bạn vào đây:
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Gemini API Key (Miễn phí từ Google AI Studio)
              </label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-[#101117] border border-[#373a4e] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e09f3e]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#e09f3e] hover:underline"
              >
                Lấy API Key miễn phí tại đây →
              </a>
              {apiKey && <span className="text-green-400">● Đã kết nối API</span>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-medium bg-[#212330] text-gray-300 hover:bg-[#2a2c3d]"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveKey}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#c94b4b] hover:bg-[#b03b3b] text-white flex items-center justify-center gap-1.5 shadow-md shadow-[#c94b4b]/30"
              >
                {keySaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Đã Lưu!
                  </>
                ) : (
                  'Lưu Khóa API'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
