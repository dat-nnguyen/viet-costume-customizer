import cv2
import numpy as np

img = cv2.imread('public/costumes/ao_tac.jpg')
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

crop = img[480:620, 320:680].copy()
h, w = crop.shape[:2]
for y in range(0, h, 20):
    cv2.line(crop, (0, y), (w, y), (0, 255, 255), 1)
    cv2.putText(crop, str(480 + y), (5, y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
for x in range(0, w, 25):
    cv2.line(crop, (x, 0), (x, h), (0, 255, 255), 1)
    cv2.putText(crop, str(320 + x), (x + 2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)

cv2.imwrite(f'{art_dir}/full_hands_grid.jpg', crop)
print("Saved full_hands_grid.jpg")
