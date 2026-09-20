import os
import cv2
import numpy as np

os.makedirs('public/costumes/masks', exist_ok=True)
os.makedirs('/tmp/test_masks', exist_ok=True)

COSTUMES = [
    'ngu_than_chen',
    'ao_tac',
    'nhat_binh',
    'giao_linh',
    'tu_than',
    'ba_ba',
    'doi_kham',
    'ao_dai_tan_thoi'
]

def is_gold_embroidery(img):
    """Detect metallic gold/yellow embroidery in BGR image."""
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h = hls[:, :, 0] # 0..180
    l = hls[:, :, 1]
    s = hls[:, :, 2]
    return ((h >= 14) & (h <= 32) & (s > 60) & (l > 55) & (l < 225)).astype(bool)

def clean_mask(binary_mask, min_size=300):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    closed = cv2.morphologyEx(binary_mask, cv2.MORPH_CLOSE, k)
    
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(closed)
    out = np.zeros_like(closed)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            out[labels == i] = 255
    return out

def is_skin_in_box(img, box):
    """Check skin tone only inside a specific bounding box (x1, y1, x2, y2)."""
    h, w = img.shape[:2]
    y_grid, x_grid = np.indices((h, w))
    x1, y1, x2, y2 = box
    in_box = (x_grid >= x1) & (x_grid <= x2) & (y_grid >= y1) & (y_grid <= y2)
    
    b, g, r = img[:, :, 0].astype(int), img[:, :, 1].astype(int), img[:, :, 2].astype(int)
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h_channel = hls[:, :, 0]
    
    skin = (
        in_box &
        (r > 95) & (g > 55) & (b > 35) &
        (r > g) & (g >= b) &
        ((r - b) > 14) & ((r - g) < 85) &
        ((h_channel <= 25) | (h_channel >= 165))
    )
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    skin = cv2.dilate(skin.astype(np.uint8), k, iterations=1)
    return skin.astype(bool)

