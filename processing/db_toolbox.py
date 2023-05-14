import json
from itertools import chain

import numpy as np
import pandas as pd
import sqlalchemy as sqa


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)
    

def get_tables(con):
    tables=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values.tolist()
    return list(chain(*tables))

def get_schema(con):
    tables=get_tables(con)
    schema={}
    tables=[t for t in tables if "__" not in t and "characters" not in t]
    for table in tables:
        res=pd.read_sql(sqa.text(f"SELECT * FROM {table}"),con)
        schema[table]=[f for f in list(res.columns) if "name" not in f and "id" not in f]
    return schema

def has_prereqs(id,table,con):
    sql=sqa.text(f"SELECT requires FROM __{table}__requires WHERE {table}='{id}'")
    r=pd.read_sql(sql,con)
    if r.empty==True:
        return False
    else:
        return list(chain(*r.values))