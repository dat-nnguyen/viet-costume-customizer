import os
import cv2
import numpy as np

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

artifact_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

for cid in COSTUMES:
    img = cv2.imread(f'public/costumes/{cid}.jpg')
    mask = cv2.imread(f'public/costumes/masks/{cid}.png', 0)
    if mask is None:
        print(f"Mask missing for {cid}")
        continue
    
    # Recolor with HLS
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    
    # Robe -> Purple (H = 150)
    robe_idx = (mask == 1)
    hls[robe_idx, 0] = 150
    hls[robe_idx, 2] = np.clip(hls[robe_idx, 2].astype(int) + 30, 80, 255).astype(np.uint8)
    
    # Pants -> Gold (H = 22)
    pants_idx = (mask == 2)
    hls[pants_idx, 0] = 22
    hls[pants_idx, 2] = np.clip(hls[pants_idx, 2].astype(int) + 30, 80, 255).astype(np.uint8)
    
    recolored = cv2.cvtColor(hls, cv2.COLOR_HLS2BGR)
    cv2.imwrite(f'{artifact_dir}/current_{cid}.jpg', recolored)
    print(f"[{cid}] Robe px: {np.sum(robe_idx)}, Pants px: {np.sum(pants_idx)}")

print("Done rendering current masks!")
