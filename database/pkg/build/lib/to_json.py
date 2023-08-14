from itertools import chain
import os
import pandas as pd
import sqlalchemy as sqa
import json
from srd.entry import EntryEncoder
from srd.tools import get_schema, get_tables, parse_name, get_configs
from srd.ruleset import all_in_table
db_path=f"sqlite:////home/el_hudson/projects/hubris-database/HUBRIS.db"
engine=sqa.create_engine(db_path)
con=engine.connect()
home='/home/el_hudson/projects'
def get_names(con):
    return list(chain(*pd.read_sql(sqa.text("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '%users%' AND name NOT LIKE '%characters%'"),con).values.tolist()))

def get_leftovers(con):
    names=get_names(con)
    handled=list(chain(*get_configs('/home/el_hudson/projects').values()))[3:]
    return [n for n in names if "__" not in n and n not in [h.lower() for h in handled]]

def load_requirements_list(table_name,con):
    table=all_in_table(table_name,con)
    new_dict={}
    for entry in table:
        new_dict[entry.id]={}
        new_dict[entry.id]=entry.to_dict()
        new_dict[entry.id]["required_for"]=[s.to_dict() for s in entry.required_for]
        new_dict[entry.id]["requires"]=[s.to_dict() for s in entry.requires]
    return new_dict

def load_singles_list(table_name,con):
    table=all_in_table(table_name,con)
    new_dict={}
    for entry in table:
        new_dict[entry.id]={}
        new_dict[entry.id]=entry.to_dict()
    return new_dict

def load_many_list(pair,con):
    table=all_in_table(parse_name(pair[0]),con)
    new={}
    for entry in table:
        new[entry.id]={}
        new[entry.id][parse_name(pair[0])]=entry.to_dict()
        new[entry.id][parse_name(pair[1])]=[s.to_dict() for s in getattr(entry,parse_name(pair[1]))]
    return new
    
def requirements_to_JSON(con,homedir=home):
    ruleset={}
    cfg=get_configs(homedir)
    l=get_leftovers(con)
    for left in l:
        ruleset[left]=load_singles_list(left,con)
    for r in cfg['HAS_PREREQS']:
        name=parse_name(r)
        ruleset[name]=load_requirements_list(name,con)
    for pair in cfg["MANY_TO_MANY"]:
        ruleset[f'__{parse_name(pair[0])}__{parse_name(pair[1])}']=load_many_list(pair,con)
    json.dump(ruleset,open(f'{homedir}/HUBRIS/static/ruleset.json','w+'),cls=EntryEncoder)
