import { HeritageColor, FiveElement } from '../types';

export const HERITAGE_COLORS: HeritageColor[] = [
  {
    id: 'do_dieu',
    name: 'Đỏ Điều (Chu Sa)',
    vietnameseName: 'Đỏ Điều Cung Đình',
    hex: '#a31d1d',
    element: 'Hỏa',
    meaning: 'Sắc đỏ son thếp vàng, biểu trưng cho hỷ sự, tôn nghiêm, thịnh vượng và năng lượng dồi dào của đất nước.',
    textColor: '#ffffff',
    category: 'chinh_sac'
  },
  {
    id: 'cham_tham',
    name: 'Chàm Thâm (Chàm Tự Nhiên)',
    vietnameseName: 'Xanh Chàm Đậm',
    hex: '#1e385c',
    element: 'Thủy',
    meaning: 'Màu sắc chiết xuất từ cây chàm cổ truyền, tượng trưng cho chiều sâu trí tuệ, lòng trung kiên và sự bền bỉ.',
    textColor: '#ffffff',
    category: 'chinh_sac'
  },
  {
    id: 'vang_hoang_yen',
    name: 'Vàng Hoàng Yến',
    vietnameseName: 'Vàng Cố Đô Hoàng Cung',
    hex: '#d49b27',
    element: 'Thổ',
    meaning: 'Sắc vàng vương triều và hạt lúa chín châu thổ, tượng trưng cho trung tâm ngũ hành, phúc lộc và sự bao dung.',
    textColor: '#1a1a1a',
    category: 'chinh_sac'
  },
  {
    id: 'xanh_bich_thuy',
    name: 'Xanh Bích Thủy',
    vietnameseName: 'Ngọc Bích Sông Hương',
    hex: '#2d6a4f',
    element: 'Mộc',
    meaning: 'Màu ngọc xanh tươi mát của rừng núi và dòng nước đầu nguồn, tượng trưng cho sức sống đâm chồi nảy lộc.',
    textColor: '#ffffff',
    category: 'chinh_sac'
  },
  {
    id: 'trang_nga',
    name: 'Trắng Ngà (Mây Khói)',
    vietnameseName: 'Trắng Ngà Tơ Tằm',
    hex: '#f5f0e6',
    element: 'Kim',
    meaning: 'Màu sắc của kén tơ tằm tự nhiên chưa tẩy hóa chất, tượng trưng cho sự thuần khiết, thanh cao và khiêm nhường.',
    textColor: '#1a1a1a',
    category: 'chinh_sac'
  },
  {
    id: 'tim_hue',
    name: 'Tím Hoa Cà Xứ Huế',
    vietnameseName: 'Tím Trầm Hoàng Triều',
    hex: '#582c4d',
    element: 'Hỏa',
    meaning: 'Sắc tím đặc trưng của sông Hương núi Ngự, biểu tượng cho lòng thủy chung son sắt và nét duyên thầm xứ Kinh kỳ.',
    textColor: '#ffffff',
    category: 'gian_sac'
  },
  {
    id: 'nau_cu_nau',
    name: 'Nâu Củ Nâu (Thổ Nâu)',
    vietnameseName: 'Nâu Đất Dân Gian',
    hex: '#6e473b',
    element: 'Thổ',
    meaning: 'Màu nhuộm từ củ nâu truyền thống Bắc Bộ, biểu trưng cho đất mẹ chở che, sự cần cù mộc mạc của người nông dân.',
    textColor: '#ffffff',
    category: 'chinh_sac'
  },
  {
    id: 'hong_sen',
    name: 'Hồng Cánh Sen',
    vietnameseName: 'Hồng Sen Hồ Tây',
    hex: '#c0527b',
    element: 'Hỏa',
    meaning: 'Sắc hoa sen thanh tao thoát tục, tượng trưng cho vẻ đẹp đài các, dịu dàng của người thiếu nữ Á Đông.',
    textColor: '#ffffff',
    category: 'gian_sac'
  },
  {
    id: 'den_huyen',
    name: 'Đen Huyền (Lãnh Mỹ A)',
    vietnameseName: 'Đen Tuyển Lụa Mặc Nưa',
    hex: '#16171a',
    element: 'Thủy',
    meaning: 'Màu đen óng ả nhuộm từ trái mặc nưa Tân Châu, đại diện cho sự huyền bí, quyền lực kín đáo và phẩm hạnh vững vàng.',
    textColor: '#ffffff',
    category: 'chinh_sac'
  },
  {
    id: 'xanh_co_vit',
    name: 'Xanh Cổ Vịt',
    vietnameseName: 'Lam Bích Trầm',
    hex: '#134e5e',
    element: 'Mộc',
    meaning: 'Pha trộn giữa sắc xanh lá và xanh thẫm hoàng hôn, tạo cảm giác sang trọng cổ điển đầy chất thơ đương đại.',
    textColor: '#ffffff',
    category: 'gian_sac'
  },
  {
    id: 'vang_mo_ga',
    name: 'Vàng Mỡ Gà',
    vietnameseName: 'Hoàng Thao Nhạt',
    hex: '#eedaa2',
    element: 'Thổ',
    meaning: 'Sắc vàng pastel dịu nhẹ của tơ non, tạo cảm giác thanh thoát, trẻ trung và dễ dàng phối cùng các tông trầm.',
    textColor: '#2c2c2c',
    category: 'gian_sac'
  },
  {
    id: 'xanh_da_troi',
    name: 'Xanh Thanh Thiên (Da Trời)',
    vietnameseName: 'Lam Ngọc Mùa Thu',
    hex: '#4a85a0',
    element: 'Thủy',
    meaning: 'Sắc xanh ngắt mùa thu Hà Nội, tượng trưng cho sự khoáng đạt, tự do và ước vọng thanh bình của người Việt.',
    textColor: '#ffffff',
    category: 'gian_sac'
  }
];

