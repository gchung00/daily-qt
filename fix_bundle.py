#!/usr/bin/env python3
# Fix React hydration issues by updating the JavaScript bundle

import os

js_file = 'public/yoojin/_next/static/chunks/d0f6b0abfbafd6a5.js'

print(f"Reading {js_file}...")
with open(js_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Count occurrences before
yoojin_count = content.count('Yoojin Lee')
mock_count = content.count('"/mock_')
sample_count = content.count('"/sample_')

print(f"Found {yoojin_count} occurrences of 'Yoojin Lee'")
print(f"Found {mock_count} occurrences of '\"/mock_'")
print(f"Found {sample_count} occurrences of '\"/sample_'")

# Make replacements
content = content.replace('Yoojin Lee', 'Y')
content = content.replace('"/mock_', '"/yoojin/mock_')
content = content.replace('"/sample_', '"/yoojin/sample_')

# Write back
with open(js_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed JavaScript bundle successfully!")
print("  - Logo: 'Yoojin Lee' → 'Y'")
print("  - Images: '/mock_' → '/yoojin/mock_'")
print("  - Images: '/sample_' → '/yoojin/sample_'")
