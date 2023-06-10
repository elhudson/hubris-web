from itertools import chain
import os
from dotenv import load_dotenv
import pandas as pd
import sqlalchemy as sqa
import json
from tools import get_schema, get_tables, NpEncoder, parse_name, get_configs
from ruleset import all_in_table
load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")

db_path=f"sqlite:///{os.getenv('DB_PATH')}"
engine=sqa.create_engine(db_path)
con=engine.connect()

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
    
def requirements_to_JSON(con):
    cfg=get_configs()
    for r in cfg['HAS_PREREQS']:
        name=parse_name(r)
        content=load_requirements_list(name,con)
        file=open(os.getenv('ROOT_PATH')+f"/web/static/requirements/{name}.json","w")
        json.dump(content,file,cls=NpEncoder)
    for pair in cfg["MANY_TO_MANY"]:
        content=load_many_list(pair,con)
        file=open(os.getenv('ROOT_PATH')+f"/web/static/requirements/__{parse_name(pair[0])}__{parse_name(pair[1])}.json","w")
        json.dump(content,file,cls=NpEncoder)

for t in ["skills","classes","backgrounds"]:
    r=load_singles_list(t,con)
    file=open(os.getenv('ROOT_PATH')+f"/web/static/requirements/{t}.json","w")
    json.dump(r,file,cls=NpEncoder)