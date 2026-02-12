#!/usr/bin/env python3
# Update navigation brand to show just "Y" as a logo

with open('public/yoojin/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the brand text "Yoojin Lee" with just "Y" and add styling
content = content.replace(
    '<div class="Navigation-module__VVOzFG__brand">Yoojin Lee</div>',
    '<div class="Navigation-module__VVOzFG__brand" style="font-size:32px;font-weight:700;font-family:serif;letter-spacing:-2px;">Y</div>'
)

with open('public/yoojin/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated navigation brand to 'Y' logo!")