def build_costume_mask(costume_id):
    img_path = f'public/costumes/{costume_id}.jpg'
    img = cv2.imread(img_path)
    h, w = img.shape[:2]
    y_grid, x_grid = np.indices((h, w))
    gold = is_gold_embroidery(img)
    b, g, r = img[:, :, 0].astype(int), img[:, :, 1].astype(int), img[:, :, 2].astype(int)
    
    robe = np.zeros((h, w), dtype=bool)
    pants = np.zeros((h, w), dtype=bool)
    
    if costume_id == 'ngu_than_chen':
        # Hands & Face
        neck = (y_grid < 246)
        right_hand = is_skin_in_box(img, (335, 515, 395, 645))
        left_hand = is_skin_in_box(img, (575, 515, 635, 645))
        white_collar = (y_grid < 275) & (r > 190) & (g > 190) & (b > 190)
        
        is_navy = (b > r + 2) | ((b > 25) & (r < 65) & (g < 75))
        robe = (y_grid >= 246) & (y_grid <= 885) & (x_grid >= 250) & (x_grid <= 645) & is_navy & (~neck) & (~right_hand) & (~left_hand) & (~white_collar)
        
        is_olive = (y_grid > 885) & (y_grid <= 1115) & (x_grid >= 350) & (x_grid <= 570) & (r > 30)
        pants = is_olive

    elif costume_id == 'ao_tac':
        neck = (y_grid < 255)
        chin = (y_grid < 268) & (x_grid >= 460) & (x_grid <= 540)
        right_hand = is_skin_in_box(img, (335, 520, 390, 615))
        left_hand = is_skin_in_box(img, (575, 520, 625, 615))
        
        is_crimson = (r > 65) & (r > g + 16) & (r > b + 16)
        robe = (y_grid >= 254) & (y_grid <= 815) & (x_grid >= 245) & (x_grid <= 695) & is_crimson & (~neck) & (~chin) & (~right_hand) & (~left_hand) & (~gold)
        
        is_dark_pants = (y_grid > 800) & (y_grid <= 1115) & (x_grid >= 360) & (x_grid <= 680) & (r < 55) & (g < 55)
        pants = is_dark_pants

    elif costume_id == 'nhat_binh':
        headdress = (y_grid < 235)
        right_hand = is_skin_in_box(img, (325, 515, 365, 595))
        left_hand = is_skin_in_box(img, (570, 515, 615, 610))
        phoenix = (x_grid >= 415) & (x_grid <= 510) & (y_grid >= 260) & (y_grid <= 380)
        cuffs = ((x_grid <= 370) | (x_grid >= 590)) & (y_grid >= 430) & (y_grid <= 490) & gold
        
        is_yellow = (r > 120) & (g > 75) & (b < 135) & (r > b + 20)
        robe = (y_grid >= 235) & (y_grid <= 790) & (x_grid >= 320) & (x_grid <= 665) & is_yellow & (~headdress) & (~right_hand) & (~left_hand) & (~phoenix) & (~cuffs)
        
        is_navy_skirt = (y_grid > 790) & (y_grid <= 1115) & (x_grid >= 325) & (x_grid <= 670) & (b > 15) & (r < 75)
        pants = is_navy_skirt

    elif costume_id == 'giao_linh':
        head = (y_grid < 235)
        hands = is_skin_in_box(img, (415, 410, 525, 480))
        collar = (x_grid >= 420) & (x_grid <= 510) & (y_grid >= 235) & (y_grid <= 370) & (r > 180) & (g > 170)
        gold_belt = (x_grid >= 420) & (x_grid <= 520) & (y_grid >= 370) & (y_grid <= 425) & gold
        
        is_teal = (g > r + 8) & (g > b - 15) & (g > 25)
        robe = (y_grid >= 235) & (y_grid <= 880) & (x_grid >= 240) & (x_grid <= 710) & is_teal & (~head) & (~hands) & (~collar) & (~gold_belt)
        
        is_skirt = (y_grid > 880) & (y_grid <= 1130) & (x_grid >= 240) & (x_grid <= 710) & is_teal
        pants = is_skirt

    elif costume_id == 'tu_than':
        head = (y_grid < 240)
        hat_dist = np.sqrt((x_grid - 585)**2 + (y_grid - 535)**2)
        hat = hat_dist < 130
        left_hand = is_skin_in_box(img, (485, 395, 565, 455))
        right_hand = is_skin_in_box(img, (605, 375, 665, 435))
        pink_yem = (x_grid >= 450) & (x_grid <= 540) & (y_grid >= 250) & (y_grid <= 390) & (b > 65)
        
        is_brown = (r > 25) & (r > g + 5) & (r > b + 10)
        robe = (y_grid >= 240) & (y_grid <= 950) & (x_grid >= 310) & (x_grid <= 655) & is_brown & (~head) & (~hat) & (~left_hand) & (~right_hand) & (~pink_yem)
        
        is_black_skirt = (y_grid > 850) & (y_grid <= 1130) & (x_grid >= 340) & (x_grid <= 640) & (r < 45) & (g < 45) & (b < 45)
        pants = is_black_skirt & (~hat)

    elif costume_id == 'ba_ba':
        head = (y_grid < 228)
        left_hand = is_skin_in_box(img, (335, 495, 385, 585))
        right_hand = is_skin_in_box(img, (495, 365, 585, 435))
        chroma = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
        scarf = (x_grid >= 490) & (x_grid <= 610) & (y_grid >= 210) & (y_grid <= 660) & (chroma < 28)
        hair = (x_grid <= 385) & (y_grid <= 360) & (r < 60) & (g < 60) & (b < 60)
        
        is_green = (g > r + 6) & (g > b + 2) & (g > 20)
        robe = (y_grid >= 225) & (y_grid <= 670) & (x_grid >= 310) & (x_grid <= 650) & is_green & (~head) & (~left_hand) & (~right_hand) & (~scarf) & (~hair)
        
        is_green_pants = (y_grid > 660) & (y_grid <= 1115) & (x_grid >= 370) & (x_grid <= 610) & (g > 10) & (g > r)
        pants = is_green_pants

    elif costume_id == 'doi_kham':
        head = (y_grid < 240)
        right_hand = is_skin_in_box(img, (420, 410, 500, 480))
        feet = (y_grid > 1080) & (x_grid >= 350) & (x_grid <= 630)
        fan = (x_grid >= 440) & (x_grid <= 600) & (y_grid >= 410) & (y_grid <= 510) & (r > 120) & (g > 100)
        white_collar = (x_grid >= 445) & (x_grid <= 505) & (y_grid >= 235) & (y_grid <= 320) & (r > 170)
        
        is_purple = (b > g + 6) & (r > g + 10) & (r > 35)
        robe = (y_grid >= 240) & (y_grid <= 870) & (x_grid >= 250) & (x_grid <= 690) & is_purple & (~head) & (~right_hand) & (~gold) & (~fan) & (~white_collar) & (~feet)
        
        is_maroon = (y_grid > 860) & (y_grid <= 1100) & (x_grid >= 360) & (x_grid <= 620) & (r > 35) & (r > b)
        pants = is_maroon & (~feet)

    elif costume_id == 'ao_dai_tan_thoi':
        head = (y_grid < 230)
        right_hand = is_skin_in_box(img, (535, 165, 590, 260))
        left_hand = is_skin_in_box(img, (340, 485, 390, 565))
        pearls = (x_grid >= 460) & (x_grid <= 520) & (y_grid >= 235) & (y_grid <= 280) & (r > 200) & (g > 200) & (b > 200)
        
        is_white_pants = (y_grid >= 470) & (y_grid <= 1115) & (x_grid >= 390) & (x_grid <= 580) & (b > 155) & (g > 155) & (np.abs(r - b) < 22)
        # Pink tunic
        is_pink = (r > 125) & (r > g + 5) & (r > b + 6) & (r < 252)
        robe = (y_grid >= 228) & (y_grid <= 1040) & (x_grid >= 280) & (x_grid <= 670) & is_pink & (~head) & (~right_hand) & (~left_hand) & (~is_white_pants) & (~pearls)
        
        pants = (y_grid >= 470) & (y_grid <= 1115) & is_white_pants

    robe_u8 = clean_mask(robe.astype(np.uint8) * 255)
    pants_u8 = clean_mask(pants.astype(np.uint8) * 255)
    
    final_mask = np.zeros((h, w), dtype=np.uint8)
    final_mask[pants_u8 > 0] = 2
    final_mask[robe_u8 > 0] = 1
    
    mask_path = f'public/costumes/masks/{costume_id}.png'
    cv2.imwrite(mask_path, final_mask)
    print(f'[{costume_id}] Saved mask: {mask_path} (Robe: {np.sum(final_mask == 1)}, Pants: {np.sum(final_mask == 2)})')
    
    # Verification test
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    hls[final_mask == 1, 0] = 155 # Purple
    hls[final_mask == 1, 2] = np.clip(hls[final_mask == 1, 2].astype(int) + 40, 90, 255).astype('uint8')
    hls[final_mask == 2, 0] = 22  # Gold
    hls[final_mask == 2, 2] = np.clip(hls[final_mask == 2, 2].astype(int) + 40, 100, 255).astype('uint8')
    
    recolored = cv2.cvtColor(hls, cv2.COLOR_HLS2BGR)
    art_path = f'/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b/verify_{costume_id}.jpg'
    cv2.imwrite(art_path, recolored)

if __name__ == '__main__':
    for cid in COSTUMES:
        print(f'Processing {cid}...')
        build_costume_mask(cid)
    print('All 8 masks generated and verified!')
