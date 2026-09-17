import React from 'react';
import { OutfitState, Costume, CulturalScore } from '../types';
import { Columns, CheckCircle, Sparkles } from 'lucide-react';

interface CompareModalProps {
  currentOutfit: OutfitState;
  currentCostume: Costume;
  currentScore: CulturalScore;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  currentOutfit,
  currentCostume,
  currentScore,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-left">
      <div className="bg-[#14151f] border border-[#2c2f44] rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-4xl w-full shadow-2xl space-y-5 sm:space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232536]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#2d6a4f]/20 border border-[#2d6a4f]/40 flex items-center justify-center text-[#52b788] flex-shrink-0">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Đối Chiếu: Cổ Điển Nguyên Bản vs. Remix Gen Z
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400">
                So sánh song song để thấy rõ giá trị bảo tồn và nét sáng tạo đương đại
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1.5 rounded-xl hover:bg-[#202230] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Side-by-side 2 Columns with Real Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cột 1: Bản Cổ Điển Thuần Khiết */}
          <div className="bg-[#0e0f17] border border-[#242636] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1d1f2c]">
              <span className="text-xs font-bold text-[#ffd166] uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#52b788]" />
                <span>Bản Cổ Điển Nguyên Mẫu</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2d6a4f]/20 text-[#52b788] border border-[#2d6a4f]/40">
                100/100 Điểm Chuẩn
              </span>
            </div>

            {/* Real Photo */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#222534] bg-black">
              <img
                src={currentCostume.imageUrl}
                alt="Original"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{currentCostume.name}</h4>
              <p className="text-xs text-gray-400 italic">{currentCostume.dynasty}</p>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="bg-[#141520] p-2.5 rounded-xl border border-[#1f212f]">
                <span className="text-[10px] text-gray-400 block font-semibold">Phụ kiện chuẩn mực:</span>
                <span className="text-gray-200">
                  Khăn đóng lụa đen hoặc khăn vành dây, Guốc mộc quai nhung, Hài thêu, Quạt xếp gấm.
                </span>
              </div>

              <div className="bg-[#141520] p-2.5 rounded-xl border border-[#1f212f]">
                <span className="text-[10px] text-gray-400 block font-semibold">Bối cảnh lý tưởng:</span>
                <span className="text-gray-200">
                  Lễ cưới gia tiên, tế tự cúng đình, nghi thức trang trọng của gia đình và hoàng gia.
                </span>
              </div>
            </div>
          </div>

          {/* Cột 2: Bản Phối Remix Gen Z Hiện Tại */}
          <div className="bg-gradient-to-b from-[#181a26] to-[#0e0f17] border border-[#e09f3e]/40 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#292c3e]">
              <span className="text-xs font-bold text-[#e09f3e] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bản Remix Gen Z Đương Đại</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e09f3e]/20 text-[#ffd166] border border-[#e09f3e]/40">
                {currentScore.score}/100 ({currentScore.badge})
              </span>
            </div>

            {/* Tinted Styled Preview */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#2d3044] bg-black relative">
              <img
                src={currentCostume.imageUrl}
                alt="Remix"
                className="w-full h-full object-cover object-top"
              />
              <div 
                className="absolute inset-0 mix-blend-color opacity-30 pointer-events-none"
                style={{ backgroundColor: currentOutfit.outerColor.hex }}
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                {currentCostume.name} · Phối {currentOutfit.outerColor.name}
              </h4>
              <p className="text-xs text-gray-400">
                Phối cùng {currentOutfit.innerColor.name} & {currentOutfit.bottomColor.name}
              </p>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="bg-[#171926] p-2.5 rounded-xl border border-[#26283c]">
                <span className="text-[10px] text-[#e09f3e] block font-semibold">Phụ kiện remix:</span>
                <span className="text-white font-medium">
                  {currentOutfit.selectedAccessories.length > 0 
                    ? currentOutfit.selectedAccessories.join(', ') 
                    : 'Tối giản thuần túy'}
                </span>
              </div>

              <div className="bg-[#171926] p-2.5 rounded-xl border border-[#26283c]">
                <span className="text-[10px] text-[#e09f3e] block font-semibold">Bối cảnh lý tưởng:</span>
                <span className="text-gray-200">
                  Chụp ảnh kỷ yếu, check-in di sản Hội An/Huế, dạo phố cà phê nghệ thuật.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="bg-[#0e0f17] p-4 rounded-2xl border border-[#222434] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
          <p className="leading-relaxed">
            💡 <strong>Ý nghĩa:</strong> Bản Remix là chiếc cầu nối kéo thế hệ trẻ lại gần hơn với tinh hoa y phục truyền thống Việt Nam.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#222536] hover:bg-[#2c3046] text-white flex-shrink-0 transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
