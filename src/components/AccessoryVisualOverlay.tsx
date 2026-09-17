import React from 'react';

interface AccessoryVisualOverlayProps {
  selectedAccessories: string[];
}

export const AccessoryVisualOverlay: React.FC<AccessoryVisualOverlayProps> = ({
  selectedAccessories,
}) => {
  const isSelected = (id: string) => selectedAccessories.includes(id);

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: 25 }}
    >
      
      {/* 1. MŨ NỒI BERET LEN VINTAGE (Đông Dương thế kỷ 20) */}
      {isSelected('mu_beret') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '4.5%',
            left: '50%',
            transform: 'translateX(-48%) rotate(-3deg)',
            width: '28%',
            aspectRatio: '1.6/1',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.85))'
          }}
        >
          <svg viewBox="0 0 120 75" className="w-full h-full">
            {/* Đáy viền mũ beret ôm trán */}
            <ellipse cx="60" cy="52" rx="44" ry="13" fill="#1b1c22" stroke="#353744" strokeWidth="1.5" />
            {/* Vòm nón beret len nghiêng chất nghệ sĩ */}
            <path 
              d="M16 48 C12 26, 32 10, 66 12 C98 14, 112 28, 105 50 C98 62, 24 60, 16 48 Z" 
              fill="#22242e" 
            />
            {/* Nếp gấp len rủ tự nhiên */}
            <path d="M36 24 Q60 34 88 26" stroke="#3d4052" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M26 36 Q62 44 96 37" stroke="#14151b" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Nụ tròn trên đỉnh beret */}
            <circle cx="64" cy="11" r="3" fill="#3f4254" />
          </svg>
        </div>
      )}

      {/* 2. KHĂN ĐÓNG / KHĂN XẾP TRUYỀN THỐNG */}
      {isSelected('khan_dong') && !isSelected('mu_beret') && !isSelected('khan_vanh_day') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '5.8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '27%',
            aspectRatio: '1.9/1',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.9))'
          }}
        >
          <svg viewBox="0 0 130 68" className="w-full h-full">
            <ellipse cx="65" cy="44" rx="48" ry="15" fill="#0f1015" stroke="#2b2d38" strokeWidth="1.5" />
            <path d="M20 40 Q65 26 110 40 L108 30 Q65 18 22 30 Z" fill="#1c1e26" stroke="#373948" strokeWidth="1.2" />
            <path d="M23 30 Q65 18 107 30 L105 21 Q65 11 25 21 Z" fill="#13141a" stroke="#2a2c38" strokeWidth="1" />
            <path d="M26 21 Q65 11 104 21 L102 14 Q65 6 28 14 Z" fill="#090a0e" stroke="#1f212a" strokeWidth="1" />
            <path d="M57 28 L65 41 L73 28" stroke="#52556b" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )}

      {/* 3. KHĂN VÀNH DÂY HOÀNG CUNG */}
      {isSelected('khan_vanh_day') && !isSelected('mu_beret') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '2.0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '36%',
            aspectRatio: '1.7/1',
            filter: 'drop-shadow(0 8px 16px rgba(224, 159, 62, 0.5))'
          }}
        >
          <svg viewBox="0 0 160 95" className="w-full h-full">
            <ellipse cx="80" cy="62" rx="66" ry="20" fill="none" stroke="#d4af37" strokeWidth="3.5" opacity="0.95" />
            <ellipse cx="80" cy="55" rx="70" ry="22" fill="none" stroke="#f3c68f" strokeWidth="3" />
            <ellipse cx="80" cy="48" rx="74" ry="24" fill="none" stroke="#e09f3e" strokeWidth="3.5" />
            <ellipse cx="80" cy="41" rx="77" ry="26" fill="none" stroke="#ffd166" strokeWidth="4" />
            <circle cx="80" cy="18" r="5" fill="#e63946" stroke="#ffd166" strokeWidth="2" />
            <circle cx="64" cy="23" r="3.5" fill="#ffd166" />
            <circle cx="96" cy="23" r="3.5" fill="#ffd166" />
          </svg>
        </div>
      )}

      {/* 4. NÓN LÁ SEN XỨ HUẾ */}
      {isSelected('non_la') && !isSelected('mu_beret') && !isSelected('khan_vanh_day') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '1.8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '42%',
            aspectRatio: '1.7/1',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.75))'
          }}
        >
          <svg viewBox="0 0 170 100" className="w-full h-full">
            <polygon points="85,5 8,86 162,86" fill="#f4e8c1" stroke="#cbb27a" strokeWidth="2" />
            <path d="M72 24 Q85 28 98 24" stroke="#c0a263" strokeWidth="1.5" fill="none" />
            <path d="M54 44 Q85 50 116 44" stroke="#c0a263" strokeWidth="1.5" fill="none" />
            <path d="M36 64 Q85 72 134 64" stroke="#c0a263" strokeWidth="1.5" fill="none" />
            <path d="M18 80 Q85 90 152 80" stroke="#c0a263" strokeWidth="1.5" fill="none" />
            <polygon points="85,5 85,86 162,86" fill="#000000" opacity="0.14" />
            <path d="M42 86 Q26 115 38 145" stroke="#c94b4b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M128 86 Q144 115 132 145" stroke="#c94b4b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* 5. NÓN QUAI THAO (Bắc Ninh - Quan Họ) */}
      {isSelected('non_quai_thao') && !isSelected('mu_beret') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '1.0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '48%',
            aspectRatio: '2.1/1',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.75))'
          }}
        >
          <svg viewBox="0 0 190 90" className="w-full h-full">
            <ellipse cx="95" cy="38" rx="90" ry="20" fill="#eddcb2" stroke="#b98a44" strokeWidth="2.5" />
            <ellipse cx="95" cy="36" rx="82" ry="16" fill="#f6ecd2" />
            <circle cx="95" cy="36" r="9" fill="#ca9f56" />
            <path d="M35 46 Q24 90 34 140" stroke="#8b5a2b" strokeWidth="4" fill="none" />
            <path d="M155 46 Q166 90 156 140" stroke="#8b5a2b" strokeWidth="4" fill="none" />
            <circle cx="34" cy="142" r="4.5" fill="#c94b4b" />
            <circle cx="156" cy="142" r="4.5" fill="#c94b4b" />
          </svg>
        </div>
      )}

      {/* 6. KÍNH RÂM RETRO GỌNG KIM LOẠI (Y2K / Streetwear) */}
      {isSelected('kinh_ram_retro') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '12.0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '21%',
            aspectRatio: '2.8/1',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.9))'
          }}
        >
          <svg viewBox="0 0 100 36" className="w-full h-full">
            <path d="M43 14 Q50 10 57 14" stroke="#ffd166" strokeWidth="2.2" fill="none" />
            <rect x="12" y="7" width="30" height="20" rx="8" fill="#0a0c12" stroke="#ffd166" strokeWidth="1.8" />
            <path d="M16 11 L28 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
            <rect x="58" y="7" width="30" height="20" rx="8" fill="#0a0c12" stroke="#ffd166" strokeWidth="1.8" />
            <path d="M62 11 L74 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
            <path d="M12 14 L2 11" stroke="#ffd166" strokeWidth="1.8" />
            <path d="M88 14 L98 11" stroke="#ffd166" strokeWidth="1.8" />
          </svg>
        </div>
      )}

      {/* 7. CHUỖI NGỌC TRAI LAYERING QUANH CỔ */}
      {isSelected('chuoi_ngoc_trai') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '15.6%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '27%',
            aspectRatio: '1.7/1',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.65))'
          }}
        >
          <svg viewBox="0 0 120 70" className="w-full h-full">
            {/* Vòng ngọc ngắn ôm sát chân cổ */}
            {[24, 32, 40, 48, 56, 64, 72, 80, 88, 96].map((pos, idx) => (
              <circle 
                key={`p1-${idx}`} 
                cx={pos} 
                cy={15 + Math.sin((pos - 20) / 76 * Math.PI) * 16} 
                r="3.8" 
                fill="#ffffff" 
                stroke="#d4cfbe" 
                strokeWidth="1" 
              />
            ))}
            {/* Vòng ngọc buông rủ dài sang trọng */}
            {[20, 30, 40, 50, 60, 70, 80, 90, 100].map((pos, idx) => (
              <circle 
                key={`p2-${idx}`} 
                cx={pos} 
                cy={20 + Math.sin((pos - 18) / 82 * Math.PI) * 28} 
                r="4.5" 
                fill="#ffffff" 
                stroke="#d8d3c5" 
                strokeWidth="1.2" 
              />
            ))}
          </svg>
        </div>
      )}

      {/* 8. KHĂN RẰN NAM BỘ VẮT VAI */}
      {isSelected('khan_ran') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '16.2%',
            left: '33%',
            width: '18%',
            aspectRatio: '0.45/1',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.85))'
          }}
        >
          <svg viewBox="0 0 80 180" className="w-full h-full">
            <defs>
              <pattern id="gingham-pattern-overlay" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#ffffff" />
                <rect x="4" width="4" height="4" fill="#1b1c20" />
                <rect y="4" width="4" height="4" fill="#1b1c20" />
                <rect x="4" y="4" width="4" height="4" fill="#696b78" />
              </pattern>
            </defs>
            <path 
              d="M34 0 C48 20, 56 65, 52 120 C48 150, 42 175, 36 180 L14 180 C20 155, 26 105, 22 55 C20 28, 16 10, 12 0 Z" 
              fill="url(#gingham-pattern-overlay)" 
              stroke="#2c2d33" 
              strokeWidth="1.5" 
            />
            {[15, 20, 25, 30, 35].map((x) => (
              <line key={x} x1={x} y1="180" x2={x} y2="186" stroke="#f0f0f0" strokeWidth="2" />
            ))}
          </svg>
        </div>
      )}

      {/* 9. QUẠT XẾP LỤA GẤM TRÊN TAY */}
      {isSelected('quat_xep_gam') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '46.5%',
            left: '63%',
            width: '26%',
            aspectRatio: '1.15/1',
            filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.88))'
          }}
        >
          <svg viewBox="0 0 120 105" className="w-full h-full">
            <path 
              d="M10 82 C20 30, 80 15, 110 55 L75 84 Z" 
              fill="#c94b4b" 
              stroke="#ffd166" 
              strokeWidth="2" 
            />
            <path d="M35 55 Q60 40 85 58" stroke="#ffd166" strokeWidth="2.5" fill="none" opacity="0.9" />
            <path d="M45 42 Q65 32 80 44" stroke="#ffd166" strokeWidth="2" fill="none" opacity="0.8" />
            <line x1="75" y1="84" x2="15" y2="77" stroke="#3d220e" strokeWidth="2.5" />
            <line x1="75" y1="84" x2="35" y2="55" stroke="#3d220e" strokeWidth="2" opacity="0.8" />
            <line x1="75" y1="84" x2="60" y2="40" stroke="#3d220e" strokeWidth="2" opacity="0.8" />
            <line x1="75" y1="84" x2="85" y2="46" stroke="#3d220e" strokeWidth="2" opacity="0.8" />
            <line x1="75" y1="84" x2="105" y2="60" stroke="#3d220e" strokeWidth="2.5" />
            <circle cx="75" cy="84" r="4.5" fill="#ffd166" />
            <path d="M75 87 Q78 98 76 106" stroke="#c94b4b" strokeWidth="3" fill="none" />
          </svg>
        </div>
      )}

      {/* 10. TÚI TOTE CANVAS TRANH ĐÔNG HỒ */}
      {isSelected('tui_tote_dong_ho') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '40.5%',
            left: '15%',
            width: '24%',
            aspectRatio: '0.7/1',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.85))'
          }}
        >
          <svg viewBox="0 0 90 130" className="w-full h-full">
            <path d="M35 0 C24 25, 18 42, 26 52" stroke="#d5cebd" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M55 0 C66 25, 70 42, 64 52" stroke="#d5cebd" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <rect x="18" y="50" width="56" height="70" rx="5" fill="#f5ede0" stroke="#c5baa2" strokeWidth="2" />
            <rect x="26" y="60" width="40" height="42" rx="3" fill="#ecdcc3" stroke="#b9a685" strokeWidth="1" />
            <circle cx="46" cy="78" r="13" fill="#c94b4b" opacity="0.9" />
            <path d="M42 74 Q46 68 50 74 Q46 84 42 74 Z" fill="#ffd166" />
            <text x="46" y="112" fontSize="7.5" fill="#3f3221" textAnchor="middle" fontWeight="bold">ĐÔNG HỒ</text>
          </svg>
        </div>
      )}

      {/* 11. SNEAKERS TRẮNG TỐI GIẢN (Gen Z Streetwear) */}
      {isSelected('sneakers_trang') && !isSelected('chelsea_boots') && !isSelected('guoc_moc') && !isSelected('hai_nhung_theu') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '92.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '38%',
            aspectRatio: '3.2/1',
            filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.92))'
          }}
        >
          <svg viewBox="0 0 160 50" className="w-full h-full">
            {/* Giày trái */}
            <g transform="translate(14, 4)">
              <path d="M8 24 C16 12, 38 12, 54 18 C58 20, 60 25, 58 29 L2 29 C1 26, 4 25, 8 24 Z" fill="#ffffff" stroke="#d0d0d0" strokeWidth="1.2" />
              <rect x="0" y="29" width="60" height="9" rx="3" fill="#f0f0f0" stroke="#b8b8b8" strokeWidth="1" />
              <line x1="28" y1="16" x2="38" y2="20" stroke="#dcdcdc" strokeWidth="2" />
              <line x1="30" y1="20" x2="40" y2="24" stroke="#dcdcdc" strokeWidth="2" />
              <circle cx="50" cy="22" r="2.5" fill="#c94b4b" />
            </g>
            {/* Giày phải */}
            <g transform="translate(86, 4)">
              <path d="M52 24 C44 12, 22 12, 6 18 C2 20, 0 25, 2 29 L58 29 C59 26, 56 25, 52 24 Z" fill="#ffffff" stroke="#d0d0d0" strokeWidth="1.2" />
              <rect x="0" y="29" width="60" height="9" rx="3" fill="#f0f0f0" stroke="#b8b8b8" strokeWidth="1" />
              <line x1="32" y1="16" x2="22" y2="20" stroke="#dcdcdc" strokeWidth="2" />
              <line x1="30" y1="20" x2="20" y2="24" stroke="#dcdcdc" strokeWidth="2" />
              <circle cx="10" cy="22" r="2.5" fill="#c94b4b" />
            </g>
          </svg>
        </div>
      )}

      {/* 12. CHELSEA BOOTS DA ĐEN */}
      {isSelected('chelsea_boots') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '91.8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '38%',
            aspectRatio: '2.6/1',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.95))'
          }}
        >
          <svg viewBox="0 0 160 60" className="w-full h-full">
            <g transform="translate(16, 2)">
              <path d="M12 6 L24 6 L26 24 L54 27 C58 33, 55 40, 50 44 L6 44 C2 35, 4 18, 12 6 Z" fill="#15161b" stroke="#313442" strokeWidth="1.5" />
              <polygon points="17,12 28,12 26,30 20,30" fill="#292b36" />
              <rect x="5" y="44" width="16" height="7" fill="#090a0d" />
              <rect x="5" y="44" width="48" height="4" fill="#252733" />
            </g>
            <g transform="translate(86, 2)">
              <path d="M46 6 L34 6 L32 24 L4 27 C0 33, 3 40, 8 44 L52 44 C56 35, 54 18, 46 6 Z" fill="#15161b" stroke="#313442" strokeWidth="1.5" />
              <polygon points="41,12 30,12 32,30 38,30" fill="#292b36" />
              <rect x="37" y="44" width="16" height="7" fill="#090a0d" />
              <rect x="5" y="44" width="48" height="4" fill="#252733" />
            </g>
          </svg>
        </div>
      )}

      {/* 13. GUỐC MỘC HOA CÚC */}
      {isSelected('guoc_moc') && !isSelected('chelsea_boots') && !isSelected('sneakers_trang') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '92.4%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '36%',
            aspectRatio: '3.3/1',
            filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.85))'
          }}
        >
          <svg viewBox="0 0 150 46" className="w-full h-full">
            <g transform="translate(14, 4)">
              <path d="M4 22 C12 18, 38 18, 50 22 L48 32 C34 31, 10 31, 2 32 Z" fill="#b07d4f" stroke="#7a4f27" strokeWidth="1.5" />
              <rect x="4" y="32" width="9" height="6" fill="#6d441e" />
              <rect x="38" y="32" width="9" height="6" fill="#6d441e" />
              <path d="M16 21 C22 8, 34 8, 40 21" stroke="#c94b4b" strokeWidth="4.5" fill="none" />
              <circle cx="28" cy="13" r="2.5" fill="#ffd166" />
            </g>
            <g transform="translate(84, 4)">
              <path d="M48 22 C40 18, 14 18, 2 22 L4 32 C18 31, 42 31, 50 32 Z" fill="#b07d4f" stroke="#7a4f27" strokeWidth="1.5" />
              <rect x="40" y="32" width="9" height="6" fill="#6d441e" />
              <rect x="6" y="32" width="9" height="6" fill="#6d441e" />
              <path d="M36 21 C30 8, 18 8, 12 21" stroke="#c94b4b" strokeWidth="4.5" fill="none" />
              <circle cx="24" cy="13" r="2.5" fill="#ffd166" />
            </g>
          </svg>
        </div>
      )}

      {/* 14. HÀI NHUNG THÊU CHỈ VÀNG */}
      {isSelected('hai_nhung_theu') && !isSelected('chelsea_boots') && !isSelected('sneakers_trang') && !isSelected('guoc_moc') && (
        <div 
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: '92.4%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '36%',
            aspectRatio: '3.3/1',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.9))'
          }}
        >
          <svg viewBox="0 0 150 46" className="w-full h-full">
            <g transform="translate(16, 6)">
              <path d="M4 22 C14 13, 40 14, 50 18 C54 15, 56 17, 54 23 L6 26 Z" fill="#9e2a2b" stroke="#ffd166" strokeWidth="1.5" />
              <path d="M22 17 Q34 15 44 20" stroke="#ffd166" strokeWidth="2" fill="none" />
            </g>
            <g transform="translate(84, 6)">
              <path d="M48 22 C38 13, 12 14, 2 18 C-2 15, -4 17, -2 23 L46 26 Z" fill="#9e2a2b" stroke="#ffd166" strokeWidth="1.5" />
              <path d="M30 17 Q18 15 8 20" stroke="#ffd166" strokeWidth="2" fill="none" />
            </g>
          </svg>
        </div>
      )}

    </div>
  );
};
