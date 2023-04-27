from dotenv import load_dotenv
import os
import sqlalchemy as sqa
import pandas as pd
from db import create_entry, get_tables

load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")

db_path=f"sqlite:///{os.getenv('DB_PATH')}"
engine=sqa.create_engine(db_path)
con=engine.connect()
all_tables=get_tables(con)
tables=[table for table in all_tables if "__" not in table and "characters" not in table]

def all_in_table(table_name, con):
    query=sqa.text(f'''SELECT id FROM {table_name}''')
    entries=[]
    result=pd.read_sql(query,con)
    ids=[id[0] for id in result.values]
    for id in ids:
        entry=create_entry(table_name,id,con)
        entry.build_single_relations(con)
        entry.build_plural_relations(con)
        entries.append(entry)
    return entries