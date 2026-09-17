import React, { useState, useEffect } from 'react';
import { OutfitState, Costume, CulturalScore } from '../types';
import { ACCESSORIES_DATA } from '../data/accessoriesData';
import { saveLookbook } from '../services/storageService';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Bookmark, 
  Share2, 
  Check, 
  Download
} from 'lucide-react';

interface LookbookModalProps {
  outfit: OutfitState;
  costume: Costume;
  score: CulturalScore;
  onClose: () => void;
  onSavedSuccess: () => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  outfit,
  costume,
  score,
  onClose,
  onSavedSuccess
}) => {
  const [title, setTitle] = useState(`${costume.name} Remix`);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c94b4b', '#e09f3e', '#ffd166', '#52b788', '#f5f0e6']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleSave = () => {
    saveLookbook(title, outfit, score);
    setIsSaved(true);
    onSavedSuccess();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopyShare = () => {
    const shareText = `✨ Lookbook Việt Phục Remix: "${title}"
Trang phục: ${costume.name} (${costume.dynasty})
Bảng màu Cổ Sắc: ${outfit.outerColor.name} & ${outfit.innerColor.name}
Điểm Di Sản Văn Hóa: ${score.score}/100 (${score.badge})
Khám phá và thử đồ Việt phục phong cách Gen Z tại Việt Phục Remix!`;

    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = outfit.generatedLookUrl || costume.imageUrl;
    a.download = `lookbook-${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const activeAccessories = ACCESSORIES_DATA.filter(a => outfit.selectedAccessories.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-left">
      <div className="bg-[#141520] border border-[#2d3044] rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#232536]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffd166]" />
            <h3 className="text-base font-bold text-white">
              Thẻ Lookbook Thời Trang Di Sản
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1 rounded-lg hover:bg-[#222434] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* The Editorial Lookbook Card */}
        <div className="bg-gradient-to-b from-[#181926] to-[#0d0e14] border border-[#e09f3e]/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
          
          {/* Top Brand Banner */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#26283a]">
            <div className="text-[10px] font-bold text-[#e09f3e] tracking-widest uppercase">
              VIETNAM HERITAGE REMIX · GEN Z EDITORIAL
            </div>
            <span className="text-[10px] text-gray-400">
              {new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Lookbook Title */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">
              Tên Bản Phối:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-[#35384d] pb-1 text-lg font-bold text-white focus:outline-none focus:border-[#e09f3e]"
            />
          </div>

          {/* Model Photo Card with Custom Face Support */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#2a2d40] bg-black shadow-lg">
            <img
              src={outfit.generatedLookUrl || costume.imageUrl}
              alt={costume.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Custom Face Overlay if present and not already baked into generatedLookUrl */}
            {!outfit.generatedLookUrl && outfit.customFace && (
              <div 
                className="absolute z-10 pointer-events-none"
                style={{
                  top: '18%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${outfit.customFace.offsetX * 0.4}px, ${outfit.customFace.offsetY * 0.4}px)`,
                }}
              >
                <div 
                  className="rounded-full overflow-hidden shadow-xl"
                  style={{
                    width: `${48 * outfit.customFace.scale}px`,
                    height: `${62 * outfit.customFace.scale}px`,
                    maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 95%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 95%)',
                  }}
                >
                  <img
                    src={outfit.customFace.imageUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                    style={{ filter: `brightness(${outfit.customFace.brightness}%)` }}
                  />
                </div>
              </div>
            )}

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
              <span className="font-bold text-white">{costume.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#2d6a4f]/80 text-[#52b788] text-[10px] font-bold border border-[#52b788]/40">
                {score.score}/100 ({score.badge})
              </span>
            </div>
          </div>

          {/* Color Swatches Grid */}
          <div className="bg-[#101118] p-3 rounded-xl border border-[#222434] space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Bảng Màu Cổ Sắc & Ngũ Hành:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.outerColor.hex }} />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-white block truncate">{outfit.outerColor.name}</span>
                  <span className="text-gray-400 text-[9.5px]">Hành {outfit.outerColor.element}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.innerColor.hex }} />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-white block truncate">{outfit.innerColor.name}</span>
                  <span className="text-gray-400 text-[9.5px]">Hành {outfit.innerColor.element}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.bottomColor.hex }} />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-white block truncate">{outfit.bottomColor.name}</span>
                  <span className="text-gray-400 text-[9.5px]">Quần / Váy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Phụ Kiện Remix */}
          {activeAccessories.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Phụ Kiện Đi Kèm:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeAccessories.map(acc => (
                  <span
                    key={acc.id}
                    className="text-[10.5px] font-medium px-2 py-0.5 rounded-lg bg-[#1c1d2a] border border-[#2f3246] text-gray-200"
                  >
                    {acc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Triết lý tóm tắt */}
          <div className="text-xs text-gray-300 italic border-l-2 border-[#e09f3e] pl-3 py-1">
            "{costume.philosophy}"
          </div>

          {/* Footer watermark */}
          <div className="text-right text-[10px] text-gray-500 pt-2 border-t border-[#222434]">
            Việt Phục Remix · Gìn Giữ & Lan Tỏa Di Sản Việt
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <button
            onClick={handleCopyShare}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#1e202e] hover:bg-[#282a3c] text-gray-200 border border-[#32364c] flex items-center justify-center gap-1.5 transition-colors"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Đã Sao Chép!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia Sẻ</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-2.5 rounded-xl text-xs font-semibold bg-[#1e202e] hover:bg-[#282a3c] text-gray-200 border border-[#32364c] transition-colors"
            title="Tải ảnh lookbook về máy"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#9e2a2b] to-[#c94b4b] text-white shadow-md shadow-[#9e2a2b]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã Lưu!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Lưu Bộ Sưu Tập</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
