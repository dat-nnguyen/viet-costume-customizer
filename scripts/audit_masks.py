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

print("=== AUDITING ALL 8 MASKS ===")
for cid in COSTUMES:
    m = cv2.imread(f'public/costumes/masks/{cid}.png', 0)
    img = cv2.imread(f'public/costumes/{cid}.jpg')
    h, w = m.shape
    y, x = np.indices((h, w))
    
    # 1. Total robe and pants pixels
    robe_cnt = np.sum(m == 1)
    pants_cnt = np.sum(m == 2)
    
    # 2. Check top region (hair, face, background above y=230)
    top_bleed = np.sum((m > 0) & (y < 230))
    
    # 3. Check left/right background wall bleed (x < 200 or x > 720)
    bg_bleed = np.sum((m > 0) & ((x < 200) | (x > 720)))
    
    # 4. Check bottom floor bleed (y > 1130)
    floor_bleed = np.sum((m > 0) & (y > 1130))
    
    print(f"[{cid:16s}] Robe: {robe_cnt:6d} | Pants: {pants_cnt:6d} | TopBleed: {top_bleed:4d} | BgBleed: {bg_bleed:4d} | FloorBleed: {floor_bleed:4d}")
