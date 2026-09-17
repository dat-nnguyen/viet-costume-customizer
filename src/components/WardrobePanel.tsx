import React from 'react';
import { OutfitState, CostumeId } from '../types';
import { TRADITIONAL_COSTUMES } from '../data/traditionalCostumes';
import { OCCASIONS_DATA, REMIX_STYLES_DATA } from '../data/accessoriesData';
import { Shirt, Compass, Calendar, Layers } from 'lucide-react';

interface WardrobePanelProps {
  outfit: OutfitState;
  onCostumeChange: (costumeId: CostumeId) => void;
  onOccasionChange: (occasionId: string) => void;
  onRemixStyleChange: (styleId: string) => void;
  onBottomTypeChange: (type: 'pant_loose' | 'skirt_silk' | 'trousers_modern' | 'skirt_pleated') => void;
}

export const WardrobePanel: React.FC<WardrobePanelProps> = ({
  outfit,
  onCostumeChange,
  onOccasionChange,
  onRemixStyleChange,
  onBottomTypeChange,
}) => {
  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Chọn Dòng Cổ Phục Truyền Thống kèm Ảnh Thực Tế */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Shirt className="w-4 h-4 text-[#e09f3e]" />
            <span>8 Dòng Y Phục Truyền Thống Tiêu Biểu</span>
          </label>
          <span className="text-[11px] text-gray-400">Chọn để thử trang phục</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRADITIONAL_COSTUMES.map((item) => {
            const isSelected = outfit.costumeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onCostumeChange(item.id)}
                className={`group flex flex-col rounded-2xl border transition-all overflow-hidden text-left relative cursor-pointer ${
                  isSelected
                    ? 'border-[#c94b4b] ring-2 ring-[#c94b4b]/40 shadow-xl shadow-[#c94b4b]/20 scale-[1.02] bg-[#1a1c28]'
                    : 'border-[#262838] bg-[#11121a] hover:border-[#3d425c] hover:bg-[#161824]'
                }`}
              >
                {/* Thumbnail Ảnh Người Mẫu Thực Tế */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#0c0d14]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#c94b4b] text-white flex items-center justify-center font-bold text-[10px] shadow-md">
                      ✓
                    </div>
                  )}

                  <span className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-[#ffd166] backdrop-blur-sm">
                    {item.dynasty.split(' ')[0]} {item.dynasty.split(' ')[1] || ''}
                  </span>
                </div>

                {/* Text Info */}
                <div className="p-2.5">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">
                    {item.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Bối Cảnh & Sự Kiện Sử Dụng */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-[#52b788]" />
            <span>Bối Cảnh / Sự Kiện Sử Dụng</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OCCASIONS_DATA.map((occ) => {
            const isSelected = outfit.occasionId === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => onOccasionChange(occ.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#2d6a4f]/20 border-[#52b788] text-white shadow-sm'
                    : 'bg-[#11121a] border-[#252838] text-gray-400 hover:text-white hover:bg-[#161824]'
                }`}
              >
                <div className="text-xs font-bold text-gray-200 truncate">{occ.name}</div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">{occ.vibe}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Phong Cách Remix Gen Z */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-[#d49b27]" />
            <span>Phong Cách Định Hình (Remix Mood)</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {REMIX_STYLES_DATA.map((style) => {
            const isSelected = outfit.remixStyleId === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onRemixStyleChange(style.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-[#d49b27]/20 border-[#d49b27] text-[#ffd166] shadow-sm'
                    : 'bg-[#11121a] border-[#252838] text-gray-400 hover:text-white hover:bg-[#161824]'
                }`}
              >
                {style.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Kiểu Dáng Dưới (Quần / Chân Váy) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#c0527b]" />
            <span>Kiểu Dáng Dưới (Quần / Chân Váy)</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'pant_loose', name: 'Quần Thụng Lụa', note: 'Truyền Thống' },
            { id: 'skirt_silk', name: 'Chân Váy Lụa Quây', note: 'Cung Đình' },
            { id: 'trousers_modern', name: 'Quần Âu Ống Suông', note: 'Remix Hiện Đại' },
            { id: 'skirt_pleated', name: 'Chân Váy Xếp Ly', note: 'Gen Z Chic' },
          ].map((b) => {
            const isSelected = outfit.bottomType === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onBottomTypeChange(b.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#c0527b]/20 border-[#c0527b] text-white'
                    : 'bg-[#11121a] border-[#252838] text-gray-400 hover:text-white hover:bg-[#161824]'
                }`}
              >
                <div className="text-xs font-bold truncate">{b.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{b.note}</div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
