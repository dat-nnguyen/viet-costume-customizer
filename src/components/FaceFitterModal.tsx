import React, { useState, useRef } from 'react';
import { Costume, OutfitState, CustomFaceConfig } from '../types';
import { synthesizeCostumePortrait } from '../services/imageSynthesizer';
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  Check, 
  Trash2, 
  ZoomIn, 
  Move, 
  RotateCw, 
  Sun,
  Sparkles,
  Loader2,
  Wand2
} from 'lucide-react';

interface FaceFitterModalProps {
  currentFace?: CustomFaceConfig;
  costume: Costume;
  outfit: OutfitState;
  onSave: (config?: CustomFaceConfig, generatedLookUrl?: string) => void;
  onClose: () => void;
}

// 4 Người mẫu chân dung Gen Z Việt Nam chuẩn mực, sắc nét và hài hòa
const PRESET_MODELS = [
  {
    id: 'preset_female_hn',
    name: 'Nữ Sinh Hà Nội',
    sub: 'Thanh lịch, trong trẻo',
    url: '/models/model_nu_thanh_lich.jpg'
  },
  {
    id: 'preset_male_sg',
    name: 'Nam Sinh Sài Gòn',
    sub: 'Hiện đại, góc cạnh',
    url: '/models/model_nam_goc_canh.jpg'
  },
  {
    id: 'preset_female_hue',
    name: 'Nét Đẹp Cố Đô',
    sub: 'Dịu dàng, đài các',
    url: '/models/model_nu_co_do.jpg'
  },
  {
    id: 'preset_male_classic',
    name: 'Thanh Niên Thư Sinh',
    sub: 'Nho nhã, trí thức',
    url: '/models/model_nam_thu_sinh.jpg'
  }
];

