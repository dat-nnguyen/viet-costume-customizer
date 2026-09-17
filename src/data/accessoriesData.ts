import { Accessory, Occasion, RemixStyle } from '../types';

export const ACCESSORIES_DATA: Accessory[] = [
  // --- TRUYỀN THỐNG (TRADITIONAL) ---
  {
    id: 'khan_dong',
    name: 'Khăn Đóng / Khăn Xếp',
    subName: 'Khăn Vấn Nam & Nữ Truyền Thống',
    category: 'traditional',
    type: 'headwear',
    description: 'Chiếc khăn vấn gọn gàng bằng lụa đen hoặc gấm, thể hiện nét tề chỉnh, nho nhã và tôn nghiêm của người Việt.',
    icon: 'Crown',
    culturalNote: 'Chuẩn mực khi mặc cùng Áo Ngũ Thân và Áo Tấc trong các dịp lễ tết, giỗ chạp.',
    isRemixGenZ: false
  },
  {
    id: 'khan_vanh_day',
    name: 'Khăn Vành Dây Hoàng Cung',
    subName: 'Đại Lễ Khăn Dành Cho Nữ Quý Tộc',
    category: 'traditional',
    type: 'headwear',
    description: 'Dải lụa the dài vấn nhiều vòng quanh đầu tạo thành hình vành cung mở rộng lên trên, sang trọng quý phái.',
    icon: 'Sparkles',
    culturalNote: 'Đi đôi hoàn hảo cùng Áo Nhật Bình trong lễ cưới truyền thống hoặc tái hiện cung đình.',
    isRemixGenZ: false
  },
  {
    id: 'non_quai_thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    subName: 'Hồn Cốt Duyên Dáng Dân Ca Quan Họ',
    category: 'traditional',
    type: 'headwear',
    description: 'Chiếc nón tròn phẳng rộng vành với dải quai thao đan bằng tơ tằm bóng mượt thả dài xuống hai bờ vai.',
    icon: 'Sun',
    culturalNote: 'Phụ kiện không thể thiếu khi mặc Áo Tứ Thân & Yếm Đào vùng đồng bằng Bắc Bộ.',
    isRemixGenZ: false
  },
  {
    id: 'non_la',
    name: 'Nón Lá Sen Xứ Huế',
    subName: 'Chiếc Nón Bài Thơ Bình Dị',
    category: 'traditional',
    type: 'headwear',
    description: 'Nón lá chóp nhọn đan thủ công từ lá cọ phơi khô hoặc lá sen ướp hương, che chở nắng mưa non nước.',
    icon: 'Umbrella',
    culturalNote: 'Phối cực đẹp cùng Áo Dài, Áo Ngũ Thân hoặc Áo Bà Ba khi dạo phố ngắm cảnh.',
    isRemixGenZ: false
  },
  {
    id: 'guoc_moc',
    name: 'Guốc Mộc Hoa Cúc',
    subName: 'Âm Thanh Lách Cách Lạc Bước Xưa',
    category: 'traditional',
    type: 'footwear',
    description: 'Đôi guốc đẽo từ gỗ mộc tự nhiên với quai nhung thêu hoa cúc hoặc lụa then thanh mảnh.',
    icon: 'Footprints',
    culturalNote: 'Âm thanh tiếng guốc mộc trên sân gạch rêu phong là nét văn hóa đặc trưng người Việt xưa.',
    isRemixGenZ: false
  },
  {
    id: 'hai_nhung_theu',
    name: 'Hài Nhung Thêu Chỉ Vàng',
    subName: 'Giày Quý Tộc Cung Đình',
    category: 'traditional',
    type: 'footwear',
    description: 'Hài mũi cong nhẹ bọc nhung đỏ hoặc đen, thêu họa tiết mây lửa, hoa sen bằng chỉ kim tuyến vàng óng.',
    icon: 'Sparkle',
    culturalNote: 'Đi cùng Áo Nhật Bình hoặc Áo Tấc tạo phong thái vương giả đài các.',
    isRemixGenZ: false
  },
  {
    id: 'quat_xep_gam',
    name: 'Quạt Xếp Lụa Gấm',
    subName: 'Vật Bất Ly Thân Của Bậc Phong Lưu',
    category: 'traditional',
    type: 'handheld',
    description: 'Quạt nan tre dán lụa tơ tằm hoặc gấm thêu họa tiết tứ bình, vừa che nắng vừa tạo dáng thanh tao.',
    icon: 'Wind',
    culturalNote: 'Tạo tư thế chụp ảnh đầy chất thơ và nho nhã khi cầm trên tay.',
    isRemixGenZ: false
  },
  {
    id: 'khan_ran',
    name: 'Khăn Rằn Nam Bộ',
    subName: 'Dải Khăn Thấm Đượm Tình Phù Sa',
    category: 'traditional',
    type: 'jewelry',
    description: 'Chiếc khăn caro đen trắng hoặc đỏ trắng quàng cổ, vắt qua vai mộc mạc và phóng khoáng.',
    icon: 'Layers',
    culturalNote: 'Đi liền cùng chiếc Áo Bà Ba bình dị trong những chuyến dã ngoại vùng sông nước.',
    isRemixGenZ: false
  },

  // --- GEN Z REMIX (MODERN TWIST) ---
  {
    id: 'sneakers_trang',
    name: 'Sneakers Trắng Tối Giản',
    subName: 'Năng Động, Trẻ Trung & Bước Đi Thoải Mái',
    category: 'remix',
    type: 'footwear',
    description: 'Đôi giày thể thao da trắng phom dáng classic (như Stan Smith hay Air Force 1), tạo nét tương phản hiện đại.',
    icon: 'Footprints',
    culturalNote: 'Cực kỳ được ưa chuộng khi học sinh sinh viên mặc Áo Ngũ Thân chụp kỷ yếu hoặc dạo phố cả ngày.',
    isRemixGenZ: true
  },
  {
    id: 'chelsea_boots',
    name: 'Chelsea Boots Da Đen',
    subName: 'Góc Cạnh, Cá Tính & Đậm Phong Cách Editorial',
    category: 'remix',
    type: 'footwear',
    description: 'Đôi bốt da bóng đen cổ thấp tôn dáng cao ráo, biến tấu cổ phục thành set đồ thời trang đẳng cấp runway.',
    icon: 'Zap',
    culturalNote: 'Phối cùng Áo Tấc hoặc Áo Giao Lĩnh tạo nét bí ẩn, lãng tử và mạnh mẽ.',
    isRemixGenZ: true
  },
  {
    id: 'kinh_ram_retro',
    name: 'Kính Râm Retro Gọng Kim Loại',
    subName: 'Nét Lạnh Lùng Y2K Thời Thượng',
    category: 'remix',
    type: 'eyewear',
    description: 'Kính mát oval mắt nhỏ hoặc gọng chữ nhật mắt đen, tạo phong thái ngầu và cá tính cho bức ảnh check-in.',
    icon: 'Glasses',
    culturalNote: 'Xu hướng chụp ảnh Việt Phục Streetwear bùng nổ trên TikTok và Instagram.',
    isRemixGenZ: true
  },
  {
    id: 'mu_beret',
    name: 'Mũ Nồi Beret Len Vintage',
    subName: 'Giao Thoa Thơ Mộng Phong Cách Hà Nội Xưa',
    category: 'remix',
    type: 'headwear',
    description: 'Chiếc mũ beret dạ len đen hoặc nâu, gợi nhớ phong thái nghệ sĩ và thi sĩ Đông Dương đầu thế kỷ 20.',
    icon: 'CircleDot',
    culturalNote: 'Rất hợp khi dạo phố mùa đông Hà Nội hoặc Đà Lạt se lạnh trong tà Áo Ngũ Thân.',
    isRemixGenZ: true
  },
  {
    id: 'tui_tote_dong_ho',
    name: 'Túi Tote Canvas Tranh Đông Hồ',
    subName: 'Mang Tinh Hoa Dân Gian Đi Học, Đi Làm',
    category: 'remix',
    type: 'bag',
    description: 'Túi vải canvas dệt thô in họa tiết tranh dân gian Đông Hồ (Đám cưới chuột, Bé ôm gà, Chăn trâu thổi sáo).',
    icon: 'ShoppingBag',
    culturalNote: 'Phụ kiện tiện ích chứa vừa laptop, sách vở, hòa quyện giữa tính ứng dụng và mỹ thuật dân gian.',
    isRemixGenZ: true
  },
  {
    id: 'chuoi_ngoc_trai',
    name: 'Chuỗi Ngọc Trai Layering',
    subName: 'Nét Quý Phái Tân Thời Của Gen Z',
    category: 'remix',
    type: 'jewelry',
    description: 'Dây chuyền ngọc trai nước ngọt phối nhiều lớp ngắn dài quanh cổ áo đứng, bắt sáng nhẹ nhàng.',
    icon: 'Gem',
    culturalNote: 'Điểm nhấn sang trọng làm bừng sáng phần cổ áo Lập lĩnh hoặc Áo Nhật Bình.',
    isRemixGenZ: true
  }
];

