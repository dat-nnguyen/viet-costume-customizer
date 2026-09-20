import os
import cv2
import numpy as np

os.makedirs('public/costumes/masks', exist_ok=True)

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

def is_gold(img):
    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h, l, s = hls[:, :, 0], hls[:, :, 1], hls[:, :, 2]
    return ((h >= 14) & (h <= 34) & (s > 55) & (l > 55) & (l < 225)).astype(bool)

def clean(mask, min_size=300):
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, k)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(closed)
    out = np.zeros_like(closed)
    for i in range(1, num_labels):
        if stats[i, cv2.CC_STAT_AREA] >= min_size:
            out[labels == i] = 255
    return out

def build_perfect_masks():
    h, w = 1200, 896
    y_grid, x_grid = np.indices((h, w))

    for cid in COSTUMES:
        img = cv2.imread(f'public/costumes/{cid}.jpg')
        b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
        
        robe = np.zeros((h, w), dtype=bool)
        pants = np.zeros((h, w), dtype=bool)
        exclusions = np.zeros((h, w), dtype=bool)

        if cid == 'ngu_than_chen':
            is_navy = (b > r + 2) | ((b > 25) & (r < 65) & (g < 75))
            robe = (y_grid >= 246) & (y_grid <= 885) & (x_grid >= 250) & (x_grid <= 645) & is_navy
            pants = (y_grid > 885) & (y_grid <= 1115) & (x_grid >= 350) & (x_grid <= 570) & (r > 30)
            
            exclusions |= (y_grid < 246)
            exclusions |= (x_grid >= 335) & (x_grid <= 395) & (y_grid >= 515) & (y_grid <= 645)
            exclusions |= (x_grid >= 575) & (x_grid <= 635) & (y_grid >= 515) & (y_grid <= 645)
            exclusions |= (y_grid < 275) & (r > 190) & (g > 190) & (b > 190)
            exclusions |= (y_grid > 1115)

        elif cid == 'ao_tac':
            is_crimson = (r > 65) & (r > g + 16) & (r > b + 16)
            robe = (y_grid >= 265) & (y_grid <= 815) & (x_grid >= 245) & (x_grid <= 695) & is_crimson
            pants = (y_grid > 800) & (y_grid <= 1115) & (x_grid >= 360) & (x_grid <= 680) & (r < 55) & (g < 55)
            
            # Exclusions: Chin & Neck, Hands, Gold dragons
            exclusions |= (y_grid < 288) & (x_grid >= 430) & (x_grid <= 545)
            exclusions |= (y_grid < 255)
            exclusions |= (x_grid >= 315) & (x_grid <= 350) & (y_grid >= 515) & (y_grid <= 585)
            exclusions |= (x_grid >= 580) & (x_grid <= 635) & (y_grid >= 515) & (y_grid <= 600)
            exclusions |= is_gold(img)
            exclusions |= (y_grid > 1115)

        elif cid == 'nhat_binh':
            gc_mask = np.zeros((h, w), np.uint8)
            gc_mask[:200, :] = cv2.GC_BGD
            gc_mask[:, :210] = cv2.GC_BGD
            gc_mask[:, 690:] = cv2.GC_BGD
            gc_mask[1130:, :] = cv2.GC_BGD
            gc_mask[230:1120, 240:670] = cv2.GC_PR_FGD
            
            gc_mask[350:500, 360:400] = cv2.GC_FGD
            gc_mask[350:500, 520:560] = cv2.GC_FGD
            gc_mask[500:750, 420:500] = cv2.GC_FGD
            gc_mask[300:460, 320:380] = cv2.GC_FGD
            gc_mask[260:460, 560:610] = cv2.GC_FGD
            gc_mask[850:1100, 400:550] = cv2.GC_FGD
            
            bgdModel = np.zeros((1, 65), np.float64)
            fgdModel = np.zeros((1, 65), np.float64)
            cv2.grabCut(img, gc_mask, None, bgdModel, fgdModel, 4, cv2.GC_INIT_WITH_MASK)
            fg = np.where((gc_mask == cv2.GC_FGD) | (gc_mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
            
            robe = (fg > 128) & (y_grid >= 235) & (y_grid <= 800) & (x_grid >= 310) & (x_grid <= 665)
            pants = (fg > 128) & (y_grid > 800) & (y_grid <= 1115) & (b > 15)
            
            exclusions |= (y_grid < 235)
            exclusions |= (x_grid >= 415) & (x_grid <= 510) & (y_grid >= 258) & (y_grid <= 385)
            exclusions |= ((x_grid <= 365) | (x_grid >= 595)) & (y_grid >= 440) & (y_grid <= 495)
            exclusions |= (x_grid >= 320) & (x_grid <= 370) & (y_grid >= 510) & (y_grid <= 600)
            exclusions |= (x_grid >= 565) & (x_grid <= 620) & (y_grid >= 510) & (y_grid <= 615)
            exclusions |= (x_grid > 610) & (y_grid < 400) # prevent right shoulder wall halo
            exclusions |= (y_grid > 1115)

        elif cid == 'giao_linh':
            gold = is_gold(img)
            is_teal = (g > r + 8) & (g > b - 15) & (g > 25)
            robe = (y_grid >= 235) & (y_grid <= 880) & (x_grid >= 240) & (x_grid <= 710) & is_teal
            pants = (y_grid > 880) & (y_grid <= 1130) & (x_grid >= 240) & (x_grid <= 710) & is_teal
            
            exclusions |= (y_grid < 235)
            exclusions |= (x_grid >= 415) & (x_grid <= 525) & (y_grid >= 410) & (y_grid <= 480) & (r > g) & (g > b)
            exclusions |= (x_grid >= 420) & (x_grid <= 510) & (y_grid >= 235) & (y_grid <= 370) & (r > 180) & (g > 170)
            exclusions |= (x_grid >= 420) & (x_grid <= 520) & (y_grid >= 370) & (y_grid <= 425) & gold
            exclusions |= (y_grid > 1130)

        elif cid == 'tu_than':
            fg_tt = cv2.imread('/tmp/tu_than_fg.png', cv2.IMREAD_GRAYSCALE)
            if fg_tt is None:
                fg_tt = np.ones((h, w), dtype=np.uint8)*255
                
            robe = (fg_tt > 128) & (y_grid >= 240) & (y_grid <= 950) & (x_grid >= 310) & (x_grid <= 655)
            pants = (fg_tt > 128) & (y_grid > 850) & (y_grid <= 1130) & (x_grid >= 340) & (x_grid <= 640) & (r < 50) & (g < 50)
            
            hat = (((x_grid - 574.0)/125.0)**2 + ((y_grid - 550.0)/185.0)**2) <= 1.05
            hat |= (x_grid >= 470) & (x_grid <= 685) & (y_grid >= 390) & (y_grid <= 710) & (r > 120)
            exclusions |= hat
            exclusions |= (y_grid < 285) & (x_grid >= 420) & (x_grid <= 525)
            exclusions |= (y_grid < 240)
            exclusions |= (x_grid >= 485) & (x_grid <= 565) & (y_grid >= 395) & (y_grid <= 455)
            exclusions |= (x_grid >= 605) & (x_grid <= 665) & (y_grid >= 375) & (y_grid <= 435)
            exclusions |= (x_grid >= 450) & (x_grid <= 540) & (y_grid >= 250) & (y_grid <= 390) & (b > 65)
            exclusions |= (y_grid > 1130)

        elif cid == 'ba_ba':
            is_green = (g > r + 5) & (g > b) & (g > 18)
            robe = (y_grid >= 225) & (y_grid <= 670) & (x_grid >= 310) & (x_grid <= 665) & is_green
            pants = (y_grid > 660) & (y_grid <= 1115) & (x_grid >= 365) & (x_grid <= 615) & (g > 5) & (g >= r)
            
            chroma = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
            exclusions |= (y_grid < 228)
            exclusions |= (x_grid >= 335) & (x_grid <= 385) & (y_grid >= 495) & (y_grid <= 585) & (r > g) & (g > b)
            exclusions |= (x_grid >= 495) & (x_grid <= 585) & (y_grid >= 365) & (y_grid <= 435) & (r > g) & (g > b)
            exclusions |= (x_grid >= 490) & (x_grid <= 610) & (y_grid >= 210) & (y_grid <= 660) & (chroma < 28)
            exclusions |= (x_grid <= 390) & (y_grid <= 370) & (r < 65) & (g < 65) & (b < 65)
            exclusions |= (y_grid > 1115)

        elif cid == 'doi_kham':
            gold = is_gold(img)
            is_purple = (b > g + 6) & (r > g + 10) & (r > 35)
            robe = (y_grid >= 240) & (y_grid <= 870) & (x_grid >= 250) & (x_grid <= 690) & is_purple
            pants = (y_grid > 860) & (y_grid <= 1100) & (x_grid >= 360) & (x_grid <= 620) & (r > 35) & (r > b)
            
            exclusions |= (y_grid < 240)
            exclusions |= (x_grid >= 420) & (x_grid <= 500) & (y_grid >= 410) & (y_grid <= 480) & (r > g) & (g > b)
            exclusions |= (y_grid > 1080) & (x_grid >= 350) & (x_grid <= 630)
            exclusions |= (x_grid >= 440) & (x_grid <= 600) & (y_grid >= 410) & (y_grid <= 510) & (r > 120) & (g > 100)
            exclusions |= (x_grid >= 445) & (x_grid <= 505) & (y_grid >= 235) & (y_grid <= 320) & (r > 170)
            exclusions |= gold

        elif cid == 'ao_dai_tan_thoi':
            is_white_pants = (y_grid >= 470) & (y_grid <= 1115) & (x_grid >= 390) & (x_grid <= 580) & (b > 155) & (g > 155) & (np.abs(r - b) < 22)
            is_pink = (r > 125) & (r > g + 14) & (r > b + 18) & (x_grid >= 315) & (x_grid <= 645)
            robe = (y_grid >= 228) & (y_grid <= 1040) & is_pink
            pants = is_white_pants
            
            exclusions |= (y_grid < 262) & (x_grid >= 420) & (x_grid <= 540)
            exclusions |= (y_grid < 230)
            exclusions |= (x_grid >= 520) & (x_grid <= 595) & (y_grid >= 165) & (y_grid <= 280)
            exclusions |= (x_grid >= 335) & (x_grid <= 395) & (y_grid >= 480) & (y_grid <= 585)
            exclusions |= (x_grid >= 460) & (x_grid <= 520) & (y_grid >= 235) & (y_grid <= 280) & (r > 200) & (g > 200) & (b > 200)
            exclusions |= (y_grid > 1115)

        # CLEAN FIRST, THEN APPLY STRICT EXCLUSIONS
        r_clean = clean(robe.astype(np.uint8)*255)
        p_clean = clean(pants.astype(np.uint8)*255)
        
        r_clean[exclusions] = 0
        p_clean[exclusions] = 0

        final_mask = np.zeros((h, w), dtype=np.uint8)
        final_mask[p_clean > 0] = 2
        final_mask[r_clean > 0] = 1 # Robe takes precedence
        
        cv2.imwrite(f'public/costumes/masks/{cid}.png', final_mask)
        print(f'[{cid}] Saved mask -> Robe px: {np.sum(final_mask == 1)}, Pants px: {np.sum(final_mask == 2)}')

        # Generate verification preview
        hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
        hls[final_mask == 1, 0] = 155 # Purple
        hls[final_mask == 1, 2] = np.clip(hls[final_mask == 1, 2].astype(int) + 35, 90, 255).astype('uint8')
        hls[final_mask == 2, 0] = 22  # Gold
        hls[final_mask == 2, 2] = np.clip(hls[final_mask == 2, 2].astype(int) + 35, 90, 255).astype('uint8')
        recolored = cv2.cvtColor(hls, cv2.COLOR_HLS2BGR)
        out_path = f'/Users/datnguyen/.gemini/antigravity-ide/brain/582c3ed7-e47a-45c1-9bc1-0c84c05a319b/verify_{cid}.jpg'
        cv2.imwrite(out_path, recolored)

    print("All masks successfully finalized and verification images saved!")

if __name__ == '__main__':
    build_perfect_masks()
