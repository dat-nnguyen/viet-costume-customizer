import cv2
import numpy as np

img = cv2.imread('public/costumes/ao_tac.jpg')
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

def draw_grid(crop, start_x, start_y, step=25):
    h, w = crop.shape[:2]
    out = crop.copy()
    for y in range(0, h, step):
        cv2.line(out, (0, y), (w, y), (0, 255, 255), 1)
        cv2.putText(out, str(start_y + y), (5, y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
    for x in range(0, w, step):
        cv2.line(out, (x, 0), (x, h), (0, 255, 255), 1)
        cv2.putText(out, str(start_x + x), (x + 2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
    return out

# Left hand area
crop_lh = img[480:620, 320:440]
grid_lh = draw_grid(crop_lh, 320, 480, step=20)
cv2.imwrite(f'{art_dir}/grid_lh.jpg', grid_lh)

# Right hand area
crop_rh = img[490:630, 560:680]
grid_rh = draw_grid(crop_rh, 560, 490, step=20)
cv2.imwrite(f'{art_dir}/grid_rh.jpg', grid_rh)

# Neck area
crop_neck = img[200:300, 440:560]
grid_neck = draw_grid(crop_neck, 440, 200, step=20)
cv2.imwrite(f'{art_dir}/grid_neck.jpg', grid_neck)

print("Saved grid crops!")
