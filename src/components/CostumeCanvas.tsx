import React, { useState, useRef, useEffect } from 'react';
import { OutfitState, Costume } from '../types';
import { synthesizeCostumePortrait } from '../services/imageSynthesizer';
import { recolorCostumePhoto } from '../services/photoRecolorService';
import { ACCESSORIES_DATA } from '../data/accessoriesData';
import { 
  Shuffle, 
  Download, 
  Columns, 
  Sparkles, 
  Camera, 
  Layers, 
  Image as ImageIcon, 
  Info, 
  ZoomIn, 
  Wand2, 
  Loader2,
  Upload,
  CheckCircle2,
  X
} from 'lucide-react';

interface CostumeCanvasProps {
  outfit: OutfitState;
  costume: Costume;
  onGenderChange: (gender: 'female' | 'male' | 'neutral') => void;
  onRandomize: () => void;
  onOpenCompare: () => void;
  onOpenLookbook: () => void;
  onOpenFaceFitter: () => void;
  onSaveGeneratedLook?: (url: string) => void;
  onSetCustomFace?: (faceConfig: any) => void;
  onToggleAccessory?: (accessoryId: string) => void;
}

export const CostumeCanvas: React.FC<CostumeCanvasProps> = ({
  outfit,
  costume,
  onRandomize,
  onOpenCompare,
  onOpenLookbook,
  onOpenFaceFitter,
  onSaveGeneratedLook,
  onSetCustomFace,
  onToggleAccessory
}) => {
  const [viewMode, setViewMode] = useState<'editorial' | 'schema'>('editorial');
  const [zoomMode, setZoomMode] = useState<'full' | 'close' | 'waist'>('full');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showGeneratedLook, setShowGeneratedLook] = useState<boolean>(!!outfit.generatedLookUrl);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [generationSuccessToast, setGenerationSuccessToast] = useState<boolean>(false);

  // Kiểm tra xem trang phục có đang sử dụng màu sắc nguyên bản (default heritage colors) không
  const isDefaultColors = 
    outfit.outerColor.id === costume.defaultColors.outer &&
    outfit.bottomColor.id === costume.defaultColors.bottom;

  // Ảnh được chỉnh sửa màu sắc trực tiếp trên thớ vải (Pixel-Level Recolor)
  const [recoloredPhotoUrl, setRecoloredPhotoUrl] = useState<string>(costume.imageUrl);

  const containerRef = useRef<HTMLDivElement>(null);
  const directUploadRef = useRef<HTMLInputElement>(null);

  // 1. Khi đổi sang trang phục khác, chuyển ngay lập tức về ảnh thực tế của trang phục mới (0ms độ trễ)
  useEffect(() => {
    setRecoloredPhotoUrl(costume.imageUrl);
  }, [costume.id, costume.imageUrl]);

  // 2. Chỉ chạy thuật toán biến đổi màu khi người dùng thực sự chọn màu tùy chỉnh khác màu gốc
  useEffect(() => {
    if (isDefaultColors) {
      setRecoloredPhotoUrl(costume.imageUrl);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      recolorCostumePhoto(costume.imageUrl, outfit.outerColor.hex, outfit.bottomColor.hex, costume.id)
        .then(url => {
          if (isMounted) {
            setRecoloredPhotoUrl(url);
          }
        })
        .catch(err => {
          console.warn('Lỗi xử lý màu sắc ảnh trực tiếp:', err);
        });
    }, 40);

    return () => { 
      isMounted = false;
      clearTimeout(timer);
    };
  }, [costume.imageUrl, outfit.outerColor.hex, outfit.bottomColor.hex, costume.id, isDefaultColors]);

  // Tự động chuyển về chế độ Live Realtime khi người dùng đổi màu sắc, trang phục hoặc phụ kiện
  const lastCustomKeyRef = useRef(`${costume.id}-${outfit.outerColor.id}-${outfit.innerColor.id}-${outfit.bottomColor.id}-${outfit.selectedAccessories.join(',')}`);

  useEffect(() => {
    const currentKey = `${costume.id}-${outfit.outerColor.id}-${outfit.innerColor.id}-${outfit.bottomColor.id}-${outfit.selectedAccessories.join(',')}`;
    if (lastCustomKeyRef.current !== currentKey) {
      lastCustomKeyRef.current = currentKey;
      setShowGeneratedLook(false);
    }
  }, [costume.id, outfit.outerColor.id, outfit.innerColor.id, outfit.bottomColor.id, outfit.selectedAccessories]);

  // Sinh ảnh AI Lookbook hoàn chỉnh với mặt và trang phục hiện tại
  const handleGenerateAILook = async (customFaceUrl?: string) => {
    setIsGeneratingAI(true);
    try {
      const generated = await synthesizeCostumePortrait({
        costume,
        outfit,
        faceImageUrl: customFaceUrl || outfit.customFace?.imageUrl
      });
      if (onSaveGeneratedLook) {
        onSaveGeneratedLook(generated);
      }
      setShowGeneratedLook(true);
      setGenerationSuccessToast(true);
      setTimeout(() => setGenerationSuccessToast(false), 3500);
    } catch (err) {
      console.warn('Lỗi khi tạo ảnh AI:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Upload ảnh mặt trực tiếp từ Canvas và tự động generate ảnh mới ngay lập tức
  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (typeof event.target?.result === 'string') {
        const uploadedUrl = event.target.result;
        const newFaceConfig = {
          imageUrl: uploadedUrl,
          scale: 1.15,
          offsetX: 0,
          offsetY: 0,
          rotation: 0,
          brightness: 100
        };
        if (onSetCustomFace) {
          onSetCustomFace(newFaceConfig);
        }
        await handleGenerateAILook(uploadedUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Tải trực tiếp ảnh chất lượng cao về máy
  const handleDownloadImage = () => {
    const a = document.createElement('a');
    a.href = (showGeneratedLook && outfit.generatedLookUrl) ? outfit.generatedLookUrl : recoloredPhotoUrl;
    a.download = `viet-phuc-${costume.id}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Lấy chi tiết các phụ kiện đang chọn
  const activeAccessoriesDetail = outfit.selectedAccessories
    .map(id => ACCESSORIES_DATA.find(a => a.id === id))
    .filter(Boolean);

  return (
    <div id="costume-canvas-container" className="double-bezel-outer p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] shadow-2xl transition-all">
      <div 
        ref={containerRef}
        className="double-bezel-inner rounded-[1.25rem] sm:rounded-[calc(2rem-0.5rem)] p-3 sm:p-5 relative overflow-hidden flex flex-col items-center justify-between min-h-[480px] sm:min-h-[640px]"
      >
        {/* Ambient Warm Backlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-b from-[#c94b4b]/15 via-[#e09f3e]/8 to-transparent blur-3xl pointer-events-none" />

        {/* Hidden Direct File Input */}
        <input
          ref={directUploadRef}
          type="file"
          accept="image/*"
          onChange={handleDirectFileUpload}
          className="hidden"
        />

        {/* Top Floating Controls */}
        <div className="w-full flex items-center justify-between gap-2 z-20">
          
          {/* Badge Trang Phục & Triều Đại */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 mr-1">
            <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-[#1a1c27] border border-[#2d3145] text-white flex items-center gap-1.5 sm:gap-2 shadow-sm whitespace-nowrap flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#e09f3e] animate-pulse flex-shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-none">{costume.name}</span>
            </span>
            <span 
              className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#14151f] text-gray-400 border border-[#262838] whitespace-nowrap truncate max-w-[150px] lg:max-w-[180px]"
              title={costume.dynasty}
            >
              {costume.dynasty}
            </span>
          </div>

          {/* Toggle View: Người Mẫu Thật vs. Sơ Đồ Lớp Áo */}
          <div className="flex bg-[#161824] p-1 rounded-xl border border-[#2b2f42] text-xs flex-shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('editorial')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                viewMode === 'editorial'
                  ? 'bg-[#c94b4b] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Người Mẫu Thật</span>
              <span className="sm:hidden text-[11px]">Mẫu Thật</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('schema')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                viewMode === 'schema'
                  ? 'bg-[#c94b4b] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">Sơ Đồ Cấu Trúc</span>
              <span className="sm:hidden text-[11px]">Sơ Đồ</span>
            </button>
          </div>

        </div>

        {/* Center Canvas Stage: Photorealistic Editorial Model */}
        <div className="relative flex-1 w-full max-w-[440px] aspect-[3/4] flex items-center justify-center my-4 rounded-2xl overflow-hidden border border-[#252838] shadow-2xl bg-[#0d0e14]">
          
          {viewMode === 'editorial' ? (
            /* === CHẾ ĐỘ NGƯỜI MẪU THẬT STUDIO (ẢNH CHỤP THỰC TẾ CHỈNH SỬA MÀU TRỰC TIẾP) === */
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center group bg-[#08090d]">
              
              {/* Vùng Render Ảnh Trang Phục Thật */}
              <div 
                className="w-full h-full relative transition-transform duration-700 ease-out"
                style={{
                  transform: zoomMode === 'close' 
                    ? 'scale(1.75) translateY(18%)' 
                    : zoomMode === 'waist'
                      ? 'scale(1.5) translateY(-5%)'
                      : 'scale(1) translateY(0)',
                  transformOrigin: 'top center'
                }}
              >
                {/* 1. BỨC ẢNH GỐC ĐƯỢC CHỈNH SỬA MÀU SẮC TRỰC TIẾP (KHÔNG DÙNG OVERLAY ĐÈ) */}
                <img
                  src={(showGeneratedLook && outfit.generatedLookUrl) ? outfit.generatedLookUrl : recoloredPhotoUrl}
                  alt={costume.name}
                  className="w-full h-full object-cover object-top select-none transition-all duration-300"
                  draggable={false}
                />

                {/* 2. Ghép Khuôn Mặt Người Dùng (User Face Swap tự nhiên với viền mờ lông vũ) */}
                {(!showGeneratedLook || !outfit.generatedLookUrl) && outfit.customFace && (
                  <div 
                    className="absolute pointer-events-none"
                    style={{
                      top: '13.2%',
                      left: '50%',
                      zIndex: 20,
                      transform: `translate(-50%, -50%) translate(${outfit.customFace.offsetX * 0.65}px, ${outfit.customFace.offsetY * 0.65}px) rotate(${outfit.customFace.rotation}deg)`,
                    }}
                  >
                    <div 
                      className="relative rounded-full overflow-hidden shadow-2xl"
                      style={{
                        width: `${70 * outfit.customFace.scale}px`,
                        height: `${90 * outfit.customFace.scale}px`,
                        maskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 72%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, rgba(0,0,0,0.85) 72%, transparent 100%)',
                      }}
                    >
                      <img
                        src={outfit.customFace.imageUrl}
                        alt="Khuôn mặt người dùng"
                        className="w-full h-full object-cover object-center"
                        style={{
                          filter: `brightness(${outfit.customFace.brightness}%) contrast(102%) saturate(98%)`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Lớp bóng đổ sàn studio nhẹ nhàng */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#090a0f]/75 via-[#090a0f]/15 to-transparent pointer-events-none" />

              {/* Silk Color Swatch Overlay Indicator */}
              <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2 bg-[#0c0d14]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                <span className="text-[10px] text-gray-300 font-medium">Sắc Lụa:</span>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: outfit.outerColor.hex }}
                    title={`Áo ngoài: ${outfit.outerColor.name}`}
                  />
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: outfit.innerColor.hex }}
                    title={`Cổ lót: ${outfit.innerColor.name}`}
                  />
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: outfit.bottomColor.hex }}
                    title={`Hạ y: ${outfit.bottomColor.name}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#e09f3e] pl-1.5 border-l border-white/20">
                  {outfit.outerColor.name}
                </span>
              </div>

              {/* Toggle giữa Ảnh AI đã tạo vs Chỉnh sửa Realtime */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                {outfit.generatedLookUrl ? (
                  <button
                    onClick={() => setShowGeneratedLook(!showGeneratedLook)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border backdrop-blur-md transition-all flex items-center gap-1.5 shadow-xl cursor-pointer ${
                      showGeneratedLook
                        ? 'bg-[#e09f3e] text-[#090a0f] border-[#ffd166]'
                        : 'bg-[#14151f]/90 text-[#ffd166] border-[#ffd166]/40 hover:bg-[#202230]'
                    }`}
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>{showGeneratedLook ? 'Ảnh AI Đã Tạo (Bấm để sửa Live)' : 'Xem Lại Ảnh AI Đã Tạo'}</span>
                  </button>
                ) : (
                  <div className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-[#2d6a4f]/80 text-[#52b788] border border-[#2d6a4f] flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
                    <span>Live Photo Recolor</span>
                  </div>
                )}
              </div>

              {/* Loading Overlay khi AI đang Render */}
              {isGeneratingAI && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#c94b4b] to-[#e09f3e] flex items-center justify-center shadow-xl shadow-[#e09f3e]/30 mb-3 animate-pulse">
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Đang Dệt Cổ Phục & Tạo Ảnh Chân Dung AI
                  </h4>
                  <p className="text-xs text-amber-200/80 mt-1 max-w-xs">
                    AI đang xử lý sắc lụa {outfit.outerColor.name}, may cấu trúc {costume.name} và gắn kết khuôn mặt của bạn...
                  </p>
                </div>
              )}

              {/* Toast thông báo tạo thành công */}
              {generationSuccessToast && (
                <div className="absolute bottom-16 inset-x-4 z-40 bg-[#2d6a4f]/95 border border-[#52b788] text-white py-2 px-3.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn text-xs">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Đã tạo ảnh AI thành công với khuôn mặt và bản phối của bạn!</span>
                </div>
              )}

              {/* Interactive Cultural Hotspots (Điểm nhấn di sản tương tác) */}
              {zoomMode === 'full' && !showGeneratedLook && (
                <>
                  {/* Hotspot 1: Cổ Áo Lập Lĩnh / Giao Lĩnh */}
                  <div className="absolute top-[21%] left-[48%] -translate-x-1/2 z-30">
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === 'collar' ? null : 'collar')}
                      className="w-6 h-6 rounded-full bg-[#e09f3e] text-[#090a0f] flex items-center justify-center font-bold text-xs shadow-lg shadow-[#e09f3e]/40 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Xem thông tin cổ áo"
                    >
                      ✦
                    </button>
                    {activeHotspot === 'collar' && (
                      <div className="absolute left-8 -top-3 w-56 bg-[#161722]/95 border border-[#e09f3e]/40 backdrop-blur-md p-3 rounded-xl shadow-2xl text-left animate-fadeIn z-40">
                        <span className="text-[10px] font-bold text-[#e09f3e] uppercase tracking-wider block">Cấu Trúc Cổ Áo</span>
                        <p className="text-xs text-white font-medium mt-0.5">{costume.collarType}</p>
                        <p className="text-[11px] text-gray-300 mt-1">Cổ áo ôm kín trang nghiêm, giữ nét khiêm nhường và kín đáo truyền thống.</p>
                      </div>
                    )}
                  </div>

                  {/* Hotspot 2: 5 Khuy Ngũ Thường */}
                  <div className="absolute top-[36%] left-[50%] -translate-x-1/2 z-30">
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === 'buttons' ? null : 'buttons')}
                      className="w-6 h-6 rounded-full bg-[#c94b4b] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-[#c94b4b]/40 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Xem ý nghĩa 5 khuy cài"
                    >
                      5
                    </button>
                    {activeHotspot === 'buttons' && (
                      <div className="absolute left-8 -top-3 w-60 bg-[#161722]/95 border border-[#c94b4b]/40 backdrop-blur-md p-3 rounded-xl shadow-2xl text-left animate-fadeIn z-40">
                        <span className="text-[10px] font-bold text-[#ffd166] uppercase tracking-wider block">Triết Lý 5 Khuy Cài</span>
                        <p className="text-xs text-white font-medium mt-0.5">{costume.buttons}</p>
                        <p className="text-[11px] text-gray-300 mt-1">Tượng trưng cho 5 đức tính làm người: Nhân, Nghĩa, Lễ, Trí, Tín.</p>
                      </div>
                    )}
                  </div>

                  {/* Hotspot 3: Tay Áo & Vạt Hữu */}
                  <div className="absolute top-[48%] left-[28%] z-30">
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === 'sleeve' ? null : 'sleeve')}
                      className="w-6 h-6 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-[#2d6a4f]/40 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Xem kiểu dáng ống tay"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeHotspot === 'sleeve' && (
                      <div className="absolute left-8 -top-3 w-56 bg-[#161722]/95 border border-[#2d6a4f]/40 backdrop-blur-md p-3 rounded-xl shadow-2xl text-left animate-fadeIn z-40">
                        <span className="text-[10px] font-bold text-[#52b788] uppercase tracking-wider block">Ống Tay & Vạt Áo</span>
                        <p className="text-xs text-white font-medium mt-0.5">{costume.sleeveType}</p>
                        <p className="text-[11px] text-gray-300 mt-1">{costume.flaps}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Floating Camera Lens Zoom Controls */}
              <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-[#0c0d16]/90 backdrop-blur-md px-1.5 py-1 rounded-full border border-white/15 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setZoomMode('full')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                    zoomMode === 'full'
                      ? 'bg-[#252838] text-white shadow-sm border border-white/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Xem toàn dáng trang phục"
                >
                  Toàn Thân
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode('close')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 whitespace-nowrap ${
                    zoomMode === 'close'
                      ? 'bg-[#e09f3e] text-[#090a0f] font-bold shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Soi cận cảnh hoa văn & cổ áo"
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>Cổ Áo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode('waist')}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                    zoomMode === 'waist'
                      ? 'bg-[#252838] text-white shadow-sm border border-white/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Soi khuy cài & thân áo"
                >
                  Khuy Cài
                </button>
              </div>

            </div>
          ) : (
            /* === CHẾ ĐỘ SƠ ĐỒ CẤU TRÚC 3 TẦNG === */
            <div className="w-full h-full p-6 flex flex-col justify-between text-left space-y-4 bg-[#11121a]">
              <div>
                <span className="text-xs font-bold text-[#e09f3e] uppercase tracking-wider block">
                  Phân Tích Cấu Trúc Y Phục
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{costume.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{costume.philosophy}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#181924] p-3 rounded-xl border border-[#2a2d3f]">
                  <span className="font-bold text-[#e09f3e] block mb-1">1. Lớp Áo Ngoài (Outer Robe):</span>
                  <p className="text-gray-300 leading-relaxed">
                    Sắc màu: <strong style={{ color: outfit.outerColor.hex }}>{outfit.outerColor.name}</strong> ({outfit.outerColor.element}). Cấu trúc vạt Hữu Nhậm, may ghép 5 thân thể hiện lòng kính phụ mẫu.
                  </p>
                </div>

                <div className="bg-[#181924] p-3 rounded-xl border border-[#2a2d3f]">
                  <span className="font-bold text-[#52b788] block mb-1">2. Lớp Cổ Áo Lót (Inner Collar):</span>
                  <p className="text-gray-300 leading-relaxed">
                    Sắc màu: <strong style={{ color: outfit.innerColor.hex }}>{outfit.innerColor.name}</strong> ({outfit.innerColor.element}). Lộ nhẹ mép trắng ngà tượng trưng cho sự tinh sạch, thuần khiết.
                  </p>
                </div>

                <div className="bg-[#181924] p-3 rounded-xl border border-[#2a2d3f]">
                  <span className="font-bold text-[#c0527b] block mb-1">3. Lớp Hạ Y (Quần / Váy):</span>
                  <p className="text-gray-300 leading-relaxed">
                    Kiểu dáng: {outfit.bottomType === 'pant_loose' ? 'Quần Thụng Lụa Trắng/Đen' : outfit.bottomType === 'skirt_silk' ? 'Chân Váy Quây Cung Đình' : 'Quần Âu Suông Remix'}. Sắc màu: <strong style={{ color: outfit.bottomColor.hex }}>{outfit.bottomColor.name}</strong>.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-[#ffd166] bg-[#d49b27]/10 p-2.5 rounded-xl border border-[#d49b27]/20">
                ✓ Khuyên dùng: Giữ thẳng lưng, khi chắp tay tạo thế trang nghiêm cung kính.
              </div>
            </div>
          )}

        </div>

        {/* SET PHỤ KIỆN ĐANG CHỌN (TỦ ĐỒ REMIX THỜI TRANG, KHÔNG DÙNG OVERLAY HOẠT HÌNH) */}
        {activeAccessoriesDetail.length > 0 && !showGeneratedLook && (
          <div className="w-full bg-[#13141f] border border-[#272a3c] rounded-2xl p-3 mb-3 text-left">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffd166]" />
                <span>Phụ Kiện Đang Phối ({activeAccessoriesDetail.length}):</span>
              </span>
              <span className="text-[10px] text-[#ffd166]">Bấm AI Generate để lên ảnh chụp kèm phụ kiện</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeAccessoriesDetail.map((acc: any) => (
                <div 
                  key={acc.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] bg-[#1a1c2a] border border-[#373b52] text-white shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e09f3e]" />
                  <span className="font-semibold">{acc.name}</span>
                  {acc.isRemixGenZ && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#c94b4b]/25 text-[#ffd166]">Remix</span>
                  )}
                  {onToggleAccessory && (
                    <button
                      onClick={() => onToggleAccessory(acc.id)}
                      className="ml-1 text-gray-400 hover:text-red-400 cursor-pointer"
                      title="Bỏ phụ kiện này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Hardware Control Island */}
        <div className="w-full flex flex-col gap-2.5 pt-3 border-t border-[#232635] z-20">
          
          {/* Hàng 1: Nút Tạo Ảnh AI Nhanh & Tải Ảnh Chân Dung Trực Tiếp */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => directUploadRef.current?.click()}
              className="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d49b27] via-[#e09f3e] to-[#c94b4b] text-[#090a0f] flex items-center justify-center gap-2 shadow-lg shadow-[#e09f3e]/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Tải Ảnh Của Bạn & AI Generate</span>
              <span className="sm:hidden">Tải Ảnh & AI Render</span>
            </button>

            <button
              onClick={() => handleGenerateAILook()}
              disabled={isGeneratingAI}
              className="min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold bg-[#1e202f] hover:bg-[#282a3e] text-[#ffd166] border border-[#e09f3e]/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 flex-shrink-0"
              title="Tổng hợp lại bức ảnh AI với cấu hình trang phục và phụ kiện hiện tại"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Đang Tạo...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#e09f3e]" />
                  <span className="hidden sm:inline">AI Render Lại</span>
                  <span className="sm:hidden">AI Render</span>
                </>
              )}
            </button>
          </div>

          {/* Hàng 2 (Desktop: sm+): 5 nút dàn hàng ngang */}
          <div className="hidden sm:flex items-center justify-between gap-2">
            {/* Nút Phối Ngẫu Hứng */}
            <button
              onClick={onRandomize}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a1c26] hover:bg-[#252838] text-white border border-[#313448] transition-fluid active-tactile cursor-pointer"
              title="Tự động phối ngẫu hứng một bộ trang phục mới"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#e09f3e]" />
              <span>Ngẫu Hứng</span>
            </button>

            {/* Nút Ghép Mặt Chi Tiết */}
            <button
              onClick={onOpenFaceFitter}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-fluid active-tactile cursor-pointer ${
                outfit.customFace
                  ? 'bg-[#2d6a4f]/25 border-[#2d6a4f] text-[#52b788]'
                  : 'bg-[#1a1c26] border-[#313448] text-white hover:border-[#e09f3e]/40'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-[#e09f3e]" />
              <span>{outfit.customFace ? 'Chỉnh Vị Trí Mặt' : 'Chọn Người Mẫu'}</span>
            </button>

            {/* Nút So Sánh */}
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a1c26] hover:bg-[#252838] text-white border border-[#313448] transition-fluid active-tactile cursor-pointer"
              title="So sánh song song: Nguyên Bản vs. Remix Gen Z"
            >
              <Columns className="w-3.5 h-3.5 text-[#52b788]" />
              <span>So Sánh</span>
            </button>

            {/* Nút Xuất Thẻ Lookbook */}
            <button
              onClick={onOpenLookbook}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#9e2a2b] hover:bg-[#b03536] text-white shadow-md shadow-[#9e2a2b]/30 transition-fluid active-tactile cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Xuất Lookbook</span>
            </button>

            {/* Nút Tải Ảnh HD */}
            <button
              onClick={handleDownloadImage}
              className="p-2 rounded-xl bg-[#1a1c26] hover:bg-[#252838] text-gray-400 hover:text-white border border-[#313448] transition-fluid active-tactile cursor-pointer"
              title="Tải ảnh lookbook độ nét cao của bộ trang phục này"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Hàng 2 (Mobile only: <sm): 2 hàng phụ trợ gọn gàng, phím bấm to dễ bấm */}
          <div className="sm:hidden flex flex-col gap-2">
            {/* Hàng 2a: Ngẫu Hứng - Người Mẫu / Ghép Mặt - So Sánh */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={onRandomize}
                className="min-h-[40px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold bg-[#1a1c26] active:bg-[#252838] text-white border border-[#313448]"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#e09f3e]" />
                <span className="text-[11px]">Ngẫu Hứng</span>
              </button>

              <button
                onClick={onOpenFaceFitter}
                className={`min-h-[40px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold border ${
                  outfit.customFace
                    ? 'bg-[#2d6a4f]/25 border-[#2d6a4f] text-[#52b788]'
                    : 'bg-[#1a1c26] border-[#313448] text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#e09f3e]" />
                <span className="text-[11px]">{outfit.customFace ? 'Sửa Mặt' : 'Ghép Mặt'}</span>
              </button>

              <button
                onClick={onOpenCompare}
                className="min-h-[40px] flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-semibold bg-[#1a1c26] active:bg-[#252838] text-white border border-[#313448]"
              >
                <Columns className="w-3.5 h-3.5 text-[#52b788]" />
                <span className="text-[11px]">So Sánh</span>
              </button>
            </div>

            {/* Hàng 2b: Xuất Thẻ Lookbook + Tải Ảnh */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenLookbook}
                className="flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#9e2a2b] active:bg-[#b03536] text-white shadow-md shadow-[#9e2a2b]/30"
              >
                <Sparkles className="w-4 h-4 fill-current text-[#ffd166]" />
                <span>Xuất Thẻ Lookbook Đẹp</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#1a1c26] text-gray-300 active:text-white border border-[#313448]"
                title="Tải ảnh nét cao về máy"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
