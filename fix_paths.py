#!/usr/bin/env python3
# Fix image paths in /yoojin/index.html

with open('public/yoojin/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace image paths
content = content.replace('src="/mock_', 'src="/yoojin/mock_')
content = content.replace('src="/sample_', 'src="/yoojin/sample_')

with open('public/yoojin/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed image paths successfully!")
