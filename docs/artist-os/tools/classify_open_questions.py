#!/usr/bin/env python3
from pathlib import Path
import csv, re, collections
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'00_governance'/'OPEN_QUESTIONS_REGISTRY.csv'
OUT_CSV=ROOT/'00_governance'/'ARCHITECTURE_GAP_CLASSIFICATION.csv'
OUT_MD=ROOT/'00_governance'/'ARCHITECTURE_GAP_CLASSIFICATION.md'
rows=list(csv.DictReader(SRC.open(encoding='utf-8')))

# Items whose resolution would alter/extend MASTER's canonical domain model, not merely implement it.
ACP_IDS={
    1,   # Period/Monthly objective first-class model
    31,  # Narrative multi-track cardinality beyond singular narrativeTrackId
    52,58, # Release first-class model / multi-track release semantics
    59,103,106,114,116, # shared cross-domain external action/task model
    78,  # same PlanningObjective gap, canonical planning model
    87,  # Take entity + Shot status reconciliation
    97,  # multi-parent asset lineage conflicts with singular parentAssetId
}
# Questions intentionally outside v1.3 or future modules; do not block core.
DEFER_IDS={
    29,  # brand book sharing/collab permissions
    120,125,131, # future Publicity relationship ownership
    138, # inventory/order integration outside scope
    167, # future reviewer roles
}
# Explicit calibration/eval questions.
CAL_IDS={39}
for r in rows:
    i=int(r['id']); q=r['question'].lower()
    if any(k in q for k in ['calibrat','threshold','minimum observation','sample guidance','eval','ranking weights','decay curve','confidence calculation','similarity algorithm','classifier','baseline-window','age-bucket','retention definitions','batch size','candidate count']):
        CAL_IDS.add(i)
# Product/UX policy questions that should be resolved by product/UX rather than schema.
UX_IDS={15}
for r in rows:
    i=int(r['id']); q=r['question'].lower()
    if any(k in q for k in ['ux-', 'ux ', 'mobile', 'how many', 'default snooze', 'checklist', 'first useful action', 'user-editable', 'visible before collapsing', 'exact required vs optional', 'prompt library', 'sharing/access-link', 'quick add', 'current focus allow', 'default denominator', 'exact grouping', 'folders/collections', 'configurable product taxonomy', 'clustering ux']):
        UX_IDS.add(i)

# Architecture-contract questions are cross-domain semantics/ownership/cardinality/preference rules that
# can be frozen in companion architecture without necessarily editing MASTER.
ARCH_CONTRACT_IDS={
    14,18,22,24,31,34,35,37,38,43,44,45,47,48,49,50,53,55,56,57,60,61,
    66,68,69,72,73,75,76,77,79,80,81,83,85,88,89,93,94,96,98,99,100,102,
    105,107,108,109,111,112,113,117,119,121,122,123,126,127,129,130,132,
    133,134,136,137,140,141,142,148,157,158,159,161,164,165,166,169
}

# P0: must be settled before canonical schema / Stage 1-4 implementation.
P0_IDS={
    1,31,41,44,47,52,54,55,58,59,60,61,66,69,73,74,76,77,78,79,81,83,84,85,86,87,
    93,94,96,97,98,100,103,104,105,106,107,109,111,112,113,114,115,116,117,118,119,
    121,122,123,132,134,136,137,139,140,141,142,152,153,154,158,159,161,162,164,165,
    166,169,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203
}

# Specific target documents for resolution.
def target_for(i,cat,q,domain):
    if cat=='ACP_REQUIRED': return 'Architecture Change Proposal → MASTER v1.4 candidate'
    if cat=='CALIBRATION_EVAL': return 'AI/Analytics Eval & Calibration Spec'
    if cat=='PRODUCT_UX_POLICY': return 'UX / Interaction Spec or product configuration'
    if cat=='DEFERRED_BOUNDARY': return 'Deferred Scope Register / future domain'
    if cat=='ARCHITECTURE_CONTRACT': return 'Architecture Decision Record / Domain Rulebook'
    return 'Engineering Specification / Data Model Reference'

