import cv2
import numpy as np

img = cv2.imread('public/costumes/ao_tac.jpg')
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

# Let's save crops of suspected hand regions:
# Hand 1 (screen left): around x: 340..410, y: 490..600
cv2.imwrite(f'{art_dir}/crop_ao_tac_hand1.jpg', img[490:600, 340:410])
# Hand 2 (screen right): around x: 580..650, y: 500..610
cv2.imwrite(f'{art_dir}/crop_ao_tac_hand2.jpg', img[500:610, 580:650])
# Neck: around x: 450..540, y: 210..280
cv2.imwrite(f'{art_dir}/crop_ao_tac_neck.jpg', img[210:280, 450:540])

print("Saved crops to artifact dir")
