import requests
import re
import os

headers = {"User-Agent": "Mozilla/5.0"}
url = "https://croatianmint.hr/en/trgovina/"
res = requests.get(url, headers=headers)

# Find all image URLs ending in .jpg or .png
image_urls = set(re.findall(r'https://croatianmint\.hr/wp-content/uploads/[0-9]{4}/[0-9]{2}/[^"\']+\.(?:jpg|png)', res.text))

print(f"Found {len(image_urls)} images.")
for url in list(image_urls)[:10]:
    print(url)
