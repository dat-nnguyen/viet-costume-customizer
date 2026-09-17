import React from 'react';
import { HeritageColor } from '../types';

interface GarmentColorOverlayProps {
  outerColor: HeritageColor;
  innerColor: HeritageColor;
  bottomColor: HeritageColor;
  costumeId: string;
}

// Kiểm tra xem màu có độ sáng cao (như Vàng Hoàng Yến, Trắng Ngà, Vàng Mỡ Gà) không
function isHighLuminance(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

export const GarmentColorOverlay: React.FC<GarmentColorOverlayProps> = ({
  outerColor,
  innerColor,
  bottomColor,
  costumeId,
}) => {
  const isLightOuter = isHighLuminance(outerColor.hex);

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-300"
      style={{ zIndex: 15 }}
    >
      <svg 
        viewBox="0 0 896 1200" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Lớp ánh tơ tằm óng ả đặc trưng của lụa Vạn Phúc & Gấm Nam Cao */}
          <linearGradient id="silk-luster-hd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#000000" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>

          {/* Vùng thân áo ngoài chuẩn xác 100% theo giải phẫu người mẫu 896x1200 */}
          <clipPath id="robe-outer-clip-hd">
            {costumeId === 'tu_than' ? (
              // Áo Tứ Thân: Hai vạt trước buông rủ xẻ giữa khoe yếm
              <path d="M 400,190 
                       C 350,230 310,310 280,420 
                       C 280,520 315,620 320,620
                       L 340,720 L 350,880 
                       L 420,880 L 420,380 L 476,380 L 476,880 L 580,880 
                       L 570,720 L 590,620 
                       C 625,520 628,420 600,310 
                       C 545,230 496,190 496,190 
                       Q 448,210 400,190 Z" />
            ) : costumeId === 'ba_ba' ? (
              // Áo Bà Ba: Dáng ngắn ngang hông (y~640) xẻ tà hai bên
              <path d="M 400,190 
                       C 350,230 310,310 280,400 
                       C 280,490 315,570 320,570
                       L 330,640 L 566,640 
                       L 576,570 
                       C 620,490 625,400 600,310 
                       C 545,230 496,190 496,190 
                       Q 448,210 400,190 Z" />
            ) : (
              // Áo Ngũ Thân, Áo Tấc, Nhật Bình, Giao Lĩnh, Áo Dài Tân Thời
              <path d="M 400,190 
                       C 350,230 310,310 280,420 
                       C 280,520 315,620 320,620
                       L 340,720 L 350,880 
                       L 580,880 
                       L 570,720 L 590,620 
                       C 625,520 628,420 600,310 
                       C 545,230 496,190 496,190 
                       Q 448,210 400,190 Z" />
            )}
          </clipPath>

          {/* Vùng quần lụa / chân váy hạ y (896x1200) */}
          <clipPath id="bottom-trousers-clip-hd">
            <path d="M 345,880 L 340,980 L 345,1125 L 450,1125 L 440,980 L 450,880 
                     M 475,880 L 485,980 L 475,1125 L 580,1125 L 585,980 L 580,880 Z" />
          </clipPath>

          {/* Vùng cổ lót trong (Inner Collar Trim) */}
          <clipPath id="inner-collar-clip-hd">
            <path d="M 420,185 Q 448,202 476,185 L 476,196 Q 448,212 420,196 Z" />
          </clipPath>
        </defs>

        {/* 1. THÂN ÁO NGOÀI (Outer Robe Color Overlay) */}
        <g clipPath="url(#robe-outer-clip-hd)">
          {/* Lớp sắc tố chính (Hue & Saturation) */}
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill={outerColor.hex} 
            style={{ mixBlendMode: 'color', opacity: 0.88 }}
          />

          {/* Lớp chiều sâu thớ vải (Soft-light) */}
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill={outerColor.hex} 
            style={{ mixBlendMode: 'soft-light', opacity: 0.65 }}
          />

          {/* Tăng độ sáng tự nhiên cho các màu sáng (Vàng, Trắng, Đỏ tươi, Hồng) */}
          {isLightOuter && (
            <rect 
              x="0" 
              y="0" 
              width="896" 
              height="1200" 
              fill={outerColor.hex} 
              style={{ mixBlendMode: 'screen', opacity: 0.42 }}
            />
          )}

          {/* Ánh tơ tằm cao cấp */}
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill="url(#silk-luster-hd)" 
            style={{ mixBlendMode: 'overlay', opacity: 0.35 }}
          />
        </g>

        {/* 2. QUẦN LỤA / HẠ Y (Trousers / Bottom Overlay) */}
        <g clipPath="url(#bottom-trousers-clip-hd)">
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill={bottomColor.hex} 
            style={{ mixBlendMode: 'color', opacity: 0.85 }}
          />
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill={bottomColor.hex} 
            style={{ mixBlendMode: 'soft-light', opacity: 0.5 }}
          />
          {isHighLuminance(bottomColor.hex) && (
            <rect 
              x="0" 
              y="0" 
              width="896" 
              height="1200" 
              fill={bottomColor.hex} 
              style={{ mixBlendMode: 'screen', opacity: 0.38 }}
            />
          )}
        </g>

        {/* 3. CỔ LÓT TRONG (Inner Collar Trim) */}
        <g clipPath="url(#inner-collar-clip-hd)">
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill={innerColor.hex} 
            style={{ mixBlendMode: 'color', opacity: 0.95 }}
          />
          <rect 
            x="0" 
            y="0" 
            width="896" 
            height="1200" 
            fill={innerColor.hex} 
            style={{ mixBlendMode: 'screen', opacity: 0.35 }}
          />
        </g>
      </svg>
    </div>
  );
};
