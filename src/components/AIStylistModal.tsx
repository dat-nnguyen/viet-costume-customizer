import React, { useState } from 'react';
import { AIStylistRecommendation } from '../types';
import { OCCASIONS_DATA, REMIX_STYLES_DATA } from '../data/accessoriesData';
import { TRADITIONAL_COSTUMES } from '../data/traditionalCostumes';
import { HERITAGE_COLORS } from '../data/heritagePalettes';
import { generateAIStylistRecommendation } from '../services/geminiAI';
import { Sparkles, Check, Compass, Calendar, CloudSun, Wand2 } from 'lucide-react';

interface AIStylistModalProps {
  currentOccasionId: string;
  currentStyleId: string;
  apiKey?: string;
  onApplyRecommendation: (rec: AIStylistRecommendation) => void;
  onClose: () => void;
}

const WEATHER_OPTIONS = [
  'Mát mẻ mùa thu Hà Nội (Trời trong)',
  'Nắng ấm phương Nam Sài Gòn',
  'Se lạnh Đà Lạt / Sa Pa mờ sương',
  'Mưa bay cổ kính Cố Đô Huế',
  'Gió biển Hội An / Đà Nẵng'
];

export const AIStylistModal: React.FC<AIStylistModalProps> = ({
  currentOccasionId,
  currentStyleId,
  apiKey,
  onApplyRecommendation,
  onClose
}) => {
  const [occasionId, setOccasionId] = useState(currentOccasionId);
  const [styleId, setStyleId] = useState(currentStyleId);
  const [weather, setWeather] = useState(WEATHER_OPTIONS[0]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIStylistRecommendation | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const rec = await generateAIStylistRecommendation({
        occasionId,
        remixStyleId: styleId,
        weather,
        userPrompt,
        apiKey
      });
      setRecommendation(rec);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (recommendation) {
      onApplyRecommendation(recommendation);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#171822] border border-[#2d3042] rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#282a3a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d49b27] to-[#e09f3e] flex items-center justify-center text-[#121214] shadow-md shadow-[#d49b27]/30">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">Trợ Lý AI Stylist Cổ Phục</h3>
              <p className="text-xs text-gray-400">
                Tối ưu hóa bản phối trang phục theo sự kiện, địa phương và phong cách Gen Z
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1 rounded-lg hover:bg-[#252838]"
          >
            ✕
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          
          {/* Dịp Sử Dụng */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#52b788]" />
              <span>Dịp hoặc Sự Kiện Dự Định Tham Dự:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OCCASIONS_DATA.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setOccasionId(occ.id)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    occasionId === occ.id
                      ? 'bg-[#2d6a4f]/25 border-[#52b788] text-white font-bold'
                      : 'bg-[#12131b] border-[#292b3a] text-gray-400 hover:text-white hover:bg-[#1a1c26]'
                  }`}
                >
                  {occ.name}
                </button>
              ))}
            </div>
          </div>

          {/* Phong Cách Remix */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#e09f3e]" />
              <span>Định Hướng Phong Cách (Remix Vibe):</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {REMIX_STYLES_DATA.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStyleId(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                    styleId === st.id
                      ? 'bg-[#d49b27]/20 border-[#d49b27] text-[#ffd166] font-bold'
                      : 'bg-[#12131b] border-[#292b3a] text-gray-400 hover:text-white'
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Thời Tiết / Địa Điểm */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-[#4a85a0]" />
              <span>Bối Cảnh Thời Tiết / Địa Điểm:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {WEATHER_OPTIONS.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeather(w)}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                    weather === w
                      ? 'bg-[#4a85a0]/25 border-[#4a85a0] text-white font-bold'
                      : 'bg-[#12131b] border-[#292b3a] text-gray-400 hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt người dùng */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Yêu Cầu Bổ Sung (Tùy Chọn):
            </label>
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="VD: Mình thích tone màu trầm nhã nhặn, muốn phối cùng sneaker trắng..."
              className="w-full px-3.5 py-2.5 bg-[#101117] border border-[#2e3144] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#e09f3e]"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-[#9e2a2b] via-[#c94b4b] to-[#e09f3e] text-white shadow-lg shadow-[#9e2a2b]/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Đang Phân Tích & Phối Đồ...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Nhờ AI Stylist Tạo Bản Phối</span>
              </>
            )}
          </button>

        </div>

        {/* Results Section */}
        {recommendation && (
          <div className="pt-4 border-t border-[#292c3c] space-y-4 animate-fadeIn">
            <div className="bg-[#12131b] border border-[#373a50] rounded-2xl p-5 space-y-3 shadow-inner">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#e09f3e] uppercase tracking-wider">
                    Gợi Ý Tối Ưu Từ AI
                  </span>
                  <h4 className="text-base font-bold text-white font-serif mt-0.5">
                    {recommendation.outfitName}
                  </h4>
                </div>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#2d6a4f] hover:bg-[#388663] text-white shadow-md shadow-[#2d6a4f]/40 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Áp Dụng Vào Canvas</span>
                </button>
              </div>

              <p className="text-xs text-gray-300 italic border-l-2 border-[#e09f3e] pl-3 py-0.5">
                "{recommendation.concept}"
              </p>

              {/* Chi tiết trang phục & màu sắc */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="bg-[#191b26] p-2.5 rounded-xl border border-[#2a2c3d]">
                  <span className="text-[10px] text-gray-400 block">Trang phục chính:</span>
                  <span className="font-bold text-white">
                    {TRADITIONAL_COSTUMES.find(c => c.id === recommendation.costumeId)?.name}
                  </span>
                </div>

                <div className="bg-[#191b26] p-2.5 rounded-xl border border-[#2a2c3d]">
                  <span className="text-[10px] text-gray-400 block">Áo ngoài & Áo trong:</span>
                  <span className="font-bold text-[#e09f3e]">
                    {HERITAGE_COLORS.find(c => c.id === recommendation.outerColorId)?.name}
                  </span>
                  <span className="text-gray-400"> / </span>
                  <span className="font-medium text-gray-300">
                    {HERITAGE_COLORS.find(c => c.id === recommendation.innerColorId)?.name}
                  </span>
                </div>

                <div className="bg-[#191b26] p-2.5 rounded-xl border border-[#2a2c3d]">
                  <span className="text-[10px] text-gray-400 block">Kiểu tóc & Makeup:</span>
                  <span className="text-gray-300 font-medium text-[11px] line-clamp-2">
                    {recommendation.hairAndMakeup}
                  </span>
                </div>
              </div>

              {/* Storytelling & Cultural insight */}
              <div className="space-y-2 pt-2 text-xs text-gray-300 leading-relaxed border-t border-[#232535]">
                <div>
                  <strong className="text-white">Ý nghĩa văn hóa: </strong>
                  {recommendation.storytelling}
                </div>
                <div>
                  <strong className="text-white">Vì sao bản phối này phù hợp: </strong>
                  {recommendation.whyItWorks}
                </div>
                <div className="text-[11px] text-[#ffd166] bg-[#d49b27]/10 p-2.5 rounded-xl border border-[#d49b27]/20">
                  <strong>Triết lý Ngũ Hành: </strong> {recommendation.fiveElementsInsight}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
