#!/usr/bin/env python3
from pathlib import Path
import csv
from collections import Counter
ROOT=Path(__file__).resolve().parents[1]
rows=list(csv.DictReader((ROOT/'00_governance/ARCHITECTURE_GAP_CLASSIFICATION.csv').open(encoding='utf-8')))
ACP={1:'ACP-001',78:'ACP-001',52:'ACP-002',55:'ACP-002',58:'ACP-002',31:'ACP-003',38:'ACP-003',40:'ACP-003',59:'ACP-004',103:'ACP-004',106:'ACP-004',114:'ACP-004',116:'ACP-004',85:'ACP-005',86:'ACP-005',87:'ACP-005',92:'ACP-005',96:'ACP-006',97:'ACP-006',99:'ACP-006'}
AR={14:'AR-001',47:'AR-002',69:'AR-002',24:'AR-003',48:'AR-003',18:'AR-004',37:'AR-005',38:'AR-005',40:'AR-005',34:'AR-006',44:'AR-007',49:'AR-008',60:'AR-009',100:'AR-009',61:'AR-010',79:'AR-010',66:'AR-011',83:'AR-012',75:'AR-013',77:'AR-014',80:'AR-015',88:'AR-016',93:'AR-017',94:'AR-018',102:'AR-019',105:'AR-020',108:'AR-021',111:'AR-022',121:'AR-023',122:'AR-024',129:'AR-025',125:'AR-026',131:'AR-026',132:'AR-027',136:'AR-027',139:'AR-027',133:'AR-028',126:'AR-029',142:'AR-029',161:'AR-030',166:'AR-031',169:'AR-032',22:'AR-033',43:'AR-034',45:'AR-035',50:'AR-036',53:'AR-037',56:'AR-038',57:'AR-039',68:'AR-040',76:'AR-041',81:'AR-042',89:'AR-043',98:'AR-044',107:'AR-045',109:'AR-046',112:'AR-047',113:'AR-048',117:'AR-049',119:'AR-050',123:'AR-051',127:'AR-052',130:'AR-053',134:'AR-054',137:'AR-055',140:'AR-056',141:'AR-057',148:'AR-058',158:'AR-059',159:'AR-060',164:'AR-061',165:'AR-062'}
out=[]
for r in rows:
    i=int(r['id']); refs=[]
    if i in ACP: refs.append(ACP[i])
    if i in AR: refs.append(AR[i])
    if refs: status='PROPOSED_RESOLUTION'
    elif r['disposition']=='DEFERRED_BOUNDARY': status='ROUTED_DEFERRED'
    elif r['disposition']=='CALIBRATION_EVAL': status='ROUTED_CALIBRATION'
    elif r['disposition']=='PRODUCT_UX_POLICY': status='ROUTED_UX'
    elif r['disposition']=='ENGINEERING_SPEC': status='ROUTED_ENGINEERING'
    elif r['disposition']=='ARCHITECTURE_CONTRACT': status='ARCHITECTURE_REVIEW_PENDING'
    elif r['disposition']=='ACP_REQUIRED': status='ACP_DRAFT_PENDING'
    else: status='OPEN'
    x=dict(r); x['resolution_status']=status; x['resolution_ref']=', '.join(refs); out.append(x)
fields=['id','domain','feature','question','disposition','priority','resolution_status','resolution_ref','target']
with (ROOT/'00_governance/OPEN_QUESTIONS_RESOLUTION_TRACKER.csv').open('w',newline='',encoding='utf-8') as fp:
    w=csv.DictWriter(fp,fieldnames=fields); w.writeheader(); w.writerows(out)
c=Counter(r['resolution_status'] for r in out)
lines=['# Artist OS — Open Questions Resolution Tracker','', '**Purpose:** single control surface for all 203 product/architecture questions.','', 'A `PROPOSED_RESOLUTION` is not equivalent to approved MASTER change. ACPs and architecture contracts remain reviewable until freeze.','', '## Status summary','', '| Status | Count |','|---|---:|']
for k,v in sorted(c.items()): lines.append(f'| {k} | {v} |')
lines += ['', '## Tracker','', '| # | Priority | Disposition | Status | Resolution | Domain / Feature | Question |','|---:|---|---|---|---|---|---|']
for r in out:
    q=r['question'].replace('|','\\|'); ref=r['resolution_ref'] or '—'
    lines.append(f"| {r['id']} | **{r['priority']}** | `{r['disposition']}` | `{r['resolution_status']}` | {ref} | `{r['domain']}/{r['feature']}` | {q} |")
(ROOT/'00_governance/OPEN_QUESTIONS_RESOLUTION_TRACKER.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(dict(c))
