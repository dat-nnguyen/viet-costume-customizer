import { Costume } from '../types';

export const TRADITIONAL_COSTUMES: Costume[] = [
  {
    id: 'ngu_than_chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    subTitle: 'Biểu Tượng Thanh Lịch & Tiền Thân Của Áo Dài Hiện Đại',
    dynasty: 'Triều Nguyễn (Thế kỷ 18 - 20)',
    category: 'Thường Phục Thanh Lịch',
    collarType: 'Lập Lĩnh (Cổ đứng tròn khép kín, cao 2-3cm)',
    sleeveType: 'Tay Chẽn (Ống tay ôm vừa vặn từ khuỷu tay xuống cổ tay)',
    flaps: '5 thân ghép lại: 2 thân trước, 2 thân sau, và 1 thân con bên trong (vạt hữu)',
    buttons: '5 khuy cài tượng trưng Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín)',
    material: 'Lụa tơ tằm Vạn Phúc, gấm sa dệt hoa, the lót mùa hè, đoạn ấm mùa đông',
    historicalStory: 'Được định hình chuẩn mực bởi Chúa Nguyễn Phúc Khoát (1744) và Vua Minh Mạng (1827-1837) nhằm thống nhất y phục Đại Nam. Đây là trang phục phổ quát của người Việt xưa cho cả nam và nữ.',
    philosophy: 'Bốn thân ngoài tượng trưng cho Tứ Thân Phụ Mẫu (cha mẹ mình và cha mẹ người phối ngẫu). Thân con thứ 5 ẩn bên trong tượng trưng cho người mặc được chở che. 5 hạt ngọc/khuy cài nhắc nhở giữ trọn 5 đức hạnh làm người.',
    culturalRules: [
      'Khuy áo luôn cài vạt phải đè vạt trái (vạt hữu), tuyệt đối không cài ngược vạt tả.',
      'Cổ áo đứng nghiêm cẩn, khi mặc thường để lộ nhẹ mép cổ áo lót trắng bên trong tạo sự tinh tế tao nhã.',
      'Rất phù hợp để remix cùng sneaker trắng tối giản, áo trench coat hoặc túi tote hiện đại khi dạo phố.'
    ],
    imageUrl: '/costumes/ngu_than_chen.jpg',
    defaultColors: {
      outer: 'cham_tham',
      inner: 'trang_nga',
      bottom: 'trang_nga'
    }
  },
  {
    id: 'ao_tac',
    name: 'Áo Tấc (Áo Tay Thụng)',
    subTitle: 'Đại Lễ Phục Dân Gian Trong Hôn Lễ & Khoa Cử',
    dynasty: 'Thời Hậu Lê & Triều Nguyễn',
    category: 'Lễ Phục Trang Trọng',
    collarType: 'Lập Lĩnh (Cổ đứng trang nghiêm, gài khuy bên phải)',
    sleeveType: 'Tay Thụng (Tay áo thụng rộng, dài qua khỏi bàn tay 1 tấc)',
    flaps: '5 thân thụng dài qua đầu gối, vạt buông rủ uyển chuyển',
    buttons: '5 khuy truyền thống (gỗ mun, đồng, ngọc bích)',
    material: 'Gấm dệt chữ Thọ/Song Hỷ, sa lụa cao cấp, the gấm bóng nhẹ',
    historicalStory: 'Tên gọi "Áo Tấc" xuất phát từ phần tay áo buông thõng dài hơn đầu ngón tay đúng 1 tấc (khoảng 10-12cm). Đây là lễ phục bắt buộc trong các nghi thức trang trọng như cưới hỏi, lễ bái tổ tiên, kỳ thi hương, thi đình.',
    philosophy: 'Tay áo rộng rãi khi người mặc chắp tay cung kính phía trước tạo nên dáng dấp khiêm nhường, tĩnh tại và tôn kính tổ tiên, đất trời.',
    culturalRules: [
      'Khi mặc Áo Tấc chuẩn nghi lễ, hai tay chắp trước bụng tạo tư thế cung kính lễ độ.',
      'Không nên cắt ngắn tay thụng hoặc vạt áo vì sẽ làm mất đi linh hồn uy nghiêm của đại lễ phục.',
      'Có thể remix với giày bốt da cổ thấp hoặc kính mắt retro phong cách vintage trí thức.'
    ],
    imageUrl: '/costumes/ao_tac.jpg',
    defaultColors: {
      outer: 'do_dieu',
      inner: 'trang_nga',
      bottom: 'trang_nga'
    }
  },
  {
    id: 'nhat_binh',
    name: 'Áo Nhật Bình',
    subTitle: 'Kiệt Tác Thêu Cung Đình Cho Nữ Quý Tộc Triều Nguyễn',
    dynasty: 'Hoàng Triều Nhà Nguyễn (1802 - 1945)',
    category: 'Lễ Phục Trang Trọng',
    collarType: 'Nhật Bình (Viền cổ áo chữ nhật thêu hoa văn ngũ sắc, phượng ổ, bát bửu)',
    sleeveType: 'Tay thụng viền dải ngũ sắc ngũ hành ở cửa tay',
    flaps: 'Vạt mở phía trước ngực với dải ruy-băng/dây buộc thắt tinh xảo',
    buttons: 'Buộc dây gấm hoặc cài kim hoàn lấp lánh',
    material: 'Lụa the hoàng cung, gấm thêu kim tuyến, hạt ngọc kết công phu',
    historicalStory: 'Nguyên là lễ phục dành riêng cho Hậu phi, Công chúa và mệnh phụ quý tộc. Về sau vào thời cận đại, Nhật Bình trở thành lễ phục cưới danh giá của các tân nương miền Trung và xứ Huế.',
    philosophy: 'Hoa văn hình chữ nhật trước ngực tượng trưng cho trời đất vuông tròn (Trời tròn Đất vuông), dải ngũ sắc tượng trưng cho ngũ hành tương sinh bảo hộ phúc khí và hưng thịnh.',
    culturalRules: [
      'Nhật Bình là trang phục có vị thế cao quý; tránh mặc cùng trang phục quá ngắn hoặc hở hang bên dưới.',
      'Thường đi kèm khăn vành dây vấn bằng lụa xanh/vàng hoặc khăn đóng truyền thống.',
      'Có thể remix nhẹ nhàng cùng chuỗi ngọc trai nhiều tầng, túi xách mini đính hạt hoặc giày cao gót nhung.'
    ],
    imageUrl: '/costumes/nhat_binh.jpg',
    defaultColors: {
      outer: 'vang_hoang_yen',
      inner: 'trang_nga',
      bottom: 'trang_nga'
    }
  },
  {
    id: 'giao_linh',
    name: 'Áo Giao Lĩnh (Tràng Vạt)',
    subTitle: 'Cổ Phục Quý Tộc Thời Lý - Trần - Lê',
    dynasty: 'Đại Việt (Thời Lý, Trần, Hậu Lê thế kỷ 11 - 18)',
    category: 'Lễ Phục Trang Trọng',
    collarType: 'Giao Lĩnh (Hai cổ áo bắt chéo trước ngực, vạt phải đè vạt trái)',
    sleeveType: 'Tay thụng rộng hoặc tay chẽn tùy đẳng cấp',
    flaps: 'Vạt áo dài thướt tha, thắt đai lưng lụa thả dài (Đại đới)',
    buttons: 'Dây thắt lụa mềm mại cố định bên sườn phải',
    material: 'Tơ tằm tự nhiên dệt hoa văn mây lửa, rồng thời Lý, hoa sen, phượng hoàng',
    historicalStory: 'Loại y phục cổ kính bậc nhất của người Việt, được ghi nhận trong nhiều thư tịch cổ và tranh tượng triều Lý - Trần - Lê. Về sau là nguồn cảm hứng cho nhiều lễ phục cung đình Á Đông.',
    philosophy: 'Vạt áo giao nhau tượng trưng cho sự hòa hợp âm dương đất trời, dải đai lưng mềm mại thể hiện phong thái tự do, phóng khoáng của thời đại phục hưng Đại Việt.',
    culturalRules: [
      'Giao lĩnh tuyệt đối phải giữ quy tắc vạt bên phải đè lên vạt bên trái (Hữu Nhậm), không mặc chéo ngược lại (Tả Nhậm).',
      'Đẹp nhất khi kết hợp lớp áo trong lộ viền cổ chéo tạo chiều sâu thị giác (layering).',
      'Remix tuyệt vời cùng thắt lưng da tối giản hoặc boot da cá tính.'
    ],
    imageUrl: '/costumes/giao_linh.jpg',
    defaultColors: {
      outer: 'xanh_bich_thuy',
      inner: 'trang_nga',
      bottom: 'trang_nga'
    }
  },
  {
    id: 'tu_than',
    name: 'Áo Tứ Thân & Yếm Đào',
    subTitle: 'Hồn Cốt Dân Gian Bắc Bộ & Duyên Dáng Hội Lim',
    dynasty: 'Đồng Bằng Bắc Bộ (Thế kỷ 12 - nay)',
    category: 'Dân Gian Bản Địa',
    collarType: 'Cổ mở không khuy, mặc ngoài yếm cổ tròn hoặc yếm cổ xây',
    sleeveType: 'Tay áo thon thả, cử động linh hoạt khi lao động và múa hát',
    flaps: '4 thân áo: 2 thân sau may liền sống lưng, 2 thân trước để buông hoặc buộc thắt trước bụng',
    buttons: 'Không có khuy, thắt bằng dải yếm lụa và bao thắt lưng xanh/hồng',
    material: 'Vải đũi tơ tằm Nam Cao, nhuộm nâu củ nâu, the thâm, yếm lụa cánh sen',
    historicalStory: 'Gắn liền với hình ảnh các liền chị quan họ Kinh Bắc, người con gái Bắc Bộ tần tảo nhưng vô cùng duyên dáng trong các hội làng mùa xuân, hát chèo và dân ca quan họ.',
    philosophy: 'Hai vạt sau tượng trưng cho cha mẹ, hai vạt trước tượng trưng cho vợ chồng, chiếc yếm đào nép bên trong tượng trưng cho nét e ấp, kín đáo của người phụ nữ Việt.',
    culturalRules: [
      'Phối cùng nón quai thao (nón ba tầm) hoặc nón lá truyền thống.',
      'Có thể remix cá tính với yếm đào cách tân phối áo blazer dáng rộng khoác hờ hoặc chân váy xếp ly hiện đại.'
    ],
    imageUrl: '/costumes/tu_than.jpg',
    defaultColors: {
      outer: 'nau_cu_nau',
      inner: 'hong_sen',
      bottom: 'den_huyen'
    }
  },
  {
    id: 'ba_ba',
    name: 'Áo Bà Ba & Khăn Rằn',
    subTitle: 'Vẻ Đẹp Bình Dị, Phóng Khoáng Miền Sông Nước Nam Bộ',
    dynasty: 'Đất Phương Nam (Thế kỷ 19 - nay)',
    category: 'Dân Gian Bản Địa',
    collarType: 'Cổ tròn hoặc cổ tim thoáng mát',
    sleeveType: 'Tay áo dài suông, cổ tay xẻ tà nhỏ cử động thoải mái',
    flaps: 'Xẻ tà hai bên hông tới eo, tà áo ngắn tiện lợi',
    buttons: 'Hàng cúc bấm hoặc cúc ngọc chạy dọc chính giữa ngực áo',
    material: 'Vải ú, lụa lãnh Mỹ A huyền thoại, đũi mát mẻ cho khí hậu nhiệt đới',
    historicalStory: 'Xuất hiện vào thế kỷ 19 tại Nam Bộ, được cho là do nhà bác học Trương Vĩnh Ký cách tân từ trang phục người Ba Ba Mã Lai hoặc trang phục lao động phương Nam để phù hợp khí hậu chằng chịt sông ngòi.',
    philosophy: 'Đại diện cho tính cách người Nam Bộ: chân chất, nghĩa khí, khoáng đạt, chan hòa với thiên nhiên phù sa trù phú.',
    culturalRules: [
      'Luôn đi cùng sự thanh thoát, giản dị, không nên đính kết phụ kiện kim loại quá nặng nề phô trương.',
      'Remix cực chất với quần jeans ống rộng, nón tai bèo cá tính, túi cói đan tay hoặc giày slip-on.'
    ],
    imageUrl: '/costumes/ba_ba.jpg',
    defaultColors: {
      outer: 'den_huyen',
      inner: 'trang_nga',
      bottom: 'den_huyen'
    }
  },
  {
    id: 'doi_kham',
    name: 'Áo Đối Khâm',
    subTitle: 'Trang Phục Cổ Xưa Hai Vạt Song Song Thời Lý - Trần',
    dynasty: 'Thời Lý - Trần - Hậu Lê',
    category: 'Lễ Phục Trang Trọng',
    collarType: 'Cổ Đối Khâm (Hai vạt áo mở song song thẳng đứng, không bắt chéo)',
    sleeveType: 'Tay thụng rộng rãi hoặc tay suông trang nhã',
    flaps: 'Thân áo mở thẳng đứng, lộ rõ tầng áo lót gấm bên trong',
    buttons: 'Thắt đai lụa ngực hoặc buông mở khoác ngoài như áo choàng kim môn',
    material: 'Gấm lụa cao cấp, sa mỏng dệt sợi chỉ vàng hoa văn cổ điển',
    historicalStory: 'Thường thấy trên các bức tượng hoàng hậu, công chúa thời Lý - Trần và tranh cuộn cổ. Là dạng áo khoác quý tộc lộng lẫy thể hiện sự giàu sang và gu thẩm mỹ vương giả.',
    philosophy: 'Hai tà áo song song đối xứng thể hiện sự công chính, ngay thẳng, cân đối và lòng bao dung rộng lớn.',
    culturalRules: [
      'Vì là dạng áo khoác mở, lớp áo trong (yếm hoặc áo giao lĩnh) cần được phối màu hài hòa tương phản cao.',
      'Rất ăn ý với phong cách Haute Couture hiện đại khi khoác ngoài váy dạ hội hoặc suit tối giản.'
    ],
    imageUrl: '/costumes/doi_kham.jpg',
    defaultColors: {
      outer: 'tim_hue',
      inner: 'trang_nga',
      bottom: 'trang_nga'
    }
  },
  {
    id: 'ao_dai_tan_thoi',
    name: 'Áo Dài Tân Thời (Lemur & Hiện Đại)',
    subTitle: 'Cuộc Cách Mạng Giao Thoa Đông Tây Đầu Thế Kỷ 20',
    dynasty: 'Phong trào Thơ Mới & Đông Pháp (1930 - nay)',
    category: 'Giao Thoa Đương Đại',
    collarType: 'Cổ trụ mềm, cổ lá sen, cổ thuyền hoặc cổ đứng cách điệu',
    sleeveType: 'Tay raglan thanh thoát, không nhăn nách, cử động mượt mà',
    flaps: '2 tà trước và sau buông dài thướt tha tôn vinh đường cong',
    buttons: 'Hàng cúc bấm chạy chéo từ cổ xuống nách và dọc sườn phải',
    material: 'Lụa tơ tằm, gấm nhung, chiffon, voan, tơ sống dệt thủ công',
    historicalStory: 'Bắt nguồn từ họa sĩ Cát Tường (Lemur) và họa sĩ Lê Phổ thập niên 1930 tại Hà Nội, biến chiếc áo ngũ thân truyền thống thành chiếc áo dài ôm sát thanh lịch nổi tiếng khắp thế giới.',
    philosophy: 'Tôn vinh vẻ đẹp kín đáo nhưng quyến rũ của người phụ nữ Việt Nam đương đại, là cầu nối giữa cội nguồn văn hóa và nhịp sống toàn cầu.',
    culturalRules: [
      'Tà áo buông mềm mại, tránh cắt xẻ tà quá cao ngang eo gây phản cảm.',
      'Phù hợp với nhiều bối cảnh từ trường học, lễ tốt nghiệp đến dạo phố và dạ tiệc.'
    ],
    imageUrl: '/costumes/ao_dai_tan_thoi.jpg',
    defaultColors: {
      outer: 'hong_sen',
      inner: 'trang_nga',
      bottom: 'trang_nga'
    }
  }
];
