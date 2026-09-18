export type CostumeId = 
  | 'ngu_than_chen'      // Áo ngũ thân tay chẽn
  | 'ao_tac'             // Áo ngũ thân tay thụng (Áo Tấc)
  | 'nhat_binh'          // Áo Nhật Bình cung đình
  | 'giao_linh'          // Áo Giao Lĩnh thời Lê - Lý - Trần
  | 'tu_than'            // Áo Tứ Thân & Yếm Bắc Bộ
  | 'ba_ba'              // Áo Bà Ba Nam Bộ
  | 'doi_kham'           // Áo Đối Khâm
  | 'ao_dai_tan_thoi';   // Áo Dài Tân Thời / Hiện Đại

export type FiveElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface HeritageColor {
  id: string;
  name: string;
  vietnameseName: string;
  hex: string;
  element: FiveElement;
  meaning: string;
  textColor: string;
  category: 'chinh_sac' | 'gian_sac'; // Chính sắc (Ngũ sắc nguyên bản) hoặc Gian sắc (Pha trộn thanh nhã)
}

export interface Costume {
  id: CostumeId;
  name: string;
  subTitle: string;
  dynasty: string;
  category: 'Lễ Phục Trang Trọng' | 'Thường Phục Thanh Lịch' | 'Dân Gian Bản Địa' | 'Giao Thoa Đương Đại';
  collarType: string;       // Lập lĩnh (cổ đứng), Giao lĩnh, Nhật bình (chữ nhật), Cổ yếm...
  sleeveType: string;       // Tay chẽn, Tay thụng, Tay búp sen...
  flaps: string;            // 5 thân (Ngũ thân), 4 thân (Tứ thân), 2 thân
  buttons: string;          // 5 khuy cài tượng trưng Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín)
  material: string;         // Lụa Vạn Phúc, gấm sa, the lót, tơ tằm, đũi Nam Cao
  historicalStory: string;  // Câu chuyện & bối cảnh lịch sử
  philosophy: string;       // Triết lý đạo làm người & mỹ học
  culturalRules: string[];  // Lưu ý di sản để không làm sai lệch
  imageUrl: string;         // Ảnh lookbook thực tế độ nét cao
  defaultColors: {
    outer: string;
    inner: string;
    bottom: string;
  };
}

export type AccessoryType = 'headwear' | 'footwear' | 'eyewear' | 'bag' | 'jewelry' | 'handheld';

export interface Accessory {
  id: string;
  name: string;
  subName: string;
  category: 'traditional' | 'remix';
  type: AccessoryType;
  description: string;
  icon: string;
  culturalNote?: string;
  isRemixGenZ: boolean;
}

export interface Occasion {
  id: string;
  name: string;
  description: string;
  vibe: string;
  icon: string;
  formality: 'formal' | 'casual' | 'festival' | 'photoshoot' | 'academic';
}

export interface RemixStyle {
  id: string;
  name: string;
  description: string;
  tagline: string;
  icon: string;
}

export interface CustomFaceConfig {
  imageUrl: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  brightness: number;
}

export interface OutfitState {
  costumeId: CostumeId;
  gender: 'female' | 'male' | 'neutral';
  outerColor: HeritageColor;
  innerColor: HeritageColor;
  bottomColor: HeritageColor;
  bottomType: 'pant_loose' | 'skirt_silk' | 'trousers_modern' | 'skirt_pleated';
  selectedAccessories: string[]; // ids
  occasionId: string;
  remixStyleId: string;
  customFace?: CustomFaceConfig;
  generatedLookUrl?: string; // Ảnh lookbook đã tổng hợp AI độ nét cao
}

export interface CulturalScore {
  score: number; // 0 - 100
  badge: string;
  level: 'sacred' | 'creative' | 'warning';
  title: string;
  summary: string;
  strengths: string[];
  tips: string[];
}

export interface AIStylistRecommendation {
  outfitName: string;
  concept: string;
  costumeId: CostumeId;
  outerColorId: string;
  innerColorId: string;
  bottomColorId: string;
  bottomType: 'pant_loose' | 'skirt_silk' | 'trousers_modern' | 'skirt_pleated';
  accessoryIds: string[];
  hairAndMakeup: string;
  storytelling: string;
  whyItWorks: string;
  fiveElementsInsight: string;
}

export interface SavedLookbook {
  id: string;
  title: string;
  createdAt: string;
  outfit: OutfitState;
  score: CulturalScore;
  aiNote?: string;
}

export interface ChatActionPayload {
  costumeId?: CostumeId;
  outerColorId?: string;
  innerColorId?: string;
  bottomColorId?: string;
  accessories?: string[];
  name?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  actionPayload?: ChatActionPayload;
}
