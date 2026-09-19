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

// Per-costume fabric boundary & color recognition profile
interface CostumeRecolorConfig {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  pantsMinY?: number;
  pantsMaxY?: number;
  isRobe: (p: { r: number; g: number; b: number }, h: number, s: number, l: number, x: number, y: number) => boolean;
}

const COSTUME_CONFIGS: Record<string, CostumeRecolorConfig> = {
  ngu_than_chen: {
    minX: 240, maxX: 660, minY: 245, maxY: 885,
    pantsMinY: 885, pantsMaxY: 1125,
    isRobe: (p, h, s) => (p.b > p.r + 2) || (h >= 190 && h <= 255 && s > 0.12)
  },
  ao_tac: {
    minX: 250, maxX: 680, minY: 258, maxY: 800,
    pantsMinY: 800, pantsMaxY: 1130,
    isRobe: (p, h, _s, _l, x, y) => {
      if (y < 258 && x > 470 && x < 550) return false; // chin / neck
      if (h >= 32 && h <= 55 && p.g > 105) return false; // golden dragon embroidery
      return (h >= 335 || h <= 25) && p.r > p.g + 16 && p.r > p.b + 16;
    }
  },
  nhat_binh: {
    minX: 300, maxX: 680, minY: 245, maxY: 750,
    pantsMinY: 750, pantsMaxY: 1130,
    isRobe: (p, h, s, l, x, y) => {
      // Exclude chest phoenix embroidery
      if (x > 410 && x < 515 && y > 260 && y < 380 && (p.b > 60 || p.g > p.r)) return false;
      return h >= 24 && h <= 58 && ((s > 0.35 && p.b < 65) || (s > 0.50 && p.b < 80)) && l < 0.88;
    }
  },
  giao_linh: {
    minX: 240, maxX: 690, minY: 245, maxY: 940,
    pantsMinY: 940, pantsMaxY: 1130,
    isRobe: (p, h, s, l) => {
      if (h >= 30 && h <= 55 && p.g > 115) return false; // gold sash
      return h >= 142 && h <= 196 && s > 0.15 && l < 0.72;
    }
  },
  tu_than: {
    minX: 310, maxX: 650, minY: 250, maxY: 870,
    pantsMinY: 870, pantsMaxY: 1130,
    isRobe: (_p, h, s, l, x, y) => {
      if (x > 490 && y > 400 && y < 660) return false; // bamboo conical hat
      if (x > 450 && x < 550 && y > 250 && y < 400 && (h > 330 || h < 10 || s > 0.40)) return false; // pink yếm
      return h >= 14 && h <= 36 && s > 0.18 && l < 0.55;
    }
  },
  ba_ba: {
    minX: 320, maxX: 630, minY: 240, maxY: 690,
    pantsMinY: 700, pantsMaxY: 1125,
    isRobe: (p, h, s) => {
      if (Math.max(p.r, p.g, p.b) - Math.min(p.r, p.g, p.b) < 18) return false; // checkered scarf
      return h >= 135 && h <= 185 && s > 0.18 && p.g > p.r + 5;
    }
  },
  doi_kham: {
    minX: 250, maxX: 680, minY: 245, maxY: 890,
    pantsMinY: 890, pantsMaxY: 1130,
    isRobe: (p, h, s) => {
      if (h >= 30 && h <= 55 && p.g > 105) return false; // gold dragons
      return h >= 270 && h <= 345 && s > 0.15;
    }
  },
  ao_dai_tan_thoi: {
    minX: 300, maxX: 630, minY: 240, maxY: 1020,
    pantsMinY: 880, pantsMaxY: 1125,
    isRobe: (_p, h, s, l, _x, y) => {
      if (y > 600 && l > 0.82 && s < 0.16) return false; // white silk trousers
      return (h >= 330 || h <= 20) && s > 0.10 && l > 0.35 && l < 0.88;
    }
  }
};

/**
 * Preload toàn bộ ảnh cổ phục vào bộ nhớ đệm
 */
export function preloadAllCostumes(imageUrls: string[]): void {
  imageUrls.forEach(url => {
    preloadImage(url).catch(() => {});
  });
}

/**
 * Biến đổi trực tiếp màu sắc pixel của bức ảnh cổ phục
 * Hỗ trợ chuẩn xác 100% cả 8 dòng Cổ phục truyền thống
 */
