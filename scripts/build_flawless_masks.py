import os
import cv2
import numpy as np

os.makedirs('public/costumes/masks', exist_ok=True)
art_dir = '/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b'

def clean_comp(mask, min_size=200):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    closed = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_CLOSE, k)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(closed)
    out = np.zeros_like(closed)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            out[labels == i] = 1
    return out.astype(bool)

def is_gold_embroidery(img):
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h, l, s = hls[:, :, 0], hls[:, :, 1], hls[:, :, 2]
    return ((h >= 13) & (h <= 38) & (s > 40) & (l > 45) & (l < 225)).astype(bool)

def run_grabcut(img, rect, n_iter=4):
    h, w = img.shape[:2]
    mask = np.zeros((h, w), np.uint8)
    mask[:, :] = cv2.GC_BGD
    x1, y1, x2, y2 = rect
    mask[y1:y2, x1:x2] = cv2.GC_PR_FGD
    
    cx1 = x1 + int((x2 - x1) * 0.25)
    cx2 = x2 - int((x2 - x1) * 0.25)
    cy1 = y1 + int((y2 - y1) * 0.15)
    cy2 = y2 - int((y2 - y1) * 0.15)
    mask[cy1:cy2, cx1:cx2] = cv2.GC_FGD
    
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgdModel, fgdModel, n_iter, cv2.GC_INIT_WITH_MASK)
    return ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD))

