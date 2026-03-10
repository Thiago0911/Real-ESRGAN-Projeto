import os
from PIL import Image

input_folder = "output_rgba"
output_folder = "output_white"

os.makedirs(output_folder, exist_ok=True)

for file in os.listdir(input_folder):
    if file.lower().endswith(".png"):
        path = os.path.join(input_folder, file)
        im = Image.open(path).convert("RGBA")

        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])

        new_name = os.path.splitext(file)[0] + ".jpg"
        bg.save(os.path.join(output_folder, new_name), quality=95)

print("Conversão concluída.")