from collections import deque
from pathlib import Path
from PIL import Image

input_path = Path("public/logo-official.png")
output_path = Path("public/logo-official-nobg.png")
replace_original = True

img = Image.open(input_path).convert("RGBA")
pix = img.load()
width, height = img.size

# Estimate matte color from border pixels only.
border_points = []
for x in range(width):
    border_points.append((x, 0))
    border_points.append((x, height - 1))
for y in range(height):
    border_points.append((0, y))
    border_points.append((width - 1, y))

rs = gs = bs = 0
for x, y in border_points:
    r, g, b, _ = pix[x, y]
    rs += r
    gs += g
    bs += b

count = len(border_points)
bg_r = rs / count
bg_g = gs / count
bg_b = bs / count

hard_threshold = 16.0
soft_threshold = 34.0


def color_dist(x, y):
    r, g, b, _ = pix[x, y]
    dr = r - bg_r
    dg = g - bg_g
    db = b - bg_b
    return (dr * dr + dg * dg + db * db) ** 0.5


# Flood-fill from edges to remove only connected background.
visited = [[False for _ in range(height)] for _ in range(width)]
q = deque()

for x, y in border_points:
    if not visited[x][y] and color_dist(x, y) <= soft_threshold:
        visited[x][y] = True
        q.append((x, y))

while q:
    x, y = q.popleft()
    r, g, b, a = pix[x, y]
    d = color_dist(x, y)

    if d <= hard_threshold:
        new_a = 0
    else:
        edge_alpha = int(255 * (d - hard_threshold) / (soft_threshold - hard_threshold))
        new_a = min(a, max(0, min(255, edge_alpha)))

    pix[x, y] = (r, g, b, new_a)

    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
        if 0 <= nx < width and 0 <= ny < height and not visited[nx][ny]:
            if color_dist(nx, ny) <= soft_threshold:
                visited[nx][ny] = True
                q.append((nx, ny))

img.save(output_path)

if replace_original:
    img.save(input_path)

print(f"Background removed. Saved: {output_path}")
