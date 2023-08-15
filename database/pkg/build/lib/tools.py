import json
from itertools import chain

import pandas as pd
import sqlalchemy as sqa

import os
    
def parse_name(name):
    return name.lower().replace(' ','_')

def in_dev():
    if 'el_hudson' in os.path.expanduser('~'):
        return True
    else:
        return False
    
def parse_path(app):
    if 'el_hudson' in os.path.expanduser('~'):
        app.home=os.path.expanduser('~')+'/projects/HUBRIS'
    else:
        app.home=os.path.expanduser('~')+"/hubris-web"

def get_configs(home):
    return json.load(open(home+"/hubris-database/db_config.json"))

def get_tables(con):
    tables=pd.read_sql(sqa.text("SELECT table_name FROM INFORMATION_SCHEMA.tables WHERE table_schema='ehudson19$HUBRIS'"),con).values.tolist()
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
