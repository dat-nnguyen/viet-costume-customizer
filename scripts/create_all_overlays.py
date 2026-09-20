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

art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

for cid in COSTUMES:
    img = cv2.imread(f'public/costumes/{cid}.jpg')
    m = cv2.imread(f'public/costumes/masks/{cid}.png', 0)
    if m is None:
        continue
    overlay = img.copy()
    overlay[m == 1] = [0, 255, 0] # Green = Robe
    overlay[m == 2] = [255, 0, 0] # Blue = Pants
    
    blended = cv2.addWeighted(img, 0.6, overlay, 0.4, 0)
    cv2.imwrite(f'{art_dir}/overlay_{cid}.jpg', blended)

print("Saved all 8 overlays!")
