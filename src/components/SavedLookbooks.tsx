import React from 'react';
import { SavedLookbook, OutfitState } from '../types';
import { TRADITIONAL_COSTUMES } from '../data/traditionalCostumes';
import { Bookmark, Trash2, ArrowUpRight, Shirt, Calendar } from 'lucide-react';

interface SavedLookbooksProps {
  lookbooks: SavedLookbook[];
  onLoadOutfit: (outfit: OutfitState) => void;
  onDeleteLookbook: (id: string) => void;
  onGoToStudio: () => void;
}

export const SavedLookbooks: React.FC<SavedLookbooksProps> = ({
  lookbooks,
  onLoadOutfit,
  onDeleteLookbook,
  onGoToStudio
}) => {
  if (lookbooks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-[#1d1f2b] border border-[#2d3042] flex items-center justify-center mx-auto text-gray-500">
          <Bookmark className="w-8 h-8 text-[#e09f3e]" />
        </div>
        <h3 className="text-xl font-bold text-white font-serif">
          Chưa Có Bản Phối Nào Được Lưu
        </h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Hãy vào Phòng Thử Đồ (Studio), phối màu sắc và phụ kiện cho trang phục yêu thích của bạn, sau đó nhấn "Xuất Lookbook" để lưu trữ bộ sưu tập tại đây!
        </p>
        <button
          onClick={onGoToStudio}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#9e2a2b] via-[#c94b4b] to-[#e09f3e] text-white shadow-lg shadow-[#9e2a2b]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Shirt className="w-4 h-4" />
          <span>Đến Phòng Thử Đồ Ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-serif">
            Bộ Sưu Tập Lookbook Của Bạn
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Đã lưu {lookbooks.length} bản phối cổ phục phong cách Gen Z
          </p>
        </div>
        <button
          onClick={onGoToStudio}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#212330] hover:bg-[#2c2f42] text-[#f4efe6] border border-[#373a50] transition-all flex items-center gap-1.5"
        >
          <Shirt className="w-3.5 h-3.5 text-[#e09f3e]" />
          <span>Về Studio Phối Thêm</span>
        </button>
      </div>

      {/* Grid Danh Sách Lookbooks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {lookbooks.map((item) => {
          const costume = TRADITIONAL_COSTUMES.find(c => c.id === item.outfit.costumeId);
          return (
            <div
              key={item.id}
              className="bg-[#151620] border border-[#2b2e40] rounded-3xl p-5 shadow-xl space-y-4 hover:border-[#e09f3e]/40 transition-all group relative overflow-hidden"
            >
              {/* Top Details */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                  <h3 className="text-base font-bold text-white font-serif mt-1 line-clamp-1 group-hover:text-[#e09f3e] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    {costume?.name}
                  </p>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2d6a4f]/20 text-[#52b788] border border-[#2d6a4f]/40 flex-shrink-0">
                  {item.score.score} đ
                </span>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-3 bg-[#101117] p-2.5 rounded-xl border border-[#232534]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.outfit.outerColor.hex }}
                  />
                  <span className="text-[11px] text-gray-300 truncate max-w-[80px]">
                    {item.outfit.outerColor.name}
                  </span>
                </div>

                <span className="text-gray-600">/</span>

                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.outfit.innerColor.hex }}
                  />
                  <span className="text-[11px] text-gray-300 truncate max-w-[80px]">
                    {item.outfit.innerColor.name}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#232536]">
                <button
                  onClick={() => onDeleteLookbook(item.id)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Xóa bản phối này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onLoadOutfit(item.outfit)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#242636] hover:bg-[#303348] text-white flex items-center gap-1.5 transition-all group-hover:bg-[#c94b4b] group-hover:text-white"
                >
                  <span>Mặc Lên Búp Bê</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
