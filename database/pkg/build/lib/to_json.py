from itertools import chain
import os
import pandas as pd
import sqlalchemy as sqa
import json
from entry import EntryEncoder
from tools import get_schema, get_tables, parse_name
from ruleset import all_in_table
from db_connect import engine, tunnel

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
    
def rulesetify(cfg, con):
    ruleset={}
    for left in cfg['NO_PREREQS']:
        name=parse_name(left)
        ruleset[name]=load_singles_list(name,con)
    for r in cfg['HAS_PREREQS']:
        name=parse_name(r)
        ruleset[name]=load_requirements_list(name,con)
    json.dump(ruleset,open(f'{os.getcwd()}/ruleset.json','w+'),cls=EntryEncoder)
