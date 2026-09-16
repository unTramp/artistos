#!/usr/bin/env python3
from pathlib import Path
import re, csv, json
ROOT=Path(__file__).resolve().parents[1]
OUT_MD=ROOT/'00_governance'/'OPEN_QUESTIONS_REGISTRY.md'
OUT_CSV=ROOT/'00_governance'/'OPEN_QUESTIONS_REGISTRY.csv'

def extract_section(text):
    m=re.search(r'^##\s+32(?:\.|\b)[^\n]*Open Questions[^\n]*$', text, re.M|re.I)
    if not m: return []
    start=m.end(); tail=text[start:]
    nm=re.search(r'^##\s+\d+', tail, re.M)
    sec=tail[:nm.start()] if nm else tail
    lines=sec.strip().splitlines(); out=[]; cur=None
    for line in lines:
        s=line.strip()
        if not s: continue
        mm=re.match(r'^(?:[-*]|\d+[.)])\s+(.*)$', s)
        if mm:
            if cur: out.append(cur.strip())
            cur=mm.group(1).strip()
        elif s.startswith('>'):
            continue
        elif cur:
            cur += ' ' + s
        else:
            cur=s
    if cur: out.append(cur.strip())
    cleaned=[]
    for q in out:
        q=re.sub(r'\s+---\s*$', '', q).strip()
        if q.lower() in {'none','none.','n/a','no open questions.','no open questions'}: continue
        cleaned.append(q)
    return cleaned

items=[]
for domain in sorted(ROOT.iterdir()):
    if not domain.is_dir() or domain.name=='00_governance' or not re.match(r'^\d\d_',domain.name): continue
    for f in sorted(domain.glob('[0-9][0-9]_*.md')):
        for q in extract_section(f.read_text(encoding='utf-8')):
            items.append({'id':len(items)+1,'domain':domain.name,'feature':f.name,'question':q})

lines=['# Artist OS — Open Questions Registry','',
       '**Source:** aggregated from §32 of all detailed feature specs after first full domain pass.','',
       'These items are **not** permission to modify MASTER v1.3. Architecture-changing resolutions require an Architecture Change Proposal.','',
       f'**Open questions captured:** {len(items)}.','',
       '| # | Domain | Feature | Open question |','|---:|---|---|---|']
for x in items:
    q=x['question'].replace('|','\\|')
    lines.append(f"| {x['id']} | `{x['domain']}` | `{x['feature']}` | {q} |")
OUT_MD.write_text('\n'.join(lines)+'\n', encoding='utf-8')
with OUT_CSV.open('w',newline='',encoding='utf-8') as fp:
    w=csv.DictWriter(fp,fieldnames=['id','domain','feature','question']); w.writeheader(); w.writerows(items)
print(f'Wrote {len(items)} questions to {OUT_MD} and {OUT_CSV}')
