import re

content_path = r"C:\Users\IZHAR UL HAQ\.gemini\antigravity-ide\brain\5f25b9f5-a058-445c-bfab-dbd39b24d9ee\.system_generated\steps\17\content.md"

with open(content_path, "r", encoding="utf-8") as f:
    text = f.read()

# Find script src
script_srcs = re.findall(r'<script[^>]*src=["\'](.*?)["\']', text, re.IGNORECASE)
print("--- Script Srcs ---")
for src in script_srcs:
    print(src)

# Find iframes
iframes = re.findall(r'<iframe[^>]*src=["\'](.*?)["\']', text, re.IGNORECASE)
print("\n--- Iframes ---")
for iframe in iframes:
    print(iframe)
