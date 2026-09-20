import cv2
import numpy as np

v_img = cv2.imread('/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b/verify_tu_than.jpg')
orig = cv2.imread('public/costumes/tu_than.jpg')
diff = np.any(v_img != orig, axis=2)
y_grid, x_grid = np.indices(v_img.shape[:2])

# Where is diff in the hat region x in 490..720, y in 400..700?
diff_hat = diff & (x_grid >= 490) & (x_grid <= 720) & (y_grid >= 400) & (y_grid <= 700)
print("Changed pixels in hat region:", np.sum(diff_hat))
if np.sum(diff_hat) > 0:
    dy, dx = np.where(diff_hat)
    print(f"Hat changed bounds: X: {dx.min()}..{dx.max()}, Y: {dy.min()}..{dy.max()}")
