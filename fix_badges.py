#!/usr/bin/env python3
# Fix the broken badge script in index.html

with open('public/yoojin/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the broken script
import re
content = re.sub(r'<script>\(function\(\)\{const imgs.*?</script>(?=</body>)', '', content)

# Add a working script that waits for React hydration
badge_script = '''<script>setTimeout(function(){var imgs=document.querySelectorAll("img[src*=mock]");imgs.forEach(function(img){var w=img.closest("[class*=imageWrapper]");if(w){w.style.position="relative";var b=document.createElement("div");b.className="mock-badge";b.textContent="AI Generated";w.appendChild(b);}});},2000);</script>'''

content = content.replace('</body>', badge_script + '</body>')

with open('public/yoojin/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed badge script!")
