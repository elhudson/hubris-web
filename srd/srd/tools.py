import json
from itertools import chain

import numpy as np
import pandas as pd
import sqlalchemy as sqa

import os
from uuid import UUID

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return obj.hex
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)
    
def parse_name(name):
    return name.lower().replace(' ','_')

def get_configs():
    return json.load(open(os.getenv("ROOT_PATH")+"/database/db_config.json"))

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

def find_table(id,con):
    tables=[t for t in get_tables(con) if "__" not in t and "characters" not in t]
    for table in tables:
        sql=sqa.text(f"SELECT id FROM {table} WHERE id='{id}'")
        if pd.read_sql(sql,con).empty==False:
            return table
        
