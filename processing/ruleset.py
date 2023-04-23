from processing.db import find_source,generate_abilities,get_tables,fetch_by_id,feature,pcclass,skill_proficiency,duration,rng,background,tag_feature,class_feature,effect,power
import pandas as pd
import itertools
import sqlite3

path="/storage/HUBRIS.db"
con=sqlite3.Connection(path)

tables=get_tables(con,'prop')
id_lists=[]
for table in tables:
    sql=f'''SELECT id FROM {table}'''
    res=pd.read_sql(sql,con)
    id_lists.append(res)

id_tables={}

for i in range(len(tables)):
    id_tables[tables[i]]=id_lists[i]

big_list_of_ids=[]

for table in id_tables.keys():
    ids=id_tables[table]
    for id in ids.values:
        big_list_of_ids.append(id[0])

a=generate_abilities(big_list_of_ids,con)