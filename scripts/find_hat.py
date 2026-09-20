import cv2
import numpy as np

img = cv2.imread('public/costumes/tu_than.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# The hat is bright straw/bamboo texture between y: 400..660, x: 490..780
crop = img[400:660, 490:780]
print("Hat crop shape:", crop.shape)

# Let's inspect BGR of the hat surface
# Straw hat is warm light yellow/tan: R ~ 160-220, G ~ 130-180, B ~ 80-140, with R > G > B
hat_color = (img[:,:,2] > 110) & (img[:,:,1] > 90) & (img[:,:,2] > img[:,:,0] + 25) & (img[:,:,1] > img[:,:,0] + 10)
y_grid, x_grid = np.indices(img.shape[:2])
hat_region = hat_color & (x_grid >= 490) & (x_grid <= 780) & (y_grid >= 400) & (y_grid <= 660)

print("Detected hat pixels:", np.sum(hat_region))
y_hats, x_hats = np.where(hat_region)
print(f"Hat bounds: X: {x_hats.min()}..{x_hats.max()}, Y: {y_hats.min()}..{y_hats.max()}")
print(f"Hat center: ({np.mean(x_hats):.1f}, {np.mean(y_hats):.1f})")

# Let's see what was purple in verify_tu_than
mask = cv2.imread('public/costumes/masks/tu_than.png', 0)
bad_purple_in_hat = (mask == 1) & (x_grid >= 490) & (x_grid <= 780) & (y_grid >= 400) & (y_grid <= 680)
print("Bad purple pixels on hat:", np.sum(bad_purple_in_hat))
if np.sum(bad_purple_in_hat) > 0:
    by, bx = np.where(bad_purple_in_hat)
    print(f"Bad purple bbox on hat: X: {bx.min()}..{bx.max()}, Y: {by.min()}..{by.max()}")
