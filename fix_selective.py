#!/usr/bin/env python3
# Restore "Yoojin Lee" in the hero section while keeping "Y" in navigation

import re

js_file = 'public/yoojin/_next/static/chunks/d0f6b0abfbafd6a5.js'

print(f"Reading {js_file}...")
with open(js_file, 'r', encoding='utf-8') as f:
    content = f.read()

# First, restore all "Y" back to "Yoojin Lee"
content = content.replace('"Y"', '"Yoojin Lee"')

# Now selectively replace only in the Navigation brand component
# The pattern looks for the Navigation brand div and replaces its content
# Looking for: "brand">Yoojin Lee</div>
content = re.sub(
    r'(__VVOzFG__brand[^>]*>)Yoojin Lee(<)',
    r'\1Y\2',
    content
)

# Write back
with open(js_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed JavaScript bundle!")
print("  - Navigation logo: 'Y'")
print("  - Hero section: 'Yoojin Lee' (restored)")
