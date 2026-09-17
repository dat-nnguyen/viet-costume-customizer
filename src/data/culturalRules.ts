import { OutfitState, CulturalScore } from '../types';
import { TRADITIONAL_COSTUMES } from './traditionalCostumes';
import { getElementHarmonyText } from './heritagePalettes';

export function evaluateOutfitCulture(outfit: OutfitState): CulturalScore {
  const costume = TRADITIONAL_COSTUMES.find(c => c.id === outfit.costumeId);
  const strengths: string[] = [];
  const tips: string[] = [];
  let score = 95; // Base high score

  const hasSneakers = outfit.selectedAccessories.includes('sneakers_trang');
  const hasBoots = outfit.selectedAccessories.includes('chelsea_boots');
  const hasRetroGlasses = outfit.selectedAccessories.includes('kinh_ram_retro');
  const hasKhanVanh = outfit.selectedAccessories.includes('khan_vanh_day');
  const hasKhanDong = outfit.selectedAccessories.includes('khan_dong');
  const hasQuaiThao = outfit.selectedAccessories.includes('non_quai_thao');
  const hasHaiNhung = outfit.selectedAccessories.includes('hai_nhung_theu');

  // 1. Kiểm tra sự kiện trang trọng vs. Lễ phục
  if (outfit.costumeId === 'nhat_binh') {
    if (outfit.occasionId === 'dam_cuoi' || outfit.occasionId === 'checkin_heritage') {
      strengths.push('Áo Nhật Bình phối hợp hoàn hảo với không gian di sản cổ kính hoặc lễ cưới truyền thống trọng đại.');
      score += 5;
    } else if (outfit.occasionId === 'cafe_hangout') {
      tips.push('Áo Nhật Bình là đại lễ phục cung đình trang trọng. Khi mặc đi cà phê dạo phố, có thể cân nhắc chuyển sang Áo Ngũ Thân Tay Chẽn để vừa gọn gàng vừa tự nhiên.');
      score -= 10;
    }

    if (hasKhanVanh || hasKhanDong) {
      strengths.push('Đi kèm khăn vành dây/khăn đóng đúng chuẩn mực nữ quý tộc thời Nguyễn.');
    }
  }

  if (outfit.costumeId === 'ao_tac') {
    if (hasKhanDong) {
      strengths.push('Áo Tấc đi cùng khăn đóng tạo nên phong thái tề chỉnh, nho nhã mẫu mực.');
      score += 5;
    }
    if (hasBoots) {
      strengths.push('Phối Áo Tấc cùng Chelsea Boots tạo điểm nhấn Editorial phá cách rất thời thượng.');
    }
    if (hasHaiNhung) {
      strengths.push('Hài nhung thêu chỉ vàng hoàn thiện bộ lễ phục Áo Tấc đúng điển chế cung đình.');
      score += 3;
    }
  }

  if (outfit.costumeId === 'ngu_than_chen' && hasSneakers) {
    strengths.push('Sneakers trắng phối Áo Ngũ Thân tạo nên set đồ Kỷ yếu năng động, bước đi thoải mái.');
  }

  if (hasRetroGlasses) {
    strengths.push('Kính râm retro tạo điểm nhấn Y2K thời thượng, rất ăn ảnh khi check-in di sản.');
  }

  if (outfit.costumeId === 'tu_than') {
    if (hasQuaiThao) {
      strengths.push('Áo Tứ Thân đi cùng Nón Quai Thao tái hiện trọn vẹn nét duyên thầm miền Quan họ Kinh Bắc.');
      score += 5;
    }
  }

  // 2. Đánh giá tính chất Remix Gen Z
  const remixCount = outfit.selectedAccessories.filter(a => 
    ['sneakers_trang', 'chelsea_boots', 'kinh_ram_retro', 'mu_beret', 'tui_tote_dong_ho', 'chuoi_ngoc_trai'].includes(a)
  ).length;

  if (remixCount === 0) {
    strengths.push('Bảo tồn trọn vẹn 100% tinh thần cổ điển nguyên bản của cổ phục.');
  } else if (remixCount <= 2) {
    strengths.push(`Tỷ lệ Remix Gen Z vừa vặn (${remixCount} món phụ kiện đương đại), vừa giữ được phong thái cổ kính vừa toát lên nét tươi trẻ.`);
  } else {
    tips.push('Đang kết hợp khá nhiều phụ kiện hiện đại cùng lúc. Hãy tiết chế còn 1-2 điểm nhấn (ví dụ: chỉ kính mát hoặc chỉ sneakers) để trang phục chính được tôn vinh.');
    score -= 5;
  }

  // 3. Đánh giá Ngũ Hành & Màu Sắc
  const outerInnerHarmony = getElementHarmonyText(outfit.outerColor.element, outfit.innerColor.element);
  if (outerInnerHarmony.isHarmonious) {
    strengths.push(`Phối màu Áo Ngoài (${outfit.outerColor.name}) và Áo Trong (${outfit.innerColor.name}) đạt thế Ngũ Hành Tương Sinh/Đồng Khí cát lành.`);
  } else {
    strengths.push(`Cặp màu tương phản (${outfit.outerColor.name} - ${outfit.innerColor.name}) mang đến hiệu ứng thị giác ấn tượng cho Gen Z.`);
  }

  // 4. Lời khuyên chuẩn mực cổ phong
  if (costume) {
    tips.push(`Nhớ giữ quy tắc Hữu Nhậm: Vạt phải luôn đè vạt trái, khuy áo cài nghiêm cẩn đại diện cho Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín).`);
  }

  // Phân loại kết quả
  score = Math.max(70, Math.min(100, score));

  let badge = 'Chính Chuẩn Di Sản';
  let level: 'sacred' | 'creative' | 'warning' = 'sacred';
  let title = 'Bản Phối Hài Hòa Di Sản & Đương Đại';
  let summary = 'Bộ trang phục thể hiện sự am hiểu sâu sắc về cấu trúc cổ phục, kết hợp tinh tế giữa quy chuẩn văn hóa và hơi thở thanh xuân của Gen Z.';

  if (score >= 95) {
    badge = 'Chính Chuẩn Di Sản';
    level = 'sacred';
    title = 'Chuẩn Mực & Sang Trọng';
    summary = 'Tuyệt vời! Bản phối đạt độ chuẩn mực văn hóa cao, giữ trọn cốt cách tiền nhân mà vẫn rực rỡ khí chất tươi trẻ.';
  } else if (score >= 85) {
    badge = 'Phá Cách Nghệ Thuật';
    level = 'creative';
    title = 'Sáng Tạo Có Tôn Trọng';
    summary = 'Sự phá cách rất duyên dáng! Bạn đã mang đến một góc nhìn mới mẻ cho Việt phục mà không làm lu mờ giá trị di sản cốt lõi.';
  } else {
    badge = 'Cân Nhắc Bối Cảnh';
    level = 'warning';
    title = 'Cần Lưu Ý Hoàn Cảnh';
    summary = 'Bản phối có cá tính mạnh, tuy nhiên cần chú ý không gian tham dự (như đền chùa, lễ tế trang nghiêm) để trang phục không bị lạc điệu.';
  }

  return {
    score,
    badge,
    level,
    title,
    summary,
    strengths,
    tips
  };
}
