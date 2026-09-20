// Intelligent In-Image Photographic Recolor Engine
// Biến đổi trực tiếp màu sắc thớ vải trên ảnh gốc (Pixel-Level Photographic Recolor)
// Sử dụng bản đồ phân đoạn điểm ảnh cực chuẩn (Segmentation Mask PNG) cho cả 8 dòng Cổ Phục
// Giữ nguyên 100% nếp gấp, độ bóng, độ sâu, khuy cài kim loại, hoa văn thêu, màu da và phông nền studio

const recolorCache = new Map<string, string>();
const imageElementCache = new Map<string, HTMLImageElement>();
const maskDataCache = new Map<string, Uint8ClampedArray>();

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

// Tải và đệm trước dữ liệu pixel của mặt nạ phân đoạn (Segmentation Mask)
async function getMaskData(costumeId: string, width: number, height: number): Promise<Uint8ClampedArray | null> {
  const cacheKey = `${costumeId}-${width}x${height}`;
  if (maskDataCache.has(cacheKey)) {
    return maskDataCache.get(cacheKey)!;
  }

  try {
    const maskUrl = `/costumes/masks/${costumeId}.png`;
    const maskImg = await preloadImage(maskUrl);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(maskImg, 0, 0, width, height);
    const data = ctx.getImageData(0, 0, width, height).data;
    maskDataCache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`[photoRecolorService] Không tải được mask cho ${costumeId}:`, err);
    return null;
  }
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

/**
 * Preload toàn bộ ảnh cổ phục và mask tương ứng vào bộ nhớ đệm
 */
export function preloadAllCostumes(imageUrls: string[]): void {
  imageUrls.forEach(url => {
    preloadImage(url).catch(() => {});
    // Preload mask tương ứng
    const filename = url.split('/').pop()?.replace('.jpg', '') || '';
    if (filename) {
      preloadImage(`/costumes/masks/${filename}.png`).catch(() => {});
    }
  });
}

/**
 * Biến đổi trực tiếp màu sắc pixel của bức ảnh cổ phục
 * Hỗ trợ chuẩn xác 100% cả 8 dòng Cổ phục truyền thống
 * Không lem màu nền, không đổi màu da hay hoa văn thêu
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

  // Nếu cả hai màu đều là màu nguyên bản, trả về ảnh gốc ngay lập tức (0ms)
  if (!isOuterCustom && !isBottomCustom) {
    return baseImageUrl;
  }

  const img = await preloadImage(baseImageUrl);
  const width = img.naturalWidth || 896;
  const height = img.naturalHeight || 1200;

  // Lấy dữ liệu mặt nạ phân đoạn chính xác theo pixel
  const maskData = await getMaskData(costumeId, width, height);

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

  const outerLBoost = outerL > 0.45 ? 1.45 : outerL > 0.35 ? 1.25 : 1.12;
  const bottomLBoost = bottomL > 0.45 ? 1.45 : bottomL > 0.35 ? 1.25 : 1.12;

  const totalPixels = width * height;

  for (let i = 0; i < totalPixels; i++) {
    const offset = i * 4;

    // Đọc giá trị mặt nạ: 100 = Áo ngoài, 200 = Quần/Hạ y, 0 = Không đổi (nền/da/hoa văn)
    const maskVal = maskData ? maskData[offset] : 0;

    let shouldRecolor = false;
    let targetH = outerH;
    let targetS = outerS;
    let lBoost = outerLBoost;

    if (isOuterCustom && maskVal >= 50 && maskVal < 150) {
      shouldRecolor = true;
      targetH = outerH;
      targetS = outerS;
      lBoost = outerLBoost;
    } else if (isBottomCustom && maskVal >= 150) {
      shouldRecolor = true;
      targetH = bottomH;
      targetS = bottomS;
      lBoost = bottomLBoost;
    }

    if (!shouldRecolor) continue;

    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    const [, , l] = rgbToHsl(r, g, b);

    // Giữ nguyên 100% nếp gấp, đổ bóng và ánh sáng thực tế của thớ vải
    const newL = Math.min(0.96, Math.max(0.04, l * lBoost));
    const newS = Math.min(1.0, Math.max(0.44, targetS));

    const [newR, newG, newB] = hslToRgb(targetH, newS, newL);

    data[offset] = newR;
    data[offset + 1] = newG;
    data[offset + 2] = newB;
  }

  // Ghi lại dữ liệu pixel đã được chỉnh sửa trực tiếp
  ctx.putImageData(imgData, 0, 0);

  // Xuất ra chuỗi JPEG chất lượng cao
  const recoloredUrl = canvas.toDataURL('image/jpeg', 0.92);
  recolorCache.set(cacheKey, recoloredUrl);
  return recoloredUrl;
}