export const OCCASIONS_DATA: Occasion[] = [
  {
    id: 'ky_yeu',
    name: 'Chụp Ảnh Kỷ Yếu & Tốt Nghiệp',
    description: 'Dành cho học sinh - sinh viên lưu giữ khoảnh khắc thanh xuân rực rỡ bên thầy cô và bạn bè.',
    vibe: 'Trang trọng, tươi sáng, lưu giữ kỷ niệm tuổi trẻ',
    icon: 'GraduationCap',
    formality: 'academic'
  },
  {
    id: 'don_tet',
    name: 'Du Xuân Đón Tết Cổ Truyền',
    description: 'Đi chúc Tết họ hàng, lễ chùa đầu năm và chụp ảnh phố hoa mùa xuân.',
    vibe: 'Ấm áp, rực rỡ, may mắn và sum vầy',
    icon: 'Calendar',
    formality: 'festival'
  },
  {
    id: 'checkin_heritage',
    name: 'Check-in Di Sản & Dạo Cố Đô',
    description: 'Thăm Đại Nội Huế, Phố Cổ Hội An, Hoàng Thành Thăng Long, Văn Miếu Quốc Tử Giám.',
    vibe: 'Hoài niệm, giàu tính thẩm mỹ nghệ thuật',
    icon: 'Camera',
    formality: 'photoshoot'
  },
  {
    id: 'cafe_hangout',
    name: 'Dạo Phố & Cafe Cuối Tuần',
    description: 'Gặp gỡ bạn bè, đi workshop, tham quan triển lãm tranh nghệ thuật.',
    vibe: 'Thoải mái, phóng khoáng, đậm chất cá nhân',
    icon: 'Coffee',
    formality: 'casual'
  },
  {
    id: 'dam_cuoi',
    name: 'Dự Lễ Cưới & Tiệc Hỷ',
    description: 'Đến chung vui cùng bạn thân trong ngày trọng đại với trang phục lịch lãm, tinh tế.',
    vibe: 'Lịch sự, chúc phúc, tươi vui và trang nhã',
    icon: 'HeartHandshake',
    formality: 'formal'
  }
];

