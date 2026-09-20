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

def get_skin(img):
    # Skin detection using YCrCb + HSV
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    cr = ycrcb[:,:,1]
    cb = ycrcb[:,:,2]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h = hsv[:,:,0]
    s = hsv[:,:,1]
    v = hsv[:,:,2]
    # Skin in HSV: H in [0..25] or [165..180], S in [20..180], V in [60..255]
    # and Cr > Cb + 10
    skin = (cr > cb + 10) & (cr >= 135) & (cr <= 180) & (cb >= 85) & (cb <= 140)
    # Further refine with hue
    skin &= ((h <= 25) | (h >= 165)) & (s >= 20) & (v >= 60)
    return skin

for cid in COSTUMES:
    m = cv2.imread(f'public/costumes/masks/{cid}.png', 0)
    img = cv2.imread(f'public/costumes/{cid}.jpg')
    skin = get_skin(img)
    
    # Check if skin intersects with mask > 0
    overlap = (m > 0) & skin
    print(f"[{cid:16s}] Skin pixels: {np.sum(skin):6d} | Mask overlap with skin: {np.sum(overlap):5d}")
    if np.sum(overlap) > 0:
        y, x = np.where(overlap)
        print(f"    Overlap bbox: X: {x.min()}..{x.max()}, Y: {y.min()}..{y.max()}")
