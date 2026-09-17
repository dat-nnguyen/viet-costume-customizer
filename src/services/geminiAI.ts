import { AIStylistRecommendation } from '../types';

interface AIStylistRequest {
  occasionId: string;
  remixStyleId: string;
  weather: string;
  userPrompt?: string;
  apiKey?: string;
}

// Built-in Intelligent Rule-Based Engine (Fallback thông minh, chạy tức thì không phụ thuộc mạng)
export function generateLocalExpertRecommendation(req: AIStylistRequest): AIStylistRecommendation {
  const { occasionId, remixStyleId, weather, userPrompt = '' } = req;
  const promptLower = userPrompt.toLowerCase();
  const isChilly = weather.toLowerCase().includes('lạnh') || weather.toLowerCase().includes('mưa');

  // Mặc định thông minh theo từng sự kiện và phong cách
  if (occasionId === 'ky_yeu') {
    if (remixStyleId === 'streetwear' || promptLower.includes('sneaker') || promptLower.includes('năng động')) {
      return {
        outfitName: 'Thanh Xuân Khởi Sắc (Gen Z Dynamic)',
        concept: 'Áo Ngũ Thân Tay Chẽn phối cùng Sneaker trắng & Túi Tote Đông Hồ tạo năng lượng trẻ trung cho ngày chụp kỷ yếu.',
        costumeId: 'ngu_than_chen',
        outerColorId: 'cham_tham',
        innerColorId: 'trang_nga',
        bottomColorId: 'trang_nga',
        bottomType: 'pant_loose',
        accessoryIds: ['sneakers_trang', 'tui_tote_dong_ho', 'kinh_ram_retro'],
        hairAndMakeup: 'Tóc buông xõa tự nhiên hoặc búi nửa đầu thanh thoát; layout trang điểm tone đào cam tươi sáng trong trẻo.',
        storytelling: 'Áo Ngũ Thân màu Chàm Thâm biểu trưng cho lòng trung kiên và tri thức vững vàng. Khi kết hợp cùng sneakers năng động, bạn có thể tự tin di chuyển cả ngày quanh khuôn viên trường mà vẫn lưu lại những thước ảnh kỷ yếu trang nhã.',
        whyItWorks: 'Tông Chàm và Trắng Ngà tương sinh (Thủy sinh Mộc / Kim sinh Thủy), vừa lịch sự đúng chuẩn trường lớp vừa tạo nét hiện đại cho Gen Z.',
        fiveElementsInsight: 'Hành Thủy (Chàm Thâm) kết hợp hành Kim (Trắng Ngà) là thế tương sinh mang lại sự thông tuệ và hanh thông trên con đường học vấn.'
      };
    } else {
      return {
        outfitName: 'Nho Sinh Tân Thời (Academic Elegance)',
        concept: 'Áo Tấc tay thụng màu Xanh Bích Thủy phối khăn đóng truyền thống và kính cận retro trí thức.',
        costumeId: 'ao_tac',
        outerColorId: 'xanh_bich_thuy',
        innerColorId: 'trang_nga',
        bottomColorId: 'trang_nga',
        bottomType: 'pant_loose',
        accessoryIds: ['khan_dong', 'quat_xep_gam', 'kinh_ram_retro'],
        hairAndMakeup: 'Tóc rẽ ngôi cổ điển gọn gàng; trang điểm tự nhiên mỏng nhẹ tôn đường nét thanh tú.',
        storytelling: 'Áo Tấc vốn là đại lễ phục khoa cử của tiền nhân. Chiếc tay áo thụng khi chắp tay nhận bằng tốt nghiệp toát lên lòng tri ân sâu sắc đến thầy cô và gia đình.',
        whyItWorks: 'Màu xanh bích thủy biểu tượng cho sự đâm chồi nảy lộc, bước khởi đầu rực rỡ của tương lai.',
        fiveElementsInsight: 'Hành Mộc (Bích Thủy) tượng trưng cho mùa xuân, sự sinh sôi và tương lai xán lạn.'
      };
    }
  }

  if (occasionId === 'don_tet') {
    return {
      outfitName: 'Tân Xuân Cát Tường (Tet Festive Chic)',
      concept: 'Áo Tấc màu Đỏ Điều hoặc Nhật Bình Vàng Hoàng Yến đón hỷ khí đầu năm mới.',
      costumeId: remixStyleId === 'minimalist' ? 'ngu_than_chen' : 'ao_tac',
      outerColorId: 'do_dieu',
      innerColorId: 'vang_mo_ga',
      bottomColorId: 'trang_nga',
      bottomType: 'pant_loose',
      accessoryIds: ['khan_dong', 'quat_xep_gam', 'chuoi_ngoc_trai'],
      hairAndMakeup: 'Tóc búi cài trâm xà cừ hoặc vấn khăn lụa; son môi đỏ son chu sa rạng rỡ mang lại may mắn.',
      storytelling: 'Sắc Đỏ Điều là biểu tượng bất biến của sự ấm cúng, hỷ sự và phúc lộc trong văn hóa Việt. Khuy áo ngũ thường nhắc nhở con cháu giữ trọn chữ hiếu ngày Tết sum vầy.',
      whyItWorks: 'Đỏ Điều phối cùng Vàng Mỡ Gà tạo cảm giác quyền quý, ấm áp rất hợp với không khí se lạnh mùa xuân.',
      fiveElementsInsight: 'Hành Hỏa (Đỏ Điều) kết hợp hành Thổ (Vàng Mỡ Gà) - Hỏa sinh Thổ mang lại tài lộc dồi dào, vạn sự hanh thông.'
    };
  }

  if (occasionId === 'checkin_heritage') {
    return {
      outfitName: 'Cố Đô Trầm Mặc (Heritage Wanderer)',
      concept: 'Áo Nhật Bình hoặc Áo Giao Lĩnh phối cùng Chelsea Boots da đen và nón lá sen xứ Huế.',
      costumeId: remixStyleId === 'vintage_indochine' ? 'giao_linh' : 'nhat_binh',
      outerColorId: 'tim_hue',
      innerColorId: 'trang_nga',
      bottomColorId: 'trang_nga',
      bottomType: 'skirt_silk',
      accessoryIds: ['chelsea_boots', 'khan_vanh_day', 'quat_xep_gam'],
      hairAndMakeup: 'Tóc vấn gọn sau gáy, layout tone nâu đất cổ điển hoặc hồng khô thanh lịch.',
      storytelling: 'Giữa tường gạch rêu phong của Đại Nội hay Văn Miếu, sắc Tím Huế và hoa văn ngũ sắc của áo Nhật Bình giúp bạn nổi bật như một công nương bước ra từ trang sử thi.',
      whyItWorks: 'Chelsea Boots tạo thế đứng vững chãi khi tản bộ trong di tích, đồng thời mang lại nét đẹp Haute Couture độc đáo.',
      fiveElementsInsight: 'Sắc Tím thuộc Hỏa trầm kết hợp hành Thủy của đá rêu tạo nên sự cân bằng âm dương tĩnh lặng.'
    };
  }

  if (occasionId === 'cafe_hangout') {
    return {
      outfitName: 'Nhịp Phố Tân Thời (Urban Heritage)',
      concept: 'Áo Bà Ba lãnh đen phối quần jean suông hiện đại, hoặc Áo Ngũ Thân dáng ngắn phối Mũ Beret.',
      costumeId: promptLower.includes('nam bộ') || promptLower.includes('bà ba') ? 'ba_ba' : 'ngu_than_chen',
      outerColorId: 'xanh_co_vit',
      innerColorId: 'trang_nga',
      bottomColorId: 'den_huyen',
      bottomType: 'trousers_modern',
      accessoryIds: isChilly 
        ? ['mu_beret', 'chelsea_boots', 'tui_tote_dong_ho']
        : ['sneakers_trang', 'tui_tote_dong_ho', 'kinh_ram_retro'],
      hairAndMakeup: 'Tóc xoăn lọn sóng nhẹ nhàng phong cách Retro 1930s; son môi màu cam đất thời thượng.',
      storytelling: 'Việt phục không nhất thiết chỉ để treo trong tủ kính hay mặc dịp đại lễ. Bản phối này mang cổ phục bước vào nhịp sống thường nhật của quán cà phê, triển lãm tranh.',
      whyItWorks: 'Phom dáng áo gọn gàng kết hợp mũ beret tạo nên diện mạo vừa hoài niệm vừa đậm chất nghệ sĩ indie.',
      fiveElementsInsight: 'Sắc Xanh Cổ Vịt (Mộc) giao hòa với Đen Huyền (Thủy) là thế Thủy dưỡng Mộc thanh nhã.'
    };
  }

  // Mặc định Dự Tiệc / Đám Cưới
  return {
    outfitName: 'Duyên Dáng Tương Phùng (Modern Grace)',
    concept: 'Áo Dài Tân Thời hoặc Áo Tấc thướt tha phối chuỗi ngọc trai layering và hài nhung thêu.',
    costumeId: 'ao_dai_tan_thoi',
    outerColorId: 'hong_sen',
    innerColorId: 'trang_nga',
    bottomColorId: 'trang_nga',
    bottomType: 'skirt_silk',
    accessoryIds: ['chuoi_ngoc_trai', 'hai_nhung_theu', 'quat_xep_gam'],
    hairAndMakeup: 'Tóc kẹp nửa đầu đính ngọc trai, trang điểm glowy trong suốt kiểu tiểu thư Á Đông.',
    storytelling: 'Sắc hồng sen ngọt ngào mang thông điệp chúc phúc viên mãn. Tà áo dài thướt tha tôn vinh nét duyên đài các trong ngày vui của bạn bè.',
    whyItWorks: 'Ngọc trai bắt sáng nhẹ nhàng kết hợp chất lụa tơ óng ả làm tôn nước da châu Á một cách tự nhiên nhất.',
    fiveElementsInsight: 'Hồng Sen (Hỏa dịu) tương sinh với Trắng Ngà (Kim), vừa nhu mì vừa nổi bật giữa đám đông.'
  };
}