export const REMIX_STYLES_DATA: RemixStyle[] = [
  {
    id: 'minimalist',
    name: 'Minimalist Heritage',
    description: 'Tối giản đường nét, ưu tiên các gam màu nhã nhặn (trắng ngà, chàm thâm, be lụa), phụ kiện tinh gọn.',
    tagline: 'Vẻ đẹp thanh tịnh từ sự giản dị',
    icon: 'Feather'
  },
  {
    id: 'streetwear',
    name: 'Cyber & Street Remix',
    description: 'Pha trộn Việt phục cùng sneakers hầm hố, kính râm retro, túi đeo chéo cá tính phong cách Gen Z năng động.',
    tagline: 'Phá cách táo bạo nơi phố thị',
    icon: 'Compass'
  },
  {
    id: 'vintage_indochine',
    name: 'Vintage Đông Dương 1930s',
    description: 'Cảm hứng từ phong trào Thơ Mới và giới trí thức Hà Nội xưa: nón beret, ô lụa, giày tây, túi da cổ điển.',
    tagline: 'Lãng tử, hoài niệm & đầy chất thơ',
    icon: 'Clock'
  },
  {
    id: 'editorial',
    name: 'High-Fashion Editorial',
    description: 'Phong cách chụp ảnh tạp chí thời trang: phối màu tương phản cao, boots da, ngọc trai đa tầng ấn tượng.',
    tagline: 'Đẳng cấp nghệ thuật sàn diễn',
    icon: 'Palette'
  },
  {
    id: 'pure_classic',
    name: 'Cổ Điển Thuần Khiết (Original)',
    description: 'Giữ nguyên 100% quy chuẩn y phục lễ nghi xưa: khăn đóng, hài thêu, guốc mộc, quạt xếp.',
    tagline: 'Trọn vẹn chuẩn mực ngàn năm',
    icon: 'Award'
  }
];
