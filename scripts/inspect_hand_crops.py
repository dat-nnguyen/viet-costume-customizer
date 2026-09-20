import cv2
import numpy as np

img = cv2.imread('public/costumes/ao_tac.jpg')
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

# Left hand (screen left, model's right hand):
# Notice her sleeve ends around y: 480-510, and her hand hangs down to around y: 600
# Let's crop from y: 480..600, x: 340..410 with coordinate marks
crop1 = img[480:600, 340:410].copy()
cv2.imwrite(f'{art_dir}/inspect_hand_left.jpg', crop1)

# Right hand (screen right, model's left hand):
# Sleeve ends around y: 500-530, hand hangs down to around y: 620
crop2 = img[500:620, 580:645].copy()
cv2.imwrite(f'{art_dir}/inspect_hand_right.jpg', crop2)

# Neck:
crop3 = img[210:280, 460:540].copy()
cv2.imwrite(f'{art_dir}/inspect_neck.jpg', crop3)

print("Saved inspection crops!")
