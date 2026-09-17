import React, { useState } from 'react';
import { OutfitState, CostumeId, HeritageColor, CustomFaceConfig, AIStylistRecommendation } from './types';
import { TRADITIONAL_COSTUMES } from './data/traditionalCostumes';
import { HERITAGE_COLORS } from './data/heritagePalettes';
import { evaluateOutfitCulture } from './data/culturalRules';
import { getSavedLookbooks } from './services/storageService';

// Components
import { Header } from './components/Header';
import { CostumeCanvas } from './components/CostumeCanvas';
import { WardrobePanel } from './components/WardrobePanel';
import { ColorPalettePicker } from './components/ColorPalettePicker';
import { AccessorySelector } from './components/AccessorySelector';
import { CulturalScoreCard } from './components/CulturalScoreCard';
import { AIStylistModal } from './components/AIStylistModal';
import { FaceFitterModal } from './components/FaceFitterModal';
import { CostumeExplorer } from './components/CostumeExplorer';
import { LookbookModal } from './components/LookbookModal';
import { CompareModal } from './components/CompareModal';
import { SavedLookbooks } from './components/SavedLookbooks';

import { Shirt, Palette, Sparkles, Eye } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'studio' | 'explorer' | 'saved'>('studio');
  const [studioSubTab, setStudioSubTab] = useState<'wardrobe' | 'colors' | 'accessories'>('wardrobe');

  // Mobile scroll-to-canvas pill
  const [showScrollToCanvas, setShowScrollToCanvas] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollToCanvas(true);
      } else {
        setShowScrollToCanvas(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToCanvas = () => {
    const el = document.getElementById('costume-canvas-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Modals state
  const [isAIStylistOpen, setIsAIStylistOpen] = useState(false);
  const [isFaceFitterOpen, setIsFaceFitterOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Gemini API Key (lưu trong localStorage để người dùng không phải nhập lại)
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key_custom') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const handleUpdateApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key_custom', key);
  };

  // Saved Lookbooks
  const [savedLookbooks, setSavedLookbooks] = useState(() => getSavedLookbooks());

  const refreshSavedLookbooks = () => {
    setSavedLookbooks(getSavedLookbooks());
  };

  // Outfit State chính
  const [outfit, setOutfit] = useState<OutfitState>({
    costumeId: 'ngu_than_chen',
    gender: 'female',
    outerColor: HERITAGE_COLORS.find(c => c.id === 'cham_tham') || HERITAGE_COLORS[1],
    innerColor: HERITAGE_COLORS.find(c => c.id === 'trang_nga') || HERITAGE_COLORS[4],
    bottomColor: HERITAGE_COLORS.find(c => c.id === 'trang_nga') || HERITAGE_COLORS[4],
    bottomType: 'pant_loose',
    selectedAccessories: ['sneakers_trang', 'tui_tote_dong_ho'],
    occasionId: 'ky_yeu',
    remixStyleId: 'minimalist',
    customFace: undefined
  });

  // Current Costume object
  const currentCostume = TRADITIONAL_COSTUMES.find(c => c.id === outfit.costumeId) || TRADITIONAL_COSTUMES[0];

  // Live Cultural Score
  const currentScore = evaluateOutfitCulture(outfit);

  // Handlers
  const handleCostumeChange = (costumeId: CostumeId) => {
    const target = TRADITIONAL_COSTUMES.find(c => c.id === costumeId);
    if (!target) return;

    // Load default colors for that costume if wanted
    const outer = HERITAGE_COLORS.find(c => c.id === target.defaultColors.outer) || outfit.outerColor;
    const inner = HERITAGE_COLORS.find(c => c.id === target.defaultColors.inner) || outfit.innerColor;
    const bottom = HERITAGE_COLORS.find(c => c.id === target.defaultColors.bottom) || outfit.bottomColor;

    setOutfit(prev => ({
      ...prev,
      costumeId,
      outerColor: outer,
      innerColor: inner,
      bottomColor: bottom
    }));
  };

  const handleColorSelect = (target: 'outer' | 'inner' | 'bottom', color: HeritageColor) => {
    setOutfit(prev => ({
      ...prev,
      [target === 'outer' ? 'outerColor' : target === 'inner' ? 'innerColor' : 'bottomColor']: color
    }));
  };

  const handleToggleAccessory = (id: string) => {
    setOutfit(prev => {
      const exists = prev.selectedAccessories.includes(id);
      const next = exists
        ? prev.selectedAccessories.filter(a => a !== id)
        : [...prev.selectedAccessories, id];
      return { ...prev, selectedAccessories: next };
    });
  };

  const handleClearAccessories = () => {
    setOutfit(prev => ({ ...prev, selectedAccessories: [] }));
  };

  // Phối Ngẫu Hứng
  const handleRandomize = () => {
    const randomCostume = TRADITIONAL_COSTUMES[Math.floor(Math.random() * TRADITIONAL_COSTUMES.length)];
    const randomOuter = HERITAGE_COLORS[Math.floor(Math.random() * HERITAGE_COLORS.length)];
    const randomInner = HERITAGE_COLORS[Math.floor(Math.random() * HERITAGE_COLORS.length)];
    const randomBottom = HERITAGE_COLORS[Math.floor(Math.random() * HERITAGE_COLORS.length)];

    const sampleAccessories = ['sneakers_trang', 'chelsea_boots', 'kinh_ram_retro', 'mu_beret', 'tui_tote_dong_ho', 'quat_xep_gam', 'khan_dong'];
    const shuffled = [...sampleAccessories].sort(() => 0.5 - Math.random());
    const randomAccs = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);

    setOutfit(prev => ({
      ...prev,
      costumeId: randomCostume.id,
      outerColor: randomOuter,
      innerColor: randomInner,
      bottomColor: randomBottom,
      selectedAccessories: randomAccs
    }));
  };

  // Áp dụng gợi ý từ AI Stylist
  const handleApplyAIRec = (rec: AIStylistRecommendation) => {
    const outer = HERITAGE_COLORS.find(c => c.id === rec.outerColorId) || outfit.outerColor;
    const inner = HERITAGE_COLORS.find(c => c.id === rec.innerColorId) || outfit.innerColor;
    const bottom = HERITAGE_COLORS.find(c => c.id === rec.bottomColorId) || outfit.bottomColor;

    setOutfit(prev => ({
      ...prev,
      costumeId: rec.costumeId,
      outerColor: outer,
      innerColor: inner,
      bottomColor: bottom,
      bottomType: rec.bottomType,
      selectedAccessories: rec.accessoryIds
    }));

    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-[#f4efe6] flex flex-col font-sans selection:bg-[#c94b4b] selection:text-white">
      
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAIStylist={() => setIsAIStylistOpen(true)}
        onOpenFaceFitter={() => setIsFaceFitterOpen(true)}
        savedCount={savedLookbooks.length}
        apiKey={apiKey}
        setApiKey={handleUpdateApiKey}
        hasCustomFace={!!outfit.customFace}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pb-28 md:pb-8">
        
        {/* TAB 1: PHÒNG THỬ ĐỒ (STUDIO) */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Cột Trái (lg:col-span-5): Canvas Thử Đồ Vector Tương Tác & Ghép Mặt */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <CostumeCanvas
                outfit={outfit}
                costume={currentCostume}
                onGenderChange={(g) => setOutfit(prev => ({ ...prev, gender: g }))}
                onRandomize={handleRandomize}
                onOpenCompare={() => setIsCompareOpen(true)}
                onOpenLookbook={() => setIsLookbookOpen(true)}
                onOpenFaceFitter={() => setIsFaceFitterOpen(true)}
                onSaveGeneratedLook={(url) => setOutfit(prev => ({ ...prev, generatedLookUrl: url }))}
                onSetCustomFace={(faceConfig) => setOutfit(prev => ({ ...prev, customFace: faceConfig }))}
                onToggleAccessory={handleToggleAccessory}
              />
            </div>

            {/* Cột Phải (lg:col-span-7): Bộ Điều Khiển Phối Đồ & Cultural Guardian */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              
              {/* Studio Sub-Navigation Tabs */}
              <div className="flex bg-[#161722] p-1.5 rounded-2xl border border-[#2b2e40] shadow-sm">
                <button
                  onClick={() => setStudioSubTab('wardrobe')}
                  className={`flex-1 min-h-[44px] py-2.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                    studioSubTab === 'wardrobe'
                      ? 'bg-gradient-to-r from-[#9e2a2b] to-[#c94b4b] text-white shadow-md shadow-[#9e2a2b]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Dòng Cổ Phục & Dịp</span>
                  <span className="sm:hidden">Cổ Phục</span>
                </button>

                <button
                  onClick={() => setStudioSubTab('colors')}
                  className={`flex-1 min-h-[44px] py-2.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                    studioSubTab === 'colors'
                      ? 'bg-gradient-to-r from-[#9e2a2b] to-[#c94b4b] text-white shadow-md shadow-[#9e2a2b]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Cổ Sắc & Ngũ Hành</span>
                  <span className="sm:hidden">Cổ Sắc</span>
                </button>

                <button
                  onClick={() => setStudioSubTab('accessories')}
                  className={`flex-1 min-h-[44px] py-2.5 px-1 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                    studioSubTab === 'accessories'
                      ? 'bg-gradient-to-r from-[#9e2a2b] to-[#c94b4b] text-white shadow-md shadow-[#9e2a2b]/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Phụ Kiện Remix</span>
                  <span className="sm:hidden">Phụ Kiện</span>
                </button>
              </div>

              {/* Sub Tab Contents */}
              <div className="bg-[#161722] border border-[#2b2e40] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
                {studioSubTab === 'wardrobe' && (
                  <WardrobePanel
                    outfit={outfit}
                    onCostumeChange={handleCostumeChange}
                    onOccasionChange={(occId) => setOutfit(prev => ({ ...prev, occasionId: occId }))}
                    onRemixStyleChange={(styleId) => setOutfit(prev => ({ ...prev, remixStyleId: styleId }))}
                    onBottomTypeChange={(bottomType) => setOutfit(prev => ({ ...prev, bottomType }))}
                  />
                )}

                {studioSubTab === 'colors' && (
                  <ColorPalettePicker
                    outerColor={outfit.outerColor}
                    innerColor={outfit.innerColor}
                    bottomColor={outfit.bottomColor}
                    onColorSelect={handleColorSelect}
                  />
                )}

                {studioSubTab === 'accessories' && (
                  <AccessorySelector
                    selectedAccessories={outfit.selectedAccessories}
                    onToggleAccessory={handleToggleAccessory}
                    onClearAccessories={handleClearAccessories}
                  />
                )}
              </div>

              {/* Cultural Guardian Card: Thẩm định văn hóa & Lời khuyên di sản */}
              <CulturalScoreCard
                score={currentScore}
                onOpenExplorer={() => setActiveTab('explorer')}
              />

            </div>

          </div>
        )}

        {/* TAB 2: BÁCH KHOA CỔ PHỤC (EXPLORER) */}
        {activeTab === 'explorer' && (
          <CostumeExplorer
            onSelectToTryOn={(costumeId) => {
              handleCostumeChange(costumeId);
              setActiveTab('studio');
            }}
          />
        )}

        {/* TAB 3: BỘ SƯU TẬP LOOKBOOK (SAVED) */}
        {activeTab === 'saved' && (
          <SavedLookbooks
            lookbooks={savedLookbooks}
            onLoadOutfit={(savedOutfit) => {
              setOutfit(savedOutfit);
              setActiveTab('studio');
            }}
            onDeleteLookbook={(id) => {
              const updated = savedLookbooks.filter(lb => lb.id !== id);
              localStorage.setItem('viet_costume_customizer_lookbooks_v1', JSON.stringify(updated));
              setSavedLookbooks(updated);
            }}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#232534] bg-[#0b0c10] py-6 px-4 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1 text-gray-400 font-semibold">
            <span>Việt Phục Remix</span> — <span>Giao Thoa Cổ Phong & Hơi Thở Gen Z</span>
          </p>
          <p className="text-[11px] text-gray-500">
            Tôn trọng quy chuẩn Hữu Nhậm, Ngũ Thường & Tinh hoa Di sản Văn hóa Việt Nam
          </p>
        </div>
      </footer>

      {/* --- CÁC MODALS TƯƠNG TÁC --- */}

      {/* 1. AI Stylist Modal */}
      {isAIStylistOpen && (
        <AIStylistModal
          currentOccasionId={outfit.occasionId}
          currentStyleId={outfit.remixStyleId}
          apiKey={apiKey}
          onApplyRecommendation={handleApplyAIRec}
          onClose={() => setIsAIStylistOpen(false)}
        />
      )}

      {/* 2. Ghép Mặt Chân Dung Modal */}
      {isFaceFitterOpen && (
        <FaceFitterModal
          currentFace={outfit.customFace}
          costume={currentCostume}
          outfit={outfit}
          onSave={(faceConfig?: CustomFaceConfig, generatedLookUrl?: string) => {
            setOutfit(prev => ({ 
              ...prev, 
              customFace: faceConfig,
              generatedLookUrl: generatedLookUrl || prev.generatedLookUrl
            }));
          }}
          onClose={() => setIsFaceFitterOpen(false)}
        />
      )}

      {/* 3. Lookbook Export Card Modal */}
      {isLookbookOpen && (
        <LookbookModal
          outfit={outfit}
          costume={currentCostume}
          score={currentScore}
          onClose={() => setIsLookbookOpen(false)}
          onSavedSuccess={refreshSavedLookbooks}
        />
      )}

      {/* 4. Side-by-Side Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          currentOutfit={outfit}
          currentCostume={currentCostume}
          currentScore={currentScore}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      {/* Floating "Xem Mẫu" Pill on Mobile when scrolled down in Studio */}
      {showScrollToCanvas && activeTab === 'studio' && (
        <button
          onClick={handleScrollToCanvas}
          className="md:hidden fixed bottom-20 right-4 z-40 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#181926]/95 text-white border border-[#e09f3e] shadow-2xl shadow-black/80 backdrop-blur-md active:scale-95 transition-all cursor-pointer animate-fadeIn"
          title="Cuộn nhanh lên xem người mẫu đang mặc thử"
        >
          <Eye className="w-4 h-4 text-[#ffd166]" />
          <span className="text-xs font-bold text-white">Xem Mẫu</span>
        </button>
      )}

    </div>
  );
};
export default App;