export async function recolorCostumePhoto(
  baseImageUrl: string,
  outerColorHex: string,
  bottomColorHex: string,
  costumeId: string,
  isOuterCustom: boolean = true,
  isBottomCustom: boolean = false
): Promise<string> {
  const cacheKey = `${baseImageUrl}-${outerColorHex}-${bottomColorHex}-${costumeId}-${isOuterCustom}-${isBottomCustom}`;
  if (recolorCache.has(cacheKey)) {
    return recolorCache.get(cacheKey)!;
  }

  // Nếu cả hai màu đều là màu nguyên bản, trả về ảnh gốc ngay lập tức
  if (!isOuterCustom && !isBottomCustom) {
    return baseImageUrl;
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

  const cleanBottom = (bottomColorHex || outerColorHex).replace('#', '');
  const br = parseInt(cleanBottom.substring(0, 2), 16);
  const bg = parseInt(cleanBottom.substring(2, 4), 16);
  const bb = parseInt(cleanBottom.substring(4, 6), 16);
  const [bottomH, bottomS, bottomL] = rgbToHsl(br, bg, bb);

  // Hệ số scale tọa độ nếu kích thước ảnh khác 896x1200
  const sx = width / 896;
  const sy = height / 1200;

  const outerLBoost = outerL > 0.45 ? 1.45 : outerL > 0.35 ? 1.25 : 1.12;
  const bottomLBoost = bottomL > 0.45 ? 1.45 : bottomL > 0.35 ? 1.25 : 1.12;

  const config = COSTUME_CONFIGS[costumeId] || COSTUME_CONFIGS.ngu_than_chen;

  const startY = Math.max(0, Math.floor(config.minY * sy));
  const endY = Math.min(height, Math.ceil((isBottomCustom && config.pantsMaxY ? config.pantsMaxY : config.maxY) * sy));
  const startX = Math.max(0, Math.floor(config.minX * sx));
  const endX = Math.min(width, Math.ceil(config.maxX * sx));

  for (let y = startY; y < endY; y++) {
    const normY = Math.floor(y / sy);
    const rowOffset = y * width;

    for (let x = startX; x < endX; x++) {
      const normX = Math.floor(x / sx);
      const offset = (rowOffset + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];

      // Loại trừ specular highlight và khuy cài sáng bóng
      if (r > 240 && g > 240 && b > 240) continue;
      // Loại trừ mép cổ lót trắng ngà
      if (normY < 275 && r > 200 && g > 200 && b > 200) continue;

      const [h, s, l] = rgbToHsl(r, g, b);

      // Loại trừ da người (khuôn mặt, cằm, cổ, bàn tay)
      if (r > 115 && g > 75 && b > 45 && r > g && g > b && (r - b) > 20 && (r - g) < 70 && (h >= 10 && h <= 36)) {
        continue;
      }

      const isRobeRegion = normY <= config.maxY;
      let shouldRecolor = false;
      let targetH = outerH;
      let targetS = outerS;
      let lBoost = outerLBoost;

      if (isOuterCustom && isRobeRegion && config.isRobe({ r, g, b }, h, s, l, normX, normY)) {
        shouldRecolor = true;
        targetH = outerH;
        targetS = outerS;
        lBoost = outerLBoost;
      } else if (isBottomCustom && !isRobeRegion && config.pantsMinY && normY >= config.pantsMinY) {
        // Chỉ đổi màu quần khi người dùng chủ động chọn đổi màu Quần/Váy
        const chroma = Math.max(r, g, b) - Math.min(r, g, b);
        if (chroma > 12 && l < 0.85) {
          shouldRecolor = true;
          targetH = bottomH;
          targetS = bottomS;
          lBoost = bottomLBoost;
        }
      }

      if (!shouldRecolor) continue;

      // Giữ nguyên 100% nếp gấp, đổ bóng và ánh sáng gốc, chỉ thay đổi sắc thái lụa
      const newL = Math.min(0.96, Math.max(0.04, l * lBoost));
      const newS = Math.min(1.0, Math.max(0.44, targetS));

      const [newR, newG, newB] = hslToRgb(targetH, newS, newL);

      data[offset] = newR;
      data[offset + 1] = newG;
      data[offset + 2] = newB;
    }
  }

  // Ghi lại dữ liệu pixel đã được chỉnh sửa trực tiếp
  ctx.putImageData(imgData, 0, 0);

  // Xuất ra chuỗi JPEG chất lượng cao
  const recoloredUrl = canvas.toDataURL('image/jpeg', 0.90);
  recolorCache.set(cacheKey, recoloredUrl);
  return recoloredUrl;
}