def classify(r):
    i=int(r['id']); q=r['question'].lower()
    if i in ACP_IDS: cat='ACP_REQUIRED'
    elif i in CAL_IDS:
        cat='CALIBRATION_EVAL'
    elif i in DEFER_IDS or any(k in q for k in ['outside current master scope','outside current spec','future scope']) and 'defer' in q:
        cat='DEFERRED_BOUNDARY'
    elif i in UX_IDS:
        cat='PRODUCT_UX_POLICY'
    elif i in ARCH_CONTRACT_IDS:
        cat='ARCHITECTURE_CONTRACT'
    elif any(k in q for k in ['schema','enum','persistence','versioning','storage','provider','retention','implementation','engineering','adapter','field-level','data model','status','formula registry','ci ','oauth','encryption','backup','mapping','duplicate','structured output']):
        cat='ENGINEERING_SPEC'
    else:
        cat='PRODUCT_UX_POLICY'
    if cat=='ACP_REQUIRED' or i in P0_IDS: pr='P0'
    elif cat in {'ARCHITECTURE_CONTRACT','ENGINEERING_SPEC'}: pr='P1'
    else: pr='P2'
    return cat,pr

out=[]
for r in rows:
    cat,pr=classify(r)
    x=dict(r); x['disposition']=cat; x['priority']=pr; x['target']=target_for(int(r['id']),cat,r['question'],r['domain']); out.append(x)

with OUT_CSV.open('w',newline='',encoding='utf-8') as fp:
    w=csv.DictWriter(fp,fieldnames=['id','domain','feature','question','disposition','priority','target'])
    w.writeheader(); w.writerows(out)

counts=collections.Counter(x['disposition'] for x in out)
prio=collections.Counter(x['priority'] for x in out)
lines=['# Artist OS — Architecture Gap Classification Pass 1','',
       '**Status:** Working classification for resolution; no MASTER changes are implied.','',
       f'**Questions classified:** {len(out)}.','',
       '## 1. Disposition model','',
       '- `ACP_REQUIRED` — resolving the question changes or extends the canonical architecture and must go through an Architecture Change Proposal before entering MASTER.',
       '- `ARCHITECTURE_CONTRACT` — cross-domain ownership/cardinality/precedence semantics can be frozen in companion architecture/ADR without changing MASTER unless later implementation proves otherwise.',
       '- `ENGINEERING_SPEC` — schema details, enums, persistence, provider contracts, retention or implementation choices belong to Engineering Specification/Data Model Reference.',
       '- `PRODUCT_UX_POLICY` — product defaults/interactions that should be prototyped/configured rather than frozen architecturally.',
       '- `CALIBRATION_EVAL` — thresholds, sample sizes, weights, confidence or model behavior requiring evidence/evals.',
       '- `DEFERRED_BOUNDARY` — deliberately outside current v1.3 scope or reserved for a future bounded context.',
       '', '## 2. Counts','',
       '| Disposition | Count |','|---|---:|']
for k in ['ACP_REQUIRED','ARCHITECTURE_CONTRACT','ENGINEERING_SPEC','PRODUCT_UX_POLICY','CALIBRATION_EVAL','DEFERRED_BOUNDARY']:
    lines.append(f'| {k} | {counts[k]} |')
lines += ['', '| Priority | Count |','|---|---:|']
for k in ['P0','P1','P2']: lines.append(f'| {k} | {prio[k]} |')
lines += ['', '## 3. Full classification','',
          '| # | Priority | Disposition | Domain / Feature | Question | Resolution target |',
          '|---:|---|---|---|---|---|']
for x in out:
    q=x['question'].replace('|','\\|'); target=x['target'].replace('|','\\|')
    lines.append(f"| {x['id']} | **{x['priority']}** | `{x['disposition']}` | `{x['domain']}/{x['feature']}` | {q} | {target} |")
OUT_MD.write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('counts',dict(counts),'prio',dict(prio))
print('wrote',OUT_MD)
