import cv2
import numpy as np

img = cv2.imread('public/costumes/tu_than.jpg')
h, w, _ = img.shape

# Let's inspect colors of the robe in tu_than:
# Left flap (screen left): x: 330..440, y: 300..800
# Right flap (screen right): x: 440..540, y: 300..800
# Hat: center and radius
print("Left flap mean BGR:", np.mean(img[300:700, 340:430], axis=(0,1)))
print("Right flap under belt mean BGR:", np.mean(img[650:850, 440:530], axis=(0,1)))
print("Hat center mean BGR:", np.mean(img[500:600, 550:650], axis=(0,1)))
print("Pink yếm mean BGR:", np.mean(img[280:380, 480:540], axis=(0,1)))
print("Wooden wall mean BGR:", np.mean(img[300:700, 100:250], axis=(0,1)))
