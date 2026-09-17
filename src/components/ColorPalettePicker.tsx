import React, { useState } from 'react';
import { HeritageColor } from '../types';
import { HERITAGE_COLORS, getElementHarmonyText } from '../data/heritagePalettes';
import { Palette, Sparkles } from 'lucide-react';

interface ColorPalettePickerProps {
  outerColor: HeritageColor;
  innerColor: HeritageColor;
  bottomColor: HeritageColor;
  onColorSelect: (target: 'outer' | 'inner' | 'bottom', color: HeritageColor) => void;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  outerColor,
  innerColor,
  bottomColor,
  onColorSelect
}) => {
  const [activeLayer, setActiveLayer] = useState<'outer' | 'inner' | 'bottom'>('outer');

  const currentColor = activeLayer === 'outer' 
    ? outerColor 
    : activeLayer === 'inner' 
      ? innerColor 
      : bottomColor;

  const harmonyInfo = getElementHarmonyText(outerColor.element, innerColor.element);

  return (
    <div className="space-y-4">
      
      {/* Header & Target Layer Tab Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#e09f3e]" />
          <span>Bảng Màu Cổ Sắc Việt Nam (Ngũ Hành)</span>
        </label>
      </div>

      {/* Switcher: Áo Ngoài - Áo Trong - Quần/Váy */}
      <div className="flex bg-[#161824] p-1 rounded-xl border border-[#292b3a]">
        {[
          { id: 'outer', name: 'Áo Ngoài', shortName: 'Áo Ngoài', color: outerColor },
          { id: 'inner', name: 'Áo Trong / Cổ Lót', shortName: 'Cổ Lót', color: innerColor },
          { id: 'bottom', name: 'Quần / Váy', shortName: 'Hạ Y', color: bottomColor }
        ].map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`flex-1 min-h-[40px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#252838] text-white shadow-md border border-[#3b3f57]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                style={{ backgroundColor: layer.color.hex }}
              />
              <span className="hidden sm:inline truncate">{layer.name}</span>
              <span className="sm:hidden text-[11px] truncate">{layer.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Grid 12 Màu Cổ Sắc */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {HERITAGE_COLORS.map((c) => {
          const isSelected = currentColor.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onColorSelect(activeLayer, c)}
              className={`min-h-[48px] flex items-center gap-2 sm:gap-2.5 p-2 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#252838] border-[#e09f3e] shadow-md shadow-[#e09f3e]/15 scale-[1.02]'
                  : 'bg-[#151620] border-[#292b3a] text-gray-300 hover:bg-[#1c1e2b] hover:border-[#383b4e]'
              }`}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/15"
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <span className="text-[11px] font-bold" style={{ color: c.textColor }}>
                    ✓
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{c.name}</div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <span className="px-1 py-0.2 rounded bg-[#20222f] text-[#e09f3e] text-[9px] font-semibold">
                    Hành {c.element}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Ngũ Hành Tương Sinh Analysis Card */}
      <div className="bg-[#12131b] border border-[#2b2e40] rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd166]" />
            <span>Phân Tích Ngũ Hành Sắc Độ</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            harmonyInfo.isHarmonious 
              ? 'bg-[#2d6a4f]/25 text-[#52b788] border border-[#2d6a4f]/50'
              : 'bg-[#d49b27]/25 text-[#ffd166] border border-[#d49b27]/50'
          }`}>
            {harmonyInfo.isHarmonious ? 'Tương Sinh Cát Lành' : 'Tương Phản Cá Tính'}
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {harmonyInfo.message}
        </p>
        <div className="text-[11px] text-gray-400 italic pt-1 border-t border-[#232536]">
          "{currentColor.meaning}"
        </div>
      </div>

    </div>
  );
};
