# -*- coding: utf-8 -*-
import re

content = open(r'race/攜手基地：以線上遊戲孕育友誼與社會連結.md', encoding='utf-8').read()

if '## 參考文獻' in content:
    body = content.split('## 參考文獻')[0]
elif '## 參考資料' in content:
    body = content.split('## 參考資料')[0]
else:
    body = content

clean = re.sub(r'!\[.*?\]\(.*?\)', '', body)
clean = re.sub(r'\(https?://\S+\)', '', clean)
cjk = len(re.findall(r'[\u4e00-\u9fff]', clean))
words = cjk + len(re.findall(r'[a-zA-Z0-9_\-]+', clean))

print(f"Current Body CJK characters: {cjk}")
print(f"Current Word-like count: {words}")
