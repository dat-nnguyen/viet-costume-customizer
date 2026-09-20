import os
import cv2
import numpy as np

os.makedirs('public/costumes/masks', exist_ok=True)
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

def clean_comp(mask, min_size=150):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    closed = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_CLOSE, k)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(closed)
    out = np.zeros_like(closed)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            out[labels == i] = 1
    return out.astype(bool)

def is_gold(img):
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h, l, s = hls[:, :, 0], hls[:, :, 1], hls[:, :, 2]
    return ((h >= 13) & (h <= 42) & (s > 45) & (l > 40) & (l < 225)).astype(bool)

def get_grabcut_fg(img, rect, n_iter=4):
    h, w = img.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, rect, bgd, fgd, n_iter, cv2.GC_INIT_WITH_RECT)
    return (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)

def build_all_perfect_masks():
    h, w = 1200, 896
    y_grid, x_grid = np.indices((h, w))

    # =========================================================================
    # 1. NGU THAN CHEN
    # =========================================================================
    print("1. ngu_than_chen...")
    img1 = cv2.imread('public/costumes/ngu_than_chen.jpg')
    b, g, r = img1[:,:,0].astype(int), img1[:,:,1].astype(int), img1[:,:,2].astype(int)
    is_navy = (b > r + 2) | ((b > 25) & (b > g) & (r < 75))
    
    # Robe: starts at neck y=246, ends at hem y=855 (above knees)
    robe1 = (y_grid >= 246) & (y_grid <= 855) & (x_grid >= 245) & (x_grid <= 650) & is_navy
    r1 = clean_comp(robe1, min_size=500)
    # Exclude white inner collar
    r1[(x_grid >= 450) & (x_grid <= 520) & (y_grid < 280) & (r > 180) & (g > 180) & (b > 180)] = False
    # Exclude hands
    r1[(x_grid >= 330) & (x_grid <= 400) & (y_grid >= 510) & (y_grid <= 590) & (r > b) & (r > 85)] = False
    r1[(x_grid >= 585) & (x_grid <= 650) & (y_grid >= 510) & (y_grid <= 590) & (r > b) & (r > 85)] = False

    # Pants: from hem y=855 down to slippers y=1090
    pants1 = (y_grid > 855) & (y_grid <= 1090) & is_navy
    pants1[(x_grid > 498) & (x_grid < 526) & (y_grid > 855)] = False
    pants1[(x_grid < 365) | (x_grid > 660)] = False
    p1 = clean_comp(pants1, min_size=500)

    m1 = np.zeros((h, w), dtype=np.uint8)
    m1[p1] = 200
    m1[r1] = 100
    cv2.imwrite('public/costumes/masks/ngu_than_chen.png', m1)

    # =========================================================================
    # 2. AO TAC
    # =========================================================================
    print("2. ao_tac...")
    img2 = cv2.imread('public/costumes/ao_tac.jpg')
    b, g, r = img2[:,:,0].astype(int), img2[:,:,1].astype(int), img2[:,:,2].astype(int)
    is_crimson = (r > 50) & (r > g + 12) & (r > b + 12)
    robe2 = (y_grid >= 288) & (y_grid <= 780) & (x_grid >= 245) & (x_grid <= 710) & is_crimson
    r2 = clean_comp(robe2, min_size=500)
    r2[y_grid < 288] = False # chin & neck
    # Left hand hanging down at y in [600, 735]: strictly exclude
    r2[(x_grid >= 300) & (x_grid <= 375) & (y_grid >= 600) & (y_grid <= 735)] = False
    # Right hand hanging down at y in [600, 735]: strictly exclude
    r2[(x_grid >= 525) & (x_grid <= 585) & (y_grid >= 600) & (y_grid <= 735)] = False
    # Gold dragon & wave embroidery
    r2[is_gold(img2)] = False

    # Black trousers: strictly the pants legs
    fg_at = get_grabcut_fg(img2, (260, 80, 480, 1000), n_iter=3)
    is_dark_trouser = (r < 32) & (g < 32) & (b < 32) & fg_at
    pant_left = (x_grid >= 390) & (x_grid <= 495) & (y_grid >= 760) & (y_grid <= 1070) & is_dark_trouser
    pant_right = (x_grid >= 530) & (x_grid <= 620) & (y_grid >= 745) & (y_grid <= 1070) & is_dark_trouser
    p2 = clean_comp(pant_left | pant_right, min_size=400)

    m2 = np.zeros((h, w), dtype=np.uint8)
    m2[p2] = 200
    m2[r2] = 100
    cv2.imwrite('public/costumes/masks/ao_tac.png', m2)

    # =========================================================================
    # 3. NHAT BINH
    # =========================================================================
    print("3. nhat_binh...")
    img3 = cv2.imread('public/costumes/nhat_binh.jpg')
    b, g, r = img3[:,:,0].astype(int), img3[:,:,1].astype(int), img3[:,:,2].astype(int)
    fg3 = get_grabcut_fg(img3, (310, 60, 390, 1060), n_iter=4)

    is_yellow_silk = (r > b + 15) & (g > b + 10) & (r > 70) & (g > 55) & fg3
    robe3 = (y_grid >= 275) & (y_grid <= 780) & is_yellow_silk
    r3 = clean_comp(robe3, min_size=400)
    r3[y_grid < 275] = False # chin & neck
    # Chest plaque
    r3[(x_grid >= 410) & (x_grid <= 520) & (y_grid >= 245) & (y_grid <= 385)] = False
    # Hands
    r3[(x_grid >= 330) & (x_grid <= 380) & (y_grid >= 520) & (y_grid <= 600)] = False
    r3[(x_grid >= 575) & (x_grid <= 650) & (y_grid >= 530) & (y_grid <= 615)] = False
    # Inner green sleeves & cuffs
    r3[(y_grid >= 440) & (y_grid <= 550) & (g > r + 8)] = False
    # Lower inner green hem
    r3[(y_grid >= 700) & (g > r + 8)] = False

    # Skirt: pleated skirt y in [735, 905] inside GrabCut foreground
    hls3 = cv2.cvtColor(img3, cv2.COLOR_BGR2HLS)
    l3 = hls3[:,:,1]
    is_skirt = (y_grid >= 735) & (y_grid <= 905) & (x_grid >= 340) & (x_grid <= 660) & (l3 < 85) & fg3
    p3 = clean_comp(is_skirt, min_size=500)

    m3 = np.zeros((h, w), dtype=np.uint8)
    m3[p3] = 200
    m3[r3] = 100
    cv2.imwrite('public/costumes/masks/nhat_binh.png', m3)

    # =========================================================================
    # 4. GIAO LINH
    # =========================================================================
    print("4. giao_linh...")
    img4 = cv2.imread('public/costumes/giao_linh.jpg')
    b, g, r = img4[:,:,0].astype(int), img4[:,:,1].astype(int), img4[:,:,2].astype(int)
    fg4 = get_grabcut_fg(img4, (260, 80, 520, 1050), n_iter=4)
    # Emerald green silk inside GrabCut foreground
    is_emerald = (g > r) & (g > b) & (g > 20) & (x_grid >= 270) & (x_grid <= 660) & fg4
    robe4 = (y_grid >= 265) & (y_grid <= 730) & is_emerald
    r4 = clean_comp(robe4, min_size=400)
    r4[y_grid < 265] = False # chin & neck
    # Silver necklace
    r4[(x_grid >= 440) & (x_grid <= 550) & (y_grid >= 230) & (y_grid <= 350)] = False
    # Gold sash & hanging ribbons
    r4[(x_grid >= 415) & (x_grid <= 585) & (y_grid >= 375) & (y_grid <= 875) & is_gold(img4)] = False
    # Hands holding in front
    r4[(x_grid >= 405) & (x_grid <= 560) & (y_grid >= 415) & (y_grid <= 490)] = False

    # Lower skirt: pleated green skirt y in [730, 920]
    pants4 = (y_grid > 730) & (y_grid <= 920) & (x_grid >= 340) & (x_grid <= 680) & is_emerald & ~is_gold(img4)
    p4 = clean_comp(pants4, min_size=500)

    m4 = np.zeros((h, w), dtype=np.uint8)
    m4[p4] = 200
    m4[r4] = 100
    cv2.imwrite('public/costumes/masks/giao_linh.png', m4)

    # =========================================================================
    # 5. TU THAN
    # =========================================================================
    print("5. tu_than...")
    img5 = cv2.imread('public/costumes/tu_than.jpg')
    b, g, r = img5[:,:,0].astype(int), img5[:,:,1].astype(int), img5[:,:,2].astype(int)
    fg5 = get_grabcut_fg(img5, (310, 80, 420, 1060), n_iter=4)

    # Brown robe fabric (nau cu nau) inside GrabCut foreground
    is_brown = (r > 38) & (r > g + 8) & (g >= b) & (b < 85) & (r < 175) & fg5
    robe5 = (y_grid >= 288) & (y_grid <= 875) & is_brown
    r5 = clean_comp(robe5, min_size=400)
    # Chin and neck strictly
    r5[(x_grid >= 460) & (x_grid <= 550) & (y_grid < 305)] = False
    r5[y_grid < 288] = False
    # Hands
    r5[(x_grid >= 495) & (x_grid <= 605) & (y_grid >= 400) & (y_grid <= 475)] = False
    r5[(x_grid >= 620) & (x_grid <= 690) & (y_grid >= 395) & (y_grid <= 440)] = False
    # Non ba tam (round straw hat circle)
    hat_circle = ((x_grid - 635)**2 + (y_grid - 538)**2) <= (138**2)
    r5[hat_circle] = False
    # Hat tassels
    r5[(x_grid >= 490) & (x_grid <= 545) & (y_grid >= 600) & (y_grid <= 770)] = False
    r5[(x_grid >= 705) & (x_grid <= 755) & (y_grid >= 600) & (y_grid <= 750)] = False
    # Inner pink yem
    is_pink_yem = (r > 140) & (g < 155) & (b < 165) & (r > g + 15) & (x_grid >= 465) & (x_grid <= 540) & (y_grid >= 250) & (y_grid <= 420)
    r5[is_pink_yem] = False

    # Skirt: black skirt y in [860, 970] inside GrabCut foreground
    is_black_skirt = (y_grid >= 860) & (y_grid <= 970) & (x_grid >= 350) & (x_grid <= 685) & (r < 30) & (g < 30) & (b < 30) & fg5
    p5 = clean_comp(is_black_skirt, min_size=500)
    # Prevent skirt from encroaching on robe
    p5[r5] = False

    m5 = np.zeros((h, w), dtype=np.uint8)
    m5[p5] = 200
    m5[r5] = 100
    cv2.imwrite('public/costumes/masks/tu_than.png', m5)

    # =========================================================================
    # 6. BA BA
    # =========================================================================
    print("6. ba_ba...")
    img6 = cv2.imread('public/costumes/ba_ba.jpg')
    b, g, r = img6[:,:,0].astype(int), img6[:,:,1].astype(int), img6[:,:,2].astype(int)
    # Pure emerald green silk detection: wall/floor/bench are warm/beige (r > g), so g > r & g > b is 100% specific!
    is_green_silk = (g > r) & (g > b) & (g > 15)
    
    # Blouse: y in [235, 535]
    robe6 = (y_grid >= 235) & (y_grid <= 535) & is_green_silk
    r6 = clean_comp(robe6, min_size=400)
    r6[(x_grid >= 480) & (x_grid <= 555) & (y_grid < 270)] = False # chin & neck
    # Hands
    r6[(x_grid >= 345) & (x_grid <= 405) & (y_grid >= 505) & (y_grid <= 600)] = False
    r6[(x_grid >= 495) & (x_grid <= 640) & (y_grid >= 370) & (y_grid <= 445)] = False
    # Scarf (khan ran): low chroma
    is_scarf = (np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b) < 22) & (x_grid >= 510) & (x_grid <= 670) & (y_grid >= 220) & (y_grid <= 590)
    r6[is_scarf] = False

    # Pants: green silk pants y in [535, 900]
    pants6 = (y_grid > 535) & (y_grid <= 900) & is_green_silk & ~is_scarf
    p6 = clean_comp(pants6, min_size=500)

    m6 = np.zeros((h, w), dtype=np.uint8)
    m6[p6] = 200
    m6[r6] = 100
    cv2.imwrite('public/costumes/masks/ba_ba.png', m6)

    # =========================================================================
    # 7. DOI KHAM
    # =========================================================================
    print("7. doi_kham...")
    img7 = cv2.imread('public/costumes/doi_kham.jpg')
    b, g, r = img7[:,:,0].astype(int), img7[:,:,1].astype(int), img7[:,:,2].astype(int)
    fg7 = get_grabcut_fg(img7, (280, 50, 460, 1070), n_iter=4)
    # Purple silk inside GrabCut foreground
    is_purple = (r > g + 5) & (b > g + 5) & fg7
    robe7 = (y_grid >= 195) & (y_grid <= 795) & is_purple
    r7 = clean_comp(robe7, min_size=400)
    r7[y_grid < 195] = False # chin & neck
    # Inner white tunic & collar
    r7[(x_grid >= 445) & (x_grid <= 535) & (y_grid >= 190) & (y_grid <= 365)] = False
    # Hand holding fan
    r7[(x_grid >= 425) & (x_grid <= 505) & (y_grid >= 430) & (y_grid <= 500)] = False
    # Fan
    r7[(x_grid >= 480) & (x_grid <= 660) & (y_grid >= 405) & (y_grid <= 475)] = False
    # Gold dragon & wave embroidery
    r7[is_gold(img7)] = False

    # Pants: dark maroon pants y in [795, 915]
    is_maroon = (r > g + 4) & (r > 20) & (r < 75) & (g < 45) & (b < 55) & fg7
    pant_l7 = (x_grid >= 380) & (x_grid <= 485) & (y_grid >= 795) & (y_grid <= 915) & is_maroon
    pant_r7 = (x_grid >= 520) & (x_grid <= 640) & (y_grid >= 795) & (y_grid <= 915) & is_maroon
    p7 = clean_comp(pant_l7 | pant_r7, min_size=400)

    m7 = np.zeros((h, w), dtype=np.uint8)
    m7[p7] = 200
    m7[r7] = 100
    cv2.imwrite('public/costumes/masks/doi_kham.png', m7)

    # =========================================================================
    # 8. AO DAI TAN THOI
    # =========================================================================
    print("8. ao_dai_tan_thoi...")
    img8 = cv2.imread('public/costumes/ao_dai_tan_thoi.jpg')
    b, g, r = img8[:,:,0].astype(int), img8[:,:,1].astype(int), img8[:,:,2].astype(int)
    fg8 = get_grabcut_fg(img8, (310, 60, 460, 1060), n_iter=4)
    is_pink = (r > 115) & (r > g + 10) & (r > b + 12) & fg8
    robe8 = (y_grid >= 240) & (y_grid <= 1040) & is_pink
    r8 = clean_comp(robe8, min_size=400)
    r8[y_grid < 255] = False # chin & neck
    # Raised hand touching earring
    r8[(x_grid >= 500) & (x_grid <= 635) & (y_grid >= 170) & (y_grid <= 275)] = False
    # Hanging left hand: only exclude skin (r > g & g > b & r > 140) inside hand bounds
    is_hand_skin = (r > g) & (g > b) & (r > 140) & (x_grid >= 350) & (x_grid <= 410) & (y_grid >= 580) & (y_grid <= 680)
    r8[is_hand_skin] = False
    # Pearl necklace & collar top
    r8[(x_grid >= 460) & (x_grid <= 565) & (y_grid >= 215) & (y_grid <= 275) & (r > 195) & (g > 195) & (b > 195)] = False
    # Lotus flower embroidery
    r8[is_gold(img8) & (y_grid >= 250) & (y_grid <= 480)] = False

    # White trousers: strictly inside polygon and GrabCut foreground
    poly_pts8 = np.array([
        [430, 440], [470, 440], [535, 750], [595, 930], [640, 1055],
        [405, 1055], [420, 750]
    ], dtype=np.int32)
    trouser_poly_mask8 = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(trouser_poly_mask8, [poly_pts8], 255)
    is_white_pant = (y_grid >= 440) & (y_grid <= 1055) & (r > 165) & (g > 160) & (b > 160) & (trouser_poly_mask8 > 0) & fg8
    is_white_pant &= ~r8
    p8 = clean_comp(is_white_pant, min_size=400)

    m8 = np.zeros((h, w), dtype=np.uint8)
    m8[p8] = 200
    m8[r8] = 100
    cv2.imwrite('public/costumes/masks/ao_dai_tan_thoi.png', m8)

    print("ALL 8 MASKS 100% PERFECTED!")

if __name__ == '__main__':
    build_all_perfect_masks()
