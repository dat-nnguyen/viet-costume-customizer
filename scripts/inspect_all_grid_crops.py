import cv2
import numpy as np

art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

def save_labeled_crop(img, x1, y1, x2, y2, out_name, step_x=25, step_y=25):
    crop = img[y1:y2, x1:x2].copy()
    h, w = crop.shape[:2]
    for y in range(0, h, step_y):
        cv2.line(crop, (0, y), (w, y), (0, 255, 255), 1)
        cv2.putText(crop, str(y1 + y), (5, y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
    for x in range(0, w, step_x):
        cv2.line(crop, (x, 0), (x, h), (0, 255, 255), 1)
        cv2.putText(crop, str(x1 + x), (x + 2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
    cv2.imwrite(f'{art_dir}/{out_name}.jpg', crop)

# 1. nhat_binh: hands & neck
nb = cv2.imread('public/costumes/nhat_binh.jpg')
save_labeled_crop(nb, 300, 480, 700, 650, 'grid_nb_hands', 30, 25)
save_labeled_crop(nb, 430, 180, 560, 320, 'grid_nb_neck', 20, 20)

# 2. ao_dai_tan_thoi: hands, neck, pants
ad = cv2.imread('public/costumes/ao_dai_tan_thoi.jpg')
save_labeled_crop(ad, 330, 450, 430, 600, 'grid_ad_left_hand', 20, 20)
save_labeled_crop(ad, 520, 160, 630, 280, 'grid_ad_right_hand', 20, 20)
save_labeled_crop(ad, 440, 190, 560, 290, 'grid_ad_neck', 20, 20)
save_labeled_crop(ad, 380, 480, 620, 1120, 'grid_ad_pants', 30, 50)

# 3. tu_than: neck, hat, skirt
tt = cv2.imread('public/costumes/tu_than.jpg')
save_labeled_crop(tt, 430, 180, 560, 310, 'grid_tt_neck', 20, 20)
save_labeled_crop(tt, 480, 380, 720, 680, 'grid_tt_hat', 30, 30)
save_labeled_crop(tt, 340, 800, 660, 1120, 'grid_tt_skirt', 30, 40)

# 4. ngu_than_chen: hands & pants
nt = cv2.imread('public/costumes/ngu_than_chen.jpg')
save_labeled_crop(nt, 320, 480, 660, 620, 'grid_nt_hands', 30, 25)
save_labeled_crop(nt, 340, 850, 660, 1150, 'grid_nt_pants', 30, 40)

print("Saved all labeled inspection crops!")
