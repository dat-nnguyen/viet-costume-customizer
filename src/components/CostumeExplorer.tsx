import React, { useState } from 'react';
import { CostumeId } from '../types';
import { TRADITIONAL_COSTUMES } from '../data/traditionalCostumes';
import { BookOpen, ShieldAlert, Sparkles, Feather, ArrowRight } from 'lucide-react';

interface CostumeExplorerProps {
  onSelectToTryOn: (costumeId: CostumeId) => void;
}

export const CostumeExplorer: React.FC<CostumeExplorerProps> = ({
  onSelectToTryOn
}) => {
  const [selectedId, setSelectedId] = useState<CostumeId>('ngu_than_chen');

  const currentCostume = TRADITIONAL_COSTUMES.find(c => c.id === selectedId) || TRADITIONAL_COSTUMES[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn text-left">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#e09f3e] px-3.5 py-1.5 rounded-full bg-[#e09f3e]/10 border border-[#e09f3e]/25 uppercase tracking-wider">
          Bách Khoa Di Sản Y Phục Việt
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Khám Phá Cội Nguồn & Chuẩn Mực Cổ Phong
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Tìm hiểu nguồn gốc lịch sử, triết lý đạo làm người qua cấu trúc ngũ thân - ngũ thường, 
          và những lưu ý di sản để Gen Z thỏa sức sáng tạo mà vẫn tôn kính tiền nhân.
        </p>
      </div>

      {/* Grid: Left List - Right Deep Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Costume Navigator (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-2.5 lg:sticky lg:top-24">
          <span className="text-xs font-bold text-gray-400 px-1 uppercase tracking-wider block mb-2">
            Danh Mục 8 Dòng Cổ Phục
          </span>
          {TRADITIONAL_COSTUMES.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1e202d] border-[#c94b4b] text-white shadow-lg shadow-[#c94b4b]/15 scale-[1.01]'
                    : 'bg-[#11121a] border-[#222434] text-gray-400 hover:text-white hover:bg-[#161824]'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {item.name}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">{item.dynasty}</div>
                  <span className="text-[9px] text-[#e09f3e] font-semibold block mt-1">
                    {item.category}
                  </span>
                </div>
                <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-[#e09f3e] translate-x-0.5' : 'text-gray-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: In-Depth Cultural Encyclopedia (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6 bg-[#13141d] border border-[#242636] rounded-3xl p-6 sm:p-8 shadow-2xl">
          
          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#202230]">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e09f3e]/15 text-[#e09f3e] border border-[#e09f3e]/30">
                {currentCostume.category}
              </span>
              <h3 className="text-2xl font-bold text-white mt-2">
                {currentCostume.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium italic">
                {currentCostume.subTitle}
              </p>
            </div>

            <button
              onClick={() => onSelectToTryOn(currentCostume.id)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#9e2a2b] via-[#c94b4b] to-[#e09f3e] text-white shadow-md shadow-[#9e2a2b]/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Mặc Thử Ngay Trong Studio</span>
            </button>
          </div>

          {/* Photo Showcase & Key Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Real Editorial Photo */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-[#2d3044] shadow-2xl bg-[#090a0f] aspect-[3/4]">
              <img
                src={currentCostume.imageUrl}
                alt={currentCostume.name}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Specs Breakdown */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="bg-[#0e0f17] p-3.5 rounded-xl border border-[#202232] space-y-1">
                <span className="text-[10px] font-bold text-[#e09f3e] uppercase tracking-wider block">
                  Cổ Áo (Collar Type)
                </span>
                <p className="text-gray-200 font-medium">
                  {currentCostume.collarType}
                </p>
              </div>

              <div className="bg-[#0e0f17] p-3.5 rounded-xl border border-[#202232] space-y-1">
                <span className="text-[10px] font-bold text-[#52b788] uppercase tracking-wider block">
                  Tay Áo (Sleeve Type)
                </span>
                <p className="text-gray-200 font-medium">
                  {currentCostume.sleeveType}
                </p>
              </div>

              <div className="bg-[#0e0f17] p-3.5 rounded-xl border border-[#202232] space-y-1">
                <span className="text-[10px] font-bold text-[#4a85a0] uppercase tracking-wider block">
                  Cấu Trúc Thân Áo (Flaps)
                </span>
                <p className="text-gray-200 font-medium">
                  {currentCostume.flaps}
                </p>
              </div>

              <div className="bg-[#0e0f17] p-3.5 rounded-xl border border-[#202232] space-y-1">
                <span className="text-[10px] font-bold text-[#ffd166] uppercase tracking-wider block">
                  Khuy Cài & Triết Lý (Buttons)
                </span>
                <p className="text-gray-200 font-medium">
                  {currentCostume.buttons}
                </p>
              </div>
            </div>

          </div>

          {/* Chất Liệu Dệt May Truyền Thống */}
          <div className="bg-[#0e0f17] p-4 rounded-2xl border border-[#202232] space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Chất Liệu Dệt Cổ Truyền:
            </span>
            <p className="text-xs text-gray-200">
              {currentCostume.material}
            </p>
          </div>

          {/* Bối Cảnh Lịch Sử & Điển Tích */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#e09f3e]" />
              <span>Nguồn Gốc & Bối Cảnh Lịch Sử</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {currentCostume.historicalStory}
            </p>
          </div>

          {/* Triết Lý Nhân Sinh & Mỹ Học */}
          <div className="space-y-2 bg-[#0e0f17] p-4 rounded-2xl border border-[#222434]">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Feather className="w-4 h-4 text-[#ffd166]" />
              <span>Triết Lý Đạo Làm Người & Mỹ Học Cổ Phong</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "{currentCostume.philosophy}"
            </p>
          </div>

          {/* Lưu Ý Văn Hóa & Tránh Lệch Chuẩn */}
          <div className="space-y-3 bg-[#9e2a2b]/10 border border-[#9e2a2b]/30 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-[#ffd166] flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-[#e09f3e]" />
              <span>Nguyên Tắc Di Sản — Bảo Đảm Không Làm Sai Lệch Văn Hóa</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {currentCostume.culturalRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#e09f3e] font-bold text-xs mt-0.5">✦</span>
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
