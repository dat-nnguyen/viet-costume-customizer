import cv2
import numpy as np

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

# For each image, let's find the shoes / feet Y coordinate!
for cid in COSTUMES:
    img = cv2.imread(f'public/costumes/{cid}.jpg')
    h, w = img.shape[:2]
    # Let's check where the shoes are visible
    # We can inspect the vertical profile in the bottom half (y in 850..1200, x in 300..650)
    print(f"=== {cid} ===")
    # Print sample brightness at center x=450 down from y=850 to 1180
    samples = [(y, img[y, 450].tolist()) for y in range(850, 1180, 40)]
    for y, bgr in samples:
        print(f"  y={y}: {bgr}")
