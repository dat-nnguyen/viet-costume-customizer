import os
import cv2
import numpy as np

def recolor_photo_vectorized(img_path, mask_path, target_hex_robe="#8B5CF6", target_hex_pants="#EAB308"):
    img = cv2.imread(img_path)
    mask = cv2.imread(mask_path, 0)
    out = img.copy()
    
    # HLS conversion
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS).astype(np.float32)
    
    # Parse target colors in HLS
    robe_bgr = np.uint8([[[int(target_hex_robe[5:7], 16), int(target_hex_robe[3:5], 16), int(target_hex_robe[1:3], 16)]]])
    robe_hls = cv2.cvtColor(robe_bgr, cv2.COLOR_BGR2HLS)[0, 0]
    
    pants_bgr = np.uint8([[[int(target_hex_pants[5:7], 16), int(target_hex_pants[3:5], 16), int(target_hex_pants[1:3], 16)]]])
    pants_hls = cv2.cvtColor(pants_bgr, cv2.COLOR_BGR2HLS)[0, 0]
    
    # Apply to Robe (mask >= 50 and mask < 150)
    m1 = (mask >= 50) & (mask < 150)
    if np.any(m1):
        hls[m1, 0] = robe_hls[0]
        hls[m1, 2] = np.clip(robe_hls[2] * 0.9 + hls[m1, 2] * 0.3, 100, 255)
        hls[m1, 1] = np.clip(hls[m1, 1] * 1.25, 15, 245)
        
    # Apply to Pants (mask >= 150)
    m2 = (mask >= 150)
    if np.any(m2):
        hls[m2, 0] = pants_hls[0]
        hls[m2, 2] = np.clip(pants_hls[2] * 0.9 + hls[m2, 2] * 0.3, 100, 255)
        hls[m2, 1] = np.clip(hls[m2, 1] * 1.25, 15, 245)
        
    recolored_all = cv2.cvtColor(hls.astype(np.uint8), cv2.COLOR_HLS2BGR)
    out[m1 | m2] = recolored_all[m1 | m2]
    return out

COSTUMES = [
    'ngu_than_chen',
    'ao_tac',
    'nhat_binh',
    'giao_linh',
    'tu_than',
    'ba_ba',
    'doi_kham',
    'ao_dai_tan_thoi'
]

art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

for cid in COSTUMES:
    res = recolor_photo_vectorized(f'public/costumes/{cid}.jpg', f'public/costumes/masks/{cid}.png')
    cv2.imwrite(f'{art_dir}/recolored_{cid}.jpg', res, [cv2.IMWRITE_JPEG_QUALITY, 95])
    print(f"Recolored {cid} done!")

print("All 8 costumes recolored!")
