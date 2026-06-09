import re

content_path = r"C:\Users\IZHAR UL HAQ\.gemini\antigravity-ide\brain\5f25b9f5-a058-445c-bfab-dbd39b24d9ee\.system_generated\steps\17\content.md"

with open(content_path, "r", encoding="utf-8") as f:
    text = f.read()

# Let's search for sizer ids in style tags or elements
# and print matches
matches = re.findall(r"(#[a-zA-Z\-]*sizer[a-zA-Z\-]*\s*\{.*?\})", text, re.IGNORECASE)
print("Style matches:")
for m in matches:
    print(m)

# Let's search for sizer elements in HTML
html_matches = re.findall(r'(<[^>]*id=["\'][^"\']*sizer[^"\']*["\'][^>]*>)', text, re.IGNORECASE)
print("\nHTML matches:")
for hm in html_matches:
    print(hm)
