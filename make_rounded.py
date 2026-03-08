import os
from PIL import Image, ImageDraw

def add_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    
    # Fill the corners
    draw_alpha = ImageDraw.Draw(alpha)
    draw_alpha.rectangle([0, 0, rad-1, h-1], fill=255) # ignore this, the paste does it. Wait, the pasted crops just give the corners. 
    # Actually, simpler way:
    return alpha

def make_rounded_rect(im, radius):
    # Create mask
    mask = Image.new('L', im.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], radius=radius, fill=255)
    
    # Apply mask
    out = im.copy()
    out.putalpha(mask)
    return out

# The original image
original_path = '/Users/ncai/.gemini/antigravity/brain/baae2d6a-d3b3-404b-8ae4-5047f2c78ab2/layered_style_2_var1_1772963520730.png'
if not os.path.exists(original_path):
    print("Error: Original image not found")
    exit(1)

img = Image.open(original_path).convert("RGBA")
# The generated image by DALL-E/Imagen usually has a drawn background. We can just crop out the center or just apply a tight rounded rectangle.
# Since the image is 1024x1024 or 512x512, let's check size
print("Image size:", img.size)
# The prompt asked for "dark rounded square background".
# Often the model draws a squircle inside the image itself, with white/black in corners.
# We might need to crop to the squircle first, but let's just assume we apply a rounded rect mask.
# Actually, the user saw the whole image. We can just make the outer corners transparent.
w, h = img.size
# 22.5% corner radius is apple standard
radius = int(min(w, h) * 0.225)
rounded_img = make_rounded_rect(img, radius)
rounded_img.save('devtoys/favicon.png', 'PNG')
print('Rounded favicon generated!')
