import cv2
import numpy as np

img = cv2.imread('public/costumes/ao_tac.jpg')
m = cv2.imread('public/costumes/masks/ao_tac.png', 0)
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

# Draw mask overlay: green for robe (m==1), blue for pants (m==2)
overlay = img.copy()
overlay[m == 1] = [0, 255, 0] # Bright green
overlay[m == 2] = [255, 0, 0] # Bright blue

blended = cv2.addWeighted(img, 0.6, overlay, 0.4, 0)
cv2.imwrite(f'{art_dir}/overlay_ao_tac.jpg', blended)
print("Saved overlay_ao_tac.jpg")
