import cv2
import numpy as np

img = cv2.imread('public/costumes/ao_tac.jpg')
h, w = img.shape[:2]
y_grid, x_grid = np.indices((h, w))
b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)

def is_gold(img):
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h, l, s = hls[:, :, 0], hls[:, :, 1], hls[:, :, 2]
    return ((h >= 14) & (h <= 36) & (s > 45) & (l > 45) & (l < 225)).astype(bool)

def clean(mask, min_size=400):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    closed = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_CLOSE, k)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(closed)
    out = np.zeros_like(closed)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            out[labels == i] = 1
    return out.astype(bool)

is_crimson = (r > 55) & (r > g + 14) & (r > b + 14)
robe = (y_grid >= 265) & (y_grid <= 815) & (x_grid >= 245) & (x_grid <= 710) & is_crimson
r_clean = clean(robe, min_size=500)

# Strict exclusions:
r_clean[y_grid < 275] = False
r_clean[(x_grid >= 310) & (x_grid <= 410) & (y_grid >= 490) & (y_grid <= 600)] = False # screen-left hand
r_clean[(x_grid >= 570) & (x_grid <= 660) & (y_grid >= 490) & (y_grid <= 620)] = False # screen-right hand
r_clean[is_gold(img)] = False

# Pants: only up to y=890
left_pant = (x_grid >= 390) & (x_grid <= 535) & (y_grid >= 740) & (y_grid <= 890) & (r < 50) & (g < 50) & (b < 50)
right_pant = (x_grid >= 540) & (x_grid <= 710) & (y_grid >= 740) & (y_grid <= 880) & (r < 50) & (g < 50) & (b < 50)
p_clean = clean(left_pant | right_pant, min_size=400)

mask = np.zeros((h, w), dtype=np.uint8)
mask[p_clean] = 2
mask[r_clean] = 1
cv2.imwrite('public/costumes/masks/ao_tac.png', mask)

# Save overlay
overlay = img.copy()
overlay[mask == 1] = [0, 255, 0]
overlay[mask == 2] = [255, 0, 0]
blended = cv2.addWeighted(img, 0.6, overlay, 0.4, 0)
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'
cv2.imwrite(f'{art_dir}/test_ao_tac_overlay.jpg', blended)
print("ao_tac mask updated and overlay saved!")
