import cv2
import numpy as np

img = cv2.imread('/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b/verify_ao_tac.jpg')
hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
h = hls[:,:,0]
# Purple in verify_ao_tac was set to H = 155
is_purple = (h >= 145) & (h <= 165)
y_grid, x_grid = np.indices(img.shape[:2])

# Find connected components of purple
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(is_purple.astype(np.uint8))
print(f"Total purple components in verify_ao_tac: {num_labels}")
for i in range(1, num_labels):
    area = stats[i, cv2.CC_STAT_AREA]
    if area > 100:
        x = stats[i, cv2.CC_STAT_LEFT]
        y = stats[i, cv2.CC_STAT_TOP]
        w = stats[i, cv2.CC_STAT_WIDTH]
        h = stats[i, cv2.CC_STAT_HEIGHT]
        print(f"Component {i}: area={area}, bbox=(x:{x}..{x+w}, y:{y}..{y+h}), center=({centroids[i][0]:.1f}, {centroids[i][1]:.1f})")
