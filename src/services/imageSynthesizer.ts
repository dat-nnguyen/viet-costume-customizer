import { Costume, OutfitState } from '../types';
import { recolorCostumePhoto } from './photoRecolorService';
import { ACCESSORIES_DATA } from '../data/accessoriesData';

interface SynthesizerOptions {
  costume: Costume;
  outfit: OutfitState;
  faceImageUrl?: string;
  faceScale?: number;
  faceOffsetX?: number;
  faceOffsetY?: number;
  faceRotation?: number;
  faceBrightness?: number;
}

// Helper: Tải ảnh bất đồng bộ an toàn
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * AI Synthesizer Engine (1200x1600px High-Resolution Portrait Compositor):
 * 1. Chỉnh sửa màu sắc pixel thớ vải trang phục trực tiếp (Không dùng SVG đè)
 * 2. Ghép khuôn mặt người dùng với viền lông vũ tự nhiên (Soft Feather Mask)
 * 3. Bố cục Lookbook Haute Couture cao cấp & Chứng nhận chuẩn mực văn hóa (Cultural Guardian)
 */
export async function synthesizeCostumePortrait(options: SynthesizerOptions): Promise<string> {
  const { 
    costume, 
    outfit, 
    faceImageUrl,
    faceScale = 1.15,
    faceOffsetX = 0,
    faceOffsetY = 0,
    faceRotation = 0,
    faceBrightness = 100
  } = options;

  const width = 1200;
  const height = 1600;

  const isOuterCustom = outfit.outerColor.id !== costume.defaultColors.outer;
  const isBottomCustom = outfit.bottomColor.id !== costume.defaultColors.bottom;

  // 1. Biến đổi màu sắc trực tiếp trên ảnh gốc bằng Engine Pixel-Level HSL
  const recoloredImageUrl = await recolorCostumePhoto(
    costume.imageUrl,
    outfit.outerColor.hex,
    outfit.bottomColor.hex,
    costume.id,
    isOuterCustom,
    isBottomCustom
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D Context không khả dụng');
  }

  // 2. Vẽ ảnh trang phục đã được đổi màu trực tiếp (100% chi tiết thớ vải, bóng đổ thực tế)
  const baseImg = await loadImage(recoloredImageUrl);
  ctx.drawImage(baseImg, 0, 0, width, height);

  // 3. GHÉP MẶT NGƯỜI DÙNG VỚI MẶT NẠ LÔNG VŨ TỰ NHIÊN
  const targetFaceUrl = faceImageUrl || outfit.customFace?.imageUrl;
  if (targetFaceUrl) {
    try {
      const faceImg = await loadImage(targetFaceUrl);
      
      const effectiveScale = faceScale || outfit.customFace?.scale || 1.15;
      const faceW = 220 * effectiveScale;
      const faceH = 285 * effectiveScale;
      // Tọa độ trung tâm khuôn mặt trên hệ ảnh 1200x1600
      const centerX = width * 0.5 + (faceOffsetX || outfit.customFace?.offsetX || 0) * 2.2;
      const centerY = height * 0.133 + (faceOffsetY || outfit.customFace?.offsetY || 0) * 2.2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(((faceRotation || outfit.customFace?.rotation || 0) * Math.PI) / 180);

      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = faceW;
      faceCanvas.height = faceH;
      const faceCtx = faceCanvas.getContext('2d');

      if (faceCtx) {
        const brightnessVal = faceBrightness || outfit.customFace?.brightness || 100;
        faceCtx.filter = `brightness(${brightnessVal}%) contrast(102%) saturate(98%)`;
        faceCtx.drawImage(faceImg, 0, 0, faceW, faceH);

        // Mặt nạ oval mềm mại
        faceCtx.globalCompositeOperation = 'destination-in';
        const radGrad = faceCtx.createRadialGradient(
          faceW / 2, faceH / 2, faceW * 0.28,
          faceW / 2, faceH / 2, faceW * 0.49
        );
        radGrad.addColorStop(0, 'rgba(0,0,0,1)');
        radGrad.addColorStop(0.72, 'rgba(0,0,0,0.92)');
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');

        faceCtx.fillStyle = radGrad;
        faceCtx.fillRect(0, 0, faceW, faceH);

        // Vẽ khuôn mặt lên ảnh
        ctx.drawImage(faceCanvas, -faceW / 2, -faceH / 2);
      }

      ctx.restore();
    } catch (faceErr) {
      console.warn('Không thể ghép khuôn mặt, giữ khuôn mặt người mẫu gốc:', faceErr);
    }
  }

  // 4. BỐ CỤC BÌA TẠP CHÍ HAUTE COUTURE ĐẲNG CẤP Ở ĐÁY ẢNH
  ctx.save();
  const grad = ctx.createLinearGradient(0, height - 190, 0, height);
  grad.addColorStop(0, 'rgba(9, 10, 15, 0)');
  grad.addColorStop(0.35, 'rgba(9, 10, 15, 0.85)');
  grad.addColorStop(1, 'rgba(9, 10, 15, 0.98)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, height - 190, width, 190);

  // Logo thương hiệu Việt Phục Remix
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
  ctx.fillText('VIỆT PHỤC REMIX', 60, height - 110);

  // Tên trang phục & Sắc lụa Ngũ Hành
  ctx.fillStyle = '#e09f3e';
  ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`✦ ${costume.name.toUpperCase()} — SẮC LỤA ${outfit.outerColor.name.toUpperCase()}`, 60, height - 70);

  // Danh sách các món phụ kiện đang remix
  const activeNames = outfit.selectedAccessories
    .map(id => ACCESSORIES_DATA.find(a => a.id === id)?.name)
    .filter(Boolean);

  if (activeNames.length > 0) {
    ctx.fillStyle = '#f3c68f';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Phụ kiện Remix: ${activeNames.join(' • ')}`, 60, height - 35);
  }

  // Tiêu đề & Chứng nhận Di sản
  ctx.fillStyle = '#d1d5db';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('DI SẢN NGUYÊN BẢN & PHONG CÁCH GEN Z', width - 60, height - 90);

  ctx.fillStyle = '#52b788';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('✓ CULTURAL GUARDIAN CERTIFIED', width - 60, height - 50);
  ctx.restore();

  // 5. Xuất ra định dạng JPEG chất lượng cao 94%
  return canvas.toDataURL('image/jpeg', 0.94);
}
