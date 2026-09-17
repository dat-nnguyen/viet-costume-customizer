import React, { useState } from 'react';
import { ACCESSORIES_DATA } from '../data/accessoriesData';
import { Sparkles, X } from 'lucide-react';

interface AccessorySelectorProps {
  selectedAccessories: string[];
  onToggleAccessory: (accessoryId: string) => void;
  onClearAccessories: () => void;
}

export const AccessorySelector: React.FC<AccessorySelectorProps> = ({
  selectedAccessories,
  onToggleAccessory,
  onClearAccessories
}) => {
  const [filter, setFilter] = useState<'all' | 'traditional' | 'remix'>('all');

  const filtered = ACCESSORIES_DATA.filter((acc) => {
    if (filter === 'all') return true;
    return acc.category === filter;
  });

  return (
    <div className="space-y-4">
      
      {/* Header with Counter and Clear Button */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffd166]" />
          <span>Phụ Kiện Truyền Thống & Gen Z Remix</span>
          {selectedAccessories.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#c94b4b] text-white font-bold">
              {selectedAccessories.length}
            </span>
          )}
        </label>

        {selectedAccessories.length > 0 && (
          <button
            onClick={onClearAccessories}
            className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Bỏ chọn
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#161824] p-1 rounded-xl border border-[#292b3a]">
        {[
          { id: 'all', name: 'Tất Cả', shortName: 'Tất Cả' },
          { id: 'traditional', name: 'Truyền Thống Cổ Xưa', shortName: 'Cổ Phong' },
          { id: 'remix', name: 'Gen Z Remix', shortName: 'Remix' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex-1 min-h-[36px] py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
              filter === tab.id
                ? 'bg-[#252838] text-white shadow-sm border border-[#3b3f57]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">{tab.name}</span>
            <span className="sm:hidden">{tab.shortName}</span>
          </button>
        ))}
      </div>

      {/* Grid Danh Sách Phụ Kiện */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {filtered.map((acc) => {
          const isSelected = selectedAccessories.includes(acc.id);
          return (
            <button
              key={acc.id}
              onClick={() => onToggleAccessory(acc.id)}
              className={`min-h-[56px] flex items-start gap-3 p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-r from-[#2a2333] to-[#1e1d2a] border-[#ffd166] shadow-md shadow-[#ffd166]/10'
                  : 'bg-[#151620] border-[#292b3a] text-gray-400 hover:text-white hover:bg-[#1a1c26]'
              }`}
            >
              {/* Checkmark indicator */}
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  isSelected
                    ? 'bg-[#ffd166] text-[#121214] font-bold text-xs'
                    : 'border border-[#3d4157] group-hover:border-[#636888]'
                }`}
              >
                {isSelected ? '✓' : ''}
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {acc.name}
                  </span>
                  {acc.isRemixGenZ ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#9e2a2b]/30 text-[#e09f3e] border border-[#9e2a2b]/50">
                      Remix
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#2d6a4f]/20 text-[#52b788] border border-[#2d6a4f]/30">
                      Cổ Phong
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                  {acc.subName}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
