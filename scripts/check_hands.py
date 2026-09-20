import cv2
import numpy as np

for cid in ['ao_tac', 'nhat_binh', 'tu_than', 'ao_dai_tan_thoi', 'ngu_than_chen']:
    img = cv2.imread(f'public/costumes/{cid}.jpg')
    # Let's crop around where hands are expected and inspect average colors
    print(f"=== {cid} ===")
    if cid == 'ao_tac':
        # Hand 1: around y: 500..585, x: 350..400
        crop1 = img[500:585, 350:400]
        # Hand 2: around y: 515..600, x: 580..640
        crop2 = img[515:600, 580:640]
        # Neck: y: 220..270, x: 470..530
        crop3 = img[220:270, 470:530]
        print("ao_tac left hand (x:350..400, y:500..585): mean BGR =", np.mean(crop1, axis=(0,1)))
        print("ao_tac right hand (x:580..640, y:515..600): mean BGR =", np.mean(crop2, axis=(0,1)))
        print("ao_tac neck (x:470..530, y:220..270): mean BGR =", np.mean(crop3, axis=(0,1)))
    elif cid == 'nhat_binh':
        crop1 = img[510:600, 330:375]
        crop2 = img[515:615, 570:645]
        crop3 = img[190:255, 460:540]
        print("nhat_binh left hand (x:330..375, y:510..600): mean BGR =", np.mean(crop1, axis=(0,1)))
        print("nhat_binh right hand (x:570..645, y:515..615): mean BGR =", np.mean(crop2, axis=(0,1)))
        print("nhat_binh neck (x:460..540, y:190..255): mean BGR =", np.mean(crop3, axis=(0,1)))
    elif cid == 'tu_than':
        # Chin/neck
        crop3 = img[200:280, 450:540]
        print("tu_than neck (x:450..540, y:200..280): mean BGR =", np.mean(crop3, axis=(0,1)))
    elif cid == 'ao_dai_tan_thoi':
        crop1 = img[480:570, 350:405]
        crop3 = img[195:265, 460:540]
        print("ao_dai left hand (x:350..405, y:480..570): mean BGR =", np.mean(crop1, axis=(0,1)))
        print("ao_dai neck (x:460..540, y:195..265): mean BGR =", np.mean(crop3, axis=(0,1)))
