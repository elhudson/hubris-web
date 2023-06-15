import os
import sqlalchemy as sqa
import pandas as pd
from itertools import chain
from srd.entry import create_entry
from srd.tools import get_tables, CharacterEncoder
import json

def all_in_table(table_name, con):
    query=sqa.text(f'''SELECT id FROM {table_name}''')
    entries=[]
    result=pd.read_sql(query,con)
    ids=[id[0] for id in result.values]
    for id in ids:
        entry=create_entry(table_name,id,con)
        if entry!=None:
            entry.build_extensions(con)
            if table_name=="backgrounds":
                entry.split_feat()
            entries.append(entry)
    return entries

def fetch_metadata(con):
    meta={}
    trees=("Buffs","Debuffs","Damage/Healing")
    for tree in trees:
        meta[tree]={"ranges":[],"durations":[]}
        range_ids=list(chain(*pd.read_sql(sqa.text(f'''SELECT id FROM ranges WHERE tree='{tree}' and tier='T1' '''),con).values.tolist()))
        duration_ids=list(chain(*pd.read_sql(sqa.text(f'''SELECT id FROM durations WHERE tree='{tree}' and tier='T1' '''),con).values.tolist()))
        for r in range_ids:
            e=create_entry("ranges",r,con)
            meta[tree]["ranges"].append(e.to_dict())
        for d in duration_ids:
            e=create_entry("durations",d,con)
            meta[tree]["durations"].append(e.to_dict())
    return json.dumps(meta,cls=CharacterEncoder)