// Bản đồ Tương Sinh Ngũ Hành: Kim sinh Thủy -> Thủy sinh Mộc -> Mộc sinh Hỏa -> Hỏa sinh Thổ -> Thổ sinh Kim
export const FIVE_ELEMENT_HARMONY: Record<FiveElement, { generates: FiveElement; generatedBy: FiveElement; desc: string }> = {
  Kim: { generates: 'Thủy', generatedBy: 'Thổ', desc: 'Kim sinh Thủy - Tinh khôi khởi nguồn dòng chảy mát lành' },
  Thủy: { generates: 'Mộc', generatedBy: 'Kim', desc: 'Thủy sinh Mộc - Dòng nước nuôi dưỡng mầm non xanh tốt' },
  Mộc: { generates: 'Hỏa', generatedBy: 'Thủy', desc: 'Mộc sinh Hỏa - Cỏ cây đượm ấm ngọn lửa nhiệt huyết' },
  Hỏa: { generates: 'Thổ', generatedBy: 'Mộc', desc: 'Hỏa sinh Thổ - Lửa ấm bồi đắp phù sa màu mỡ' },
  Thổ: { generates: 'Kim', generatedBy: 'Hỏa', desc: 'Thổ sinh Kim - Đất ấp ủ quặng vàng ngọc quý giá' }
};

export function getElementHarmonyText(el1: FiveElement, el2: FiveElement): { isHarmonious: boolean; message: string } {
  if (el1 === el2) {
    return {
      isHarmonious: true,
      message: `Đồng khí tương cầu (${el1} - ${el2}): Cùng thuộc một hành, tạo sự đồng nhất và vững chãi.`
    };
  }
  if (FIVE_ELEMENT_HARMONY[el1].generates === el2) {
    return {
      isHarmonious: true,
      message: `Tương Sinh đại cát (${el1} sinh ${el2}): ${FIVE_ELEMENT_HARMONY[el1].desc}.`
    };
  }
  if (FIVE_ELEMENT_HARMONY[el2].generates === el1) {
    return {
      isHarmonious: true,
      message: `Tương Sinh hỗ trợ (${el2} sinh ${el1}): Sự kết hợp nâng đỡ sắc độ hài hòa.`
    };
  }
  return {
    isHarmonious: false,
    message: `Phối màu tương phản (${el1} và ${el2}): Mang tính phá cách nghệ thuật cá tính, tạo điểm nhấn thị giác ấn tượng.`
  };
}