export const FaceFitterModal: React.FC<FaceFitterModalProps> = ({
  currentFace,
  costume,
  outfit,
  onSave,
  onClose
}) => {
  const [imageUrl, setImageUrl] = useState<string>(
    currentFace?.imageUrl || PRESET_MODELS[0].url
  );
  const [scale, setScale] = useState<number>(currentFace?.scale || 1.15);
  const [offsetX, setOffsetX] = useState<number>(currentFace?.offsetX || 0);
  const [offsetY, setOffsetY] = useState<number>(currentFace?.offsetY || 0);
  const [rotation, setRotation] = useState<number>(currentFace?.rotation || 0);
  const [brightness, setBrightness] = useState<number>(currentFace?.brightness || 100);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(outfit.generatedLookUrl || null);
  const [previewTab, setPreviewTab] = useState<'calibrate' | 'ai_result'>('calibrate');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sinh ảnh tổng hợp AI với khuôn mặt đã chọn
  const handleGenerateAILook = async (customImg?: string) => {
    setIsGenerating(true);
    try {
      const generated = await synthesizeCostumePortrait({
        costume,
        outfit,
        faceImageUrl: customImg || imageUrl,
        faceScale: scale,
        faceOffsetX: offsetX,
        faceOffsetY: offsetY,
        faceRotation: rotation,
        faceBrightness: brightness
      });
      setGeneratedPreview(generated);
      setPreviewTab('ai_result');
    } catch (err) {
      console.warn('Lỗi khi tổng hợp ảnh AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (typeof event.target?.result === 'string') {
        const uploadedUrl = event.target.result;
        setImageUrl(uploadedUrl);
        setScale(1.15);
        setOffsetX(0);
        setOffsetY(0);
        setRotation(0);
        setBrightness(100);
        // Tự động kích hoạt AI synthesis ngay khi người dùng upload ảnh
        await handleGenerateAILook(uploadedUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    onSave({
      imageUrl,
      scale,
      offsetX,
      offsetY,
      rotation,
      brightness
    }, generatedPreview || undefined);
    onClose();
  };

  const handleRemove = () => {
    onSave(undefined, undefined);
    onClose();
  };

  const handleReset = () => {
    setScale(1.15);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setBrightness(100);
    setGeneratedPreview(null);
    setPreviewTab('calibrate');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#14151f] border border-[#2c2f42] rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252838]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center text-white shadow-md shadow-[#2d6a4f]/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Ghép Mặt & Tạo Ảnh AI Cổ Phục</h3>
              <p className="text-xs text-gray-400">
                Tải ảnh selfie của bạn để AI tự động render ảnh bạn mặc cổ phục này
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1.5 rounded-xl hover:bg-[#202230] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Main Grid: Left Preview & Right Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left Column: Live Frame Preview OR Generated AI Photo */}
          <div className="flex flex-col items-center justify-center bg-[#0c0d14] border border-[#232536] rounded-2xl p-5 relative overflow-hidden">
            
            {/* Switch Tabs between Calibration and AI Result */}
            <div className="flex bg-[#161824] p-1 rounded-xl border border-[#2b2f42] text-[11px] font-semibold mb-3 w-full">
              <button
                onClick={() => setPreviewTab('calibrate')}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  previewTab === 'calibrate'
                    ? 'bg-[#252838] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Căn Chỉnh Mặt
              </button>
              <button
                onClick={() => setPreviewTab('ai_result')}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  previewTab === 'ai_result'
                    ? 'bg-[#e09f3e] text-[#090a0f] font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Ảnh AI Tạo</span>
              </button>
            </div>

            {previewTab === 'calibrate' ? (
              <div className="relative w-56 h-72 rounded-2xl bg-[#08080c] border border-[#2f3246] flex items-center justify-center overflow-hidden shadow-inner">
                {/* Mask Oval Preview */}
                <div className="relative w-36 h-48 rounded-full border-2 border-dashed border-[#e09f3e] overflow-hidden shadow-2xl">
                  <img
                    src={imageUrl}
                    alt="Face preview"
                    className="w-full h-full object-cover transition-transform"
                    style={{
                      transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`,
                      filter: `brightness(${brightness}%)`
                    }}
                  />
                </div>

                {/* Lớp khung viền khăn đóng & cổ áo truyền thống */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 224 288" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M68 44 Q112 30 156 44 L152 64 Q112 50 72 64 Z" fill="#181920" stroke="#e09f3e" strokeWidth="1.5" opacity="0.9" />
                  <path d="M74 212 Q112 232 150 212 L158 265 L66 265 Z" fill="#c94b4b" stroke="#ffd166" strokeWidth="1.5" opacity="0.85" />
                  <circle cx="112" cy="225" r="3.5" fill="#ffd166" />
                </svg>

                <div className="absolute bottom-2 text-[10px] text-amber-300 bg-black/70 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-amber-300/30 font-medium">
                  Căn mắt, mũi, cằm vào giữa oval
                </div>
              </div>
            ) : (
              <div className="relative w-56 h-72 rounded-2xl bg-[#08080c] border border-[#2f3246] flex items-center justify-center overflow-hidden shadow-inner">
                {generatedPreview ? (
                  <img
                    src={generatedPreview}
                    alt="AI Generated Look"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <p className="text-xs text-gray-400">Chưa tạo ảnh AI</p>
                    <button
                      onClick={() => handleGenerateAILook()}
                      disabled={isGenerating}
                      className="text-xs text-[#e09f3e] underline font-semibold"
                    >
                      Bấm vào đây để tạo ngay
                    </button>
                  </div>
                )}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-[#e09f3e] animate-spin" />
                    <span className="text-[11px] text-amber-200 font-medium">AI đang render ảnh...</span>
                  </div>
                )}
              </div>
            )}

            {/* AI Generate Button & Upload Button */}
            <div className="w-full mt-4 space-y-2">
              <button
                onClick={() => handleGenerateAILook()}
                disabled={isGenerating}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d49b27] via-[#e09f3e] to-[#c94b4b] hover:brightness-110 text-[#090a0f] flex items-center justify-center gap-2 shadow-lg shadow-[#e09f3e]/25 transition-all cursor-pointer active:scale-98"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang Tạo Ảnh AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>AI Render Ảnh Kèm Mặt Bạn</span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-[#212434] hover:bg-[#2b2f44] text-white border border-[#35394f] flex items-center justify-center gap-2 transition-all hover:border-[#e09f3e]/40 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#e09f3e]" />
                <span>Tải Ảnh Chân Dung Của Bạn</span>
              </button>
            </div>
          </div>

          {/* Right Column: Presets & Fine-Tuning Sliders */}
          <div className="space-y-4">
            
            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#e09f3e]" />
                <span>Người mẫu mẫu chất lượng cao:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_MODELS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setImageUrl(preset.url);
                      handleReset();
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition-all ${
                      imageUrl === preset.url
                        ? 'bg-[#e09f3e]/15 border-[#e09f3e] text-white shadow-sm'
                        : 'bg-[#0f1017] border-[#252736] text-gray-400 hover:text-white hover:bg-[#171822]'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-white">{preset.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{preset.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 bg-[#0d0e14] p-4 rounded-2xl border border-[#222434]">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold text-white">Tinh Chỉnh Vị Trí</span>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-[#e09f3e] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Đặt lại
                </button>
              </div>

              {/* Zoom */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Thu Phóng</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.2"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-[#e09f3e] cursor-pointer"
                />
              </div>

              {/* Offset Y */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Lên / Xuống</span>
                  <span>{offsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={offsetY}
                  onChange={(e) => setOffsetY(parseInt(e.target.value))}
                  className="w-full accent-[#e09f3e] cursor-pointer"
                />
              </div>

              {/* Offset X */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Trái / Phải</span>
                  <span>{offsetX}px</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={offsetX}
                  onChange={(e) => setOffsetX(parseInt(e.target.value))}
                  className="w-full accent-[#e09f3e] cursor-pointer"
                />
              </div>

              {/* Rotation */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> Xoay Góc Mặt</span>
                  <span>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-[#e09f3e] cursor-pointer"
                />
              </div>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                  <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Độ Sáng Khớp Ánh Sáng Ảnh</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#e09f3e] cursor-pointer"
                />
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#232536]">
          {currentFace ? (
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Gỡ Bỏ Ảnh Ghép</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1e202e] hover:bg-[#282a3c] text-gray-300 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2d6a4f] to-[#52b788] text-white shadow-md shadow-[#2d6a4f]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mặc Thử Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
