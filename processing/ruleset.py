from dotenv import load_dotenv
import os
import sqlalchemy as sqa
import pandas as pd
from entry import create_entry
from tools import get_tables

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
        entry.build_extensions(con)
        if table_name=="backgrounds":
            entry.split_feat()
        entries.append(entry)
    return entries

def fetch_default_metadata(con):
    defaults={"ranges":[],"durations":[]}
    durations=("1c64e76f-50c5-40d9-b288-dbd64371424e","a24050bd-f49e-465c-ad8a-5c88058560ef","c80558ea-f638-4932-a4ef-b46236b7b7e3")
    ranges=("3650c807-9e1b-4dde-8dac-3de8b4b88266","5c65b682-bebe-4028-a995-f9a76527e3b5","ca11cc47-323e-4fd4-8ff6-df21d54e4684")
    for i in range(len(durations)):
        defaults["ranges"].append(create_entry("ranges",ranges[i],con))
        defaults["durations"].append(create_entry("durations"),durations[i],con)
    return defaults