// Gọi Gemini API trực tuyến khi có API Key
export async function generateAIStylistRecommendation(req: AIStylistRequest): Promise<AIStylistRecommendation> {
  const apiKey = req.apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    // Không có API key -> Chạy ngay offline engine mượt mà
    return generateLocalExpertRecommendation(req);
  }

  try {
    const promptText = `
Bạn là "AI Stylist & Nhà nghiên cứu Cổ phục Việt Nam", chuyên gia tư vấn phối trang phục truyền thống Việt Nam theo phong cách Gen Z Remix.
Hãy tư vấn một bản phối trang phục dựa trên các thông số sau:
- Dịp sử dụng: ${req.occasionId}
- Phong cách mong muốn: ${req.remixStyleId}
- Thời tiết / Địa điểm: ${req.weather}
- Ghi chú thêm của người dùng: "${req.userPrompt || 'Tối ưu bản phối trẻ trung nhưng tôn trọng văn hóa'}"

Danh sách ID trang phục hợp lệ: ['ngu_than_chen', 'ao_tac', 'nhat_binh', 'giao_linh', 'tu_than', 'ba_ba', 'doi_kham', 'ao_dai_tan_thoi']
Danh sách ID màu hợp lệ: ['do_dieu', 'cham_tham', 'vang_hoang_yen', 'xanh_bich_thuy', 'trang_nga', 'tim_hue', 'nau_cu_nau', 'hong_sen', 'den_huyen', 'xanh_co_vit', 'vang_mo_ga', 'xanh_da_troi']
Danh sách ID phụ kiện hợp lệ: ['khan_dong', 'khan_vanh_day', 'non_quai_thao', 'non_la', 'guoc_moc', 'hai_nhung_theu', 'quat_xep_gam', 'khan_ran', 'sneakers_trang', 'chelsea_boots', 'kinh_ram_retro', 'mu_beret', 'tui_tote_dong_ho', 'chuoi_ngoc_trai']
Danh sách bottomType: ['pant_loose', 'skirt_silk', 'trousers_modern', 'skirt_pleated']

Yêu cầu output: Trả về DUY NHẤT một JSON hợp lệ (không kèm markdown code block \`\`\`json) với cấu trúc:
{
  "outfitName": "Tên bản phối thật thơ và ấn tượng",
  "concept": "Tóm tắt ý tưởng bản phối trong 1-2 câu",
  "costumeId": "một trong các ID trang phục trên",
  "outerColorId": "ID màu áo ngoài",
  "innerColorId": "ID màu áo trong",
  "bottomColorId": "ID màu quần/váy",
  "bottomType": "pant_loose",
  "accessoryIds": ["danh sách 2-4 ID phụ kiện"],
  "hairAndMakeup": "Gợi ý kiểu tóc và makeup phù hợp",
  "storytelling": "Ý nghĩa lịch sử và câu chuyện văn hóa của bản phối này",
  "whyItWorks": "Giải thích vì sao bản phối này vừa chuẩn mực vừa hợp Gen Z",
  "fiveElementsInsight": "Phân tích triết lý ngũ hành tương sinh giữa các màu sắc đã chọn"
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200
          }
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API trả về lỗi HTTP, chuyển sang Offline Engine:', response.status);
      return generateLocalExpertRecommendation(req);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateLocalExpertRecommendation(req);
    }

    // Làm sạch chuỗi JSON nếu Gemini trả về kèm markdown
    const cleanedText = candidateText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed: AIStylistRecommendation = JSON.parse(cleanedText);
    return parsed;
  } catch (err) {
    console.warn('Lỗi khi gọi Gemini API, chuyển đổi dự phòng sang Local Expert Engine:', err);
    return generateLocalExpertRecommendation(req);
  }
}
