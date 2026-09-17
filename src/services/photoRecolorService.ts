// Intelligent In-Image Photographic Recolor Engine
// Biến đổi trực tiếp màu sắc thớ vải trên ảnh gốc (Pixel-Level Photographic Recolor)
// Giữ nguyên 100% nếp gấp, độ bóng, độ sâu, khuy cài kim loại và phông nền studio

const recolorCache = new Map<string, string>();
const imageElementCache = new Map<string, HTMLImageElement>();

// Helper: Tải ảnh vào bộ nhớ cache một lần duy nhất
function preloadImage(url: string): Promise<HTMLImageElement> {
  if (imageElementCache.has(url)) {
    return Promise.resolve(imageElementCache.get(url)!);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementCache.set(url, img);
      resolve(img);
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

// Chuyển đổi RGB sang HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h, s, l];
}

// Chuyển đổi HSL sang RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Kiểm tra điểm nằm trong đa giác
function isPointInPoly(x: number, y: number, poly: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Tọa độ bounding phom áo & quần chuẩn mực theo tỷ lệ 896x1200
const NGU_THAN_ROBE_POLY = [
  [395, 245], [350, 260], [310, 320], [280, 420], [285, 520], [300, 615],
  [365, 615], [365, 570], [340, 680], [345, 880], [585, 880], [590, 680], 
  [575, 570], [575, 615], [635, 615], [630, 520], [630, 420], [600, 320], 
  [555, 260], [505, 245], [450, 252]
];

const NGU_THAN_PANTS_POLY = [
  [340, 880], [335, 1118], [460, 1118], [450, 880],
  [475, 880], [470, 1118], [590, 1118], [585, 880]
];

/**
 * Biến đổi trực tiếp màu sắc pixel của bức ảnh cổ phục
 * Không dùng SVG phủ ngoài, không làm giả tạo bức ảnh
 */
export async function recolorCostumePhoto(
  baseImageUrl: string,
  outerColorHex: string,
  bottomColorHex: string,
  costumeId: string
): Promise<string> {
  const cacheKey = `${baseImageUrl}-${outerColorHex}-${bottomColorHex}-${costumeId}`;
  if (recolorCache.has(cacheKey)) {
    return recolorCache.get(cacheKey)!;
  }

  const img = await preloadImage(baseImageUrl);
  const width = img.naturalWidth || 896;
  const height = img.naturalHeight || 1200;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) return baseImageUrl;

  // 1. Vẽ ảnh gốc vào canvas
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Lấy dữ liệu pixel trực tiếp
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 3. Chuẩn bị thông số màu đích (Áo ngoài & Quần hạ y)
  const cleanOuter = outerColorHex.replace('#', '');
  const or = parseInt(cleanOuter.substring(0, 2), 16);
  const og = parseInt(cleanOuter.substring(2, 4), 16);
  const ob = parseInt(cleanOuter.substring(4, 6), 16);
  const [outerH, outerS, outerL] = rgbToHsl(or, og, ob);

  const cleanBottom = bottomColorHex.replace('#', '');
  const br = parseInt(cleanBottom.substring(0, 2), 16);
  const bg = parseInt(cleanBottom.substring(2, 4), 16);
  const bb = parseInt(cleanBottom.substring(4, 6), 16);
  const [bottomH, bottomS, bottomL] = rgbToHsl(br, bg, bb);

  // Hệ số scale tọa độ nếu kích thước ảnh khác 896x1200
  const sx = width / 896;
  const sy = height / 1200;

  // Thang đo độ sáng màu đích để boost độ sáng lụa nếu màu đích là màu sáng (Vàng, Trắng, Đỏ tươi)
  const outerLBoost = outerL > 0.45 ? 1.6 : outerL > 0.35 ? 1.35 : 1.15;
  const bottomLBoost = bottomL > 0.45 ? 1.5 : bottomL > 0.35 ? 1.3 : 1.15;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Chuẩn hóa tọa độ về hệ 896x1200
      const normX = x / sx;
      const normY = y / sy;

      const inRobe = isPointInPoly(normX, normY, NGU_THAN_ROBE_POLY);
      const inPants = isPointInPoly(normX, normY, NGU_THAN_PANTS_POLY);

      if (!inRobe && !inPants) continue;

      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      // Loại trừ vùng da tay (Bàn tay người mẫu)
      if ((normX >= 335 && normX <= 395 && normY >= 515 && normY <= 655) ||
          (normX >= 575 && normX <= 635 && normY >= 515 && normY <= 655)) {
        continue;
      }

      // Loại trừ cằm & cổ áo
      if (normY <= 246) continue;

      // Loại trừ mép cổ lót trắng và khuy bạc cài áo sáng bóng
      if (r > 205 && g > 205 && b > 205 && normY < 275) continue;
      if (r > 230 && g > 230 && b > 230) continue; // Khuy cài bạc

      // Loại trừ phông nền studio xám nếu lọt vào viền ngoài
      if (Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && r > 68) continue;

      // Nhận diện màu da người (R > G > B và sắc tố ấm)
      if (r > 115 && g > 75 && r > b + 18 && (r - g) < 65) continue;

      // ĐÂY CHÍNH LÀ THỚ VẢI CỔ PHỤC THỰC TẾ!
      // Chuyển đổi HSL trực tiếp trên pixel ảnh
      const [, , l] = rgbToHsl(r, g, b);

      const targetH = inRobe ? outerH : bottomH;
      const targetS = inRobe ? outerS : bottomS;
      const lBoost = inRobe ? outerLBoost : bottomLBoost;

      // Giữ nguyên 100% nếp gấp, đổ bóng và ánh sáng gốc, chỉ thay đổi sắc thái lụa
      const newL = Math.min(0.95, l * lBoost);
      const newS = Math.max(0.46, targetS);

      const [newR, newG, newB] = hslToRgb(targetH, newS, newL);

      data[offset] = newR;
      data[offset + 1] = newG;
      data[offset + 2] = newB;
    }
  }

  // Ghi lại dữ liệu pixel đã được chỉnh sửa trực tiếp
  ctx.putImageData(imgData, 0, 0);

  // Xuất ra chuỗi JPEG chất lượng cao
  const recoloredUrl = canvas.toDataURL('image/jpeg', 0.94);
  recolorCache.set(cacheKey, recoloredUrl);
  return recoloredUrl;
}
