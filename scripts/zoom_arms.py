import cv2

img = cv2.imread('public/costumes/ao_tac.jpg')
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

# Zoom into the left side: y in 450..750, x in 300..420
zoom_left = img[450:750, 300:420]
# Resize 2x
zoom_left_2x = cv2.resize(zoom_left, (0,0), fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(f'{art_dir}/zoom_left.jpg', zoom_left_2x)

# Zoom into the right side: y in 450..750, x in 550..670
zoom_right = img[450:750, 550:670]
zoom_right_2x = cv2.resize(zoom_right, (0,0), fx=2, fy=2, interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(f'{art_dir}/zoom_right.jpg', zoom_right_2x)

print("Saved 2x zoom images!")
