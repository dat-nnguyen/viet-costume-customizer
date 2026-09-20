import cv2
import numpy as np

def find_skin_mask(img):
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    cr = ycrcb[:, :, 1]
    cb = ycrcb[:, :, 2]
    # Standard human skin range in YCrCb
    skin = (cr >= 135) & (cr <= 180) & (cb >= 85) & (cb <= 135)
    return skin

img = cv2.imread('public/costumes/ao_tac.jpg')
skin = find_skin_mask(img)
print("ao_tac skin pixels:", np.sum(skin))

# Let's find connected components of skin for ao_tac
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(skin.astype(np.uint8))
for i in range(1, num_labels):
    area = stats[i, cv2.CC_STAT_AREA]
    if area > 100:
        x = stats[i, cv2.CC_STAT_LEFT]
        y = stats[i, cv2.CC_STAT_TOP]
        w = stats[i, cv2.CC_STAT_WIDTH]
        h = stats[i, cv2.CC_STAT_HEIGHT]
        print(f"Skin region {i}: area={area}, bbox=(x:{x}..{x+w}, y:{y}..{y+h}), center=({centroids[i][0]:.1f}, {centroids[i][1]:.1f})")
