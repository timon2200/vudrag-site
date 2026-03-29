import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
import re

coins = [
    ("Kraljica_Jelena", "Kraljica Jelena Slavna zlatnik hrvatska kovnica novca"),
    ("Hrvatski_hladnokrvnjak", "Hrvatski hladnokrvnjak kovanica hrvatska kovnica novca"),
    ("Kralj_Tomislav", "Kralj Tomislav zlatnik hrvatska kovnica novca"),
    ("Konturna_kravata", "Konturna kravata kovanica zlatnik srebrnjak hrvatska kovnica"),
    ("Dalmatinski_pas", "Dalmatinski pas zlatnik kovanica hrvatska kovnica novca")
]

output_dir = "public/images/coins/vudrag_hkn_coins"
os.makedirs(output_dir, exist_ok=True)

for coin_name, query in coins:
    print(f"Searching for {coin_name}...")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    url = f"https://duckduckgo.com/html/?q={urllib.parse.quote(query)}"
    try:
        res = requests.get(url, headers=headers)
        soup = BeautifulSoup(res.text, "html.parser")
        
        # Extract image links from DDG html search
        # Usually from Wikipedia or news sites
        links = []
        for a in soup.find_all("a", class_="result__url"):
            href = a.get("href")
            if href:
                links.append(href)
        
        # To get actual images reliably, let's just use Wikipedia's API
        wiki_url = f"https://hr.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(coin_name.replace('_', ' '))}&utf8=&format=json"
        
        print(f"URLs found: {links[:3]}")
    except Exception as e:
        print(e)
