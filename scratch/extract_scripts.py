import re
import html

content_path = r"C:\Users\IZHAR UL HAQ\.gemini\antigravity-ide\brain\5f25b9f5-a058-445c-bfab-dbd39b24d9ee\.system_generated\steps\17\content.md"

with open(content_path, "r", encoding="utf-8") as f:
    text = f.read()

# Find all script tags (inline)
scripts = re.findall(r"<script[^>]*>(.*?)</script>", text, re.DOTALL | re.IGNORECASE)

print(f"Found {len(scripts)} scripts.")

# Let's save scripts that have some search keywords like "title", "pixel", "width", "char"
for i, script in enumerate(scripts):
    if any(k in script.lower() for k in ["title", "description", "pixel", "width", "char", "truncate"]):
        output_file = f"e:\\ToTheWebPro\\tothewebpro\\scratch\\script_{i}.js"
        with open(output_file, "w", encoding="utf-8") as out:
            out.write(script)
        print(f"Saved matching script {i} to {output_file} ({len(script)} chars)")