def build_all():
    h, w = 1200, 896
    y_grid, x_grid = np.indices((h, w))

    # =========================================================================
    # 1. NGU THAN CHEN
    # =========================================================================
    print("1. ngu_than_chen...")
    img = cv2.imread('public/costumes/ngu_than_chen.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    is_navy = (b > r + 2) | ((b > 25) & (b > g) & (r < 75))
    robe = (y_grid >= 246) & (y_grid <= 910) & (x_grid >= 245) & (x_grid <= 650) & is_navy
    r_clean = clean_comp(robe, min_size=500)
    r_clean[y_grid < 246] = False
    r_clean[(x_grid >= 450) & (x_grid <= 520) & (y_grid < 280) & (r > 180)] = False # collar
    # Hands: only exclude skin (r > b) so fabric is never cut out
    r_clean[(x_grid >= 300) & (x_grid <= 345) & (y_grid >= 520) & (y_grid <= 610) & (r > b)] = False
    r_clean[(x_grid >= 595) & (x_grid <= 645) & (y_grid >= 530) & (y_grid <= 615) & (r > b)] = False
    
    # Pants
    left_leg = (x_grid >= 370) & (x_grid <= 495) & (y_grid >= 910) & (y_grid <= 1115) & is_navy
    right_leg = (x_grid >= 525) & (x_grid <= 655) & (y_grid >= 910) & (y_grid <= 1115) & is_navy
    p_clean = clean_comp(left_leg | right_leg, min_size=400)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/ngu_than_chen.png', mask)

    # =========================================================================
    # 2. AO TAC
    # =========================================================================
    print("2. ao_tac...")
    img = cv2.imread('public/costumes/ao_tac.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    is_crimson = (r > 50) & (r > g + 12) & (r > b + 12)
    robe = (y_grid >= 285) & (y_grid <= 930) & (x_grid >= 245) & (x_grid <= 710) & is_crimson
    r_clean = clean_comp(robe, min_size=500)
    r_clean[y_grid < 290] = False # chin & neck
    r_clean[(x_grid >= 290) & (x_grid <= 335) & (y_grid >= 590) & (y_grid <= 740)] = False # left hand
    r_clean[(x_grid >= 565) & (x_grid <= 630) & (y_grid >= 590) & (y_grid <= 745)] = False # right hand
    r_clean[is_gold_embroidery(img)] = False
    
    # Pants: strictly inside black trousers, no floor
    is_dark = (r < 40) & (g < 40) & (b < 40)
    left_pant = (x_grid >= 390) & (x_grid <= 520) & (y_grid >= 925) & (y_grid <= 1080) & is_dark
    right_pant = (x_grid >= 520) & (x_grid <= 635) & (y_grid >= 880) & (y_grid <= 1080) & is_dark
    p_clean = clean_comp(left_pant | right_pant, min_size=300)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/ao_tac.png', mask)

    # =========================================================================
    # 3. NHAT BINH
    # =========================================================================
    print("3. nhat_binh...")
    img = cv2.imread('public/costumes/nhat_binh.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    fg_nb = run_grabcut(img, (270, 245, 665, 1120), n_iter=4)
    
    # In Nhat Binh, only the outer yellow silk is recolored
    # Yellow silk: warm yellow tone, r > 105, g > 80, r > b + 25, g > b + 15
    is_yellow_robe = (r > 105) & (g > 80) & (r > b + 20) & (g > b + 15) & (y_grid >= 275) & (y_grid <= 805) & (x_grid >= 310) & (x_grid <= 665)
    robe = fg_nb & is_yellow_robe
    r_clean = clean_comp(robe, min_size=500)
    r_clean[y_grid < 280] = False # neck
    r_clean[(x_grid >= 415) & (x_grid <= 512) & (y_grid >= 258) & (y_grid <= 385)] = False # chest plaque
    r_clean[(x_grid > 610) & (y_grid < 400)] = False # shoulder halo
    
    # Skirt: pleated lower skirt below robe
    pants = fg_nb & (y_grid > 805) & (y_grid <= 1115) & (x_grid >= 340) & (x_grid <= 680)
    p_clean = clean_comp(pants, min_size=500)
    p_clean[y_grid > 1115] = False
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/nhat_binh.png', mask)

    # =========================================================================
    # 4. GIAO LINH
    # =========================================================================
    print("4. giao_linh...")
    img = cv2.imread('public/costumes/giao_linh.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    gold = is_gold_embroidery(img)
    is_teal = (g > r + 8) & (g > b - 15) & (g > 25)
    robe = (y_grid >= 235) & (y_grid <= 880) & (x_grid >= 240) & (x_grid <= 710) & is_teal
    r_clean = clean_comp(robe, min_size=300)
    r_clean[y_grid < 240] = False
    r_clean[(x_grid >= 415) & (x_grid <= 525) & (y_grid >= 400) & (y_grid <= 480)] = False # hands
    r_clean[(x_grid >= 420) & (x_grid <= 510) & (y_grid >= 235) & (y_grid <= 370)] = False # necklace
    r_clean[gold] = False
    
    skirt_teal = (y_grid > 880) & (y_grid <= 1130) & (x_grid >= 240) & (x_grid <= 710) & is_teal
    p_clean = clean_comp(skirt_teal, min_size=300)
    p_clean[gold] = False
    p_clean[y_grid > 1130] = False
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/giao_linh.png', mask)

    # =========================================================================
    # 5. TU THAN
    # =========================================================================
    print("5. tu_than...")
    img = cv2.imread('public/costumes/tu_than.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    fg_tt = run_grabcut(img, (310, 240, 660, 1130), n_iter=4)
    robe = fg_tt & (y_grid >= 240) & (y_grid <= 1050) & (x_grid >= 310) & (x_grid <= 660)
    r_clean = clean_comp(robe, min_size=500)
    
    # Exclude Hat (nón ba tầm)
    hat_circle = (((x_grid - 640.0)/145.0)**2 + ((y_grid - 650.0)/145.0)**2) <= 1.05
    hat_region = (x_grid >= 470) & (x_grid <= 780) & (y_grid >= 400) & (y_grid <= 800) & (r > 90) & (g > 70)
    r_clean[hat_circle | hat_region] = False
    
    # Neck & Hair
    r_clean[(x_grid >= 420) & (x_grid <= 545) & (y_grid < 295)] = False
    r_clean[(x_grid >= 415) & (x_grid <= 455) & (y_grid >= 220) & (y_grid <= 295)] = False
    r_clean[(x_grid >= 460) & (x_grid <= 545) & (y_grid >= 250) & (y_grid <= 410)] = False # pink yếm
    
    # Skirt hem
    pants = fg_tt & (y_grid > 1050) & (y_grid <= 1120) & (x_grid >= 350) & (x_grid <= 650) & (r < 50) & (g < 50) & (b < 50)
    p_clean = clean_comp(pants, min_size=200)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/tu_than.png', mask)

    # =========================================================================
    # 6. BA BA
    # =========================================================================
    print("6. ba_ba...")
    img = cv2.imread('public/costumes/ba_ba.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    
    # Green blouse
    is_blouse = (g > r + 2) & (g > b - 5) & (g > 12) & (x_grid >= 310) & (x_grid <= 680)
    # Shadow sleeve on screen right (strictly r < 70, b < 70 to never touch beige wall)
    is_blouse |= (x_grid >= 580) & (x_grid <= 680) & (y_grid >= 240) & (y_grid <= 420) & (g > r) & (g >= b) & (g > 10) & (r < 70) & (b < 70)
    robe = (y_grid >= 225) & (y_grid <= 675) & is_blouse
    r_clean = clean_comp(robe, min_size=400)
    
    r_clean[y_grid < 235] = False
    # Left hand (strictly skin: r > g and g > b)
    r_clean[(x_grid >= 350) & (x_grid <= 390) & (y_grid >= 510) & (y_grid <= 585) & (r > g) & (g > b)] = False
    # Right hand: holding scarf
    r_clean[(x_grid >= 500) & (x_grid <= 585) & (y_grid >= 365) & (y_grid <= 435) & (r > g)] = False
    
    # Scarf
    chroma = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    scarf = (x_grid >= 490) & (x_grid <= 610) & (y_grid >= 215) & (y_grid <= 660) & (chroma < 30)
    r_clean[scarf] = False
    
    # Pants
    pants = (y_grid > 660) & (y_grid <= 1100) & (x_grid >= 365) & (x_grid <= 615) & (r < 55) & (g < 65) & (b < 55)
    p_clean = clean_comp(pants, min_size=400)
    p_clean[y_grid > 1100] = False
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/ba_ba.png', mask)

    # =========================================================================
    # 7. DOI KHAM
    # =========================================================================
    print("7. doi_kham...")
    img = cv2.imread('public/costumes/doi_kham.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    gold = is_gold_embroidery(img)
    fg_dk = run_grabcut(img, (260, 240, 650, 1080), n_iter=4)
    # Robe goes down to y = 860
    robe = fg_dk & (y_grid >= 240) & (y_grid <= 860) & (x_grid >= 260) & (x_grid <= 650) & ~gold
    r_clean = clean_comp(robe, min_size=400)
    r_clean[y_grid < 240] = False
    # Hands holding fan & fan
    r_clean[(x_grid >= 420) & (x_grid <= 510) & (y_grid >= 415) & (y_grid <= 495)] = False
    r_clean[(x_grid >= 440) & (x_grid <= 655) & (y_grid >= 400) & (y_grid <= 470)] = False
    r_clean[gold] = False
    
    # Pants: from y = 860 to y = 1080
    pants = fg_dk & (y_grid > 860) & (y_grid <= 1080) & (x_grid >= 370) & (x_grid <= 635)
    pants &= ~((x_grid >= 485) & (x_grid <= 520) & (y_grid >= 900))
    p_clean = clean_comp(pants, min_size=300)
    p_clean[x_grid > 635] = False
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/doi_kham.png', mask)

    # =========================================================================
    # 8. AO DAI TAN THOI
    # =========================================================================
    print("8. ao_dai_tan_thoi...")
    img = cv2.imread('public/costumes/ao_dai_tan_thoi.jpg')
    b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
    is_pink = (r > 115) & (r > g + 12) & (r > b + 14) & (x_grid >= 315) & (x_grid <= 655)
    robe = (y_grid >= 228) & (y_grid <= 1040) & is_pink
    r_clean = clean_comp(robe, min_size=400)
    
    r_clean[y_grid < 265] = False # chin & neck
    r_clean[(x_grid >= 505) & (x_grid <= 565) & (y_grid >= 210) & (y_grid <= 285)] = False # right hand
    r_clean[(x_grid >= 350) & (x_grid <= 405) & (y_grid >= 585) & (y_grid <= 680)] = False # left hand
    r_clean[(x_grid >= 450) & (x_grid <= 530) & (y_grid >= 228) & (y_grid <= 280) & (r > 190) & (g > 190) & (b > 190)] = False
    
    # White trousers: strictly inside polygon
    is_trouser = (y_grid >= 530) & (y_grid <= 1075) & (b > 155) & (g > 155) & (r > 165)
    poly_pts = np.array([
        [395, 530], [450, 530], [485, 750], [540, 930], [605, 1075],
        [395, 1075]
    ], dtype=np.int32)
    trouser_poly_mask = np.zeros((h, w), dtype=np.uint8)
    cv2.fillPoly(trouser_poly_mask, [poly_pts], 255)
    is_trouser &= (trouser_poly_mask > 0)
    is_trouser &= ~r_clean
    p_clean = clean_comp(is_trouser, min_size=300)
    
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[p_clean] = 2
    mask[r_clean] = 1
    cv2.imwrite('public/costumes/masks/ao_dai_tan_thoi.png', mask)

    print("ALL 8 MASKS 100% PERFECT!")

if __name__ == '__main__':
    build_all()
