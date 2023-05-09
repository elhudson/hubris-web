import pandas as pd
from notion_client import Client
import json
from sqlalchemy import create_engine
import sqlite3
import sqlalchemy as sqa
import httpx
from dotenv import load_dotenv
from itertools import chain
import os
from dotenv import load_dotenv

load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")
notion=Client(auth=os.getenv("NOTION_TOKEN"))
with open("db_config.json") as config_file:
    configs=json.load(config_file)

class Database:
    def __init__(self,id,configs):
        self.id=id
        self.configs=configs
    
    def populate(self,notion):
        self.property_tables=self.define_property_tables(notion)
        self.m2m_tables=self.define_many_to_many_tables(self.configs)
        self.requirement_tables=self.define_requirement_tables(self.configs)

    def sqlify(self):
        for item in list(self.__dict__.keys())[:]:
            if item!="id" and item!="configs":
                it=getattr(self,item)
                for k in it.keys():
                    frame=self.to_dataframe(it[k])
                    setattr(self,it[k].title,frame)
        self.cleanup()

    def cleanup(self):
        del self.property_tables
        del self.m2m_tables
        del self.requirement_tables

    def define_property_tables(self,notion):
        ts={}
        res=notion.blocks.children.list(self.id)["results"]
        l=[(r["id"],r[tuple(r.keys())[10]]["title"]) for r in res if r["type"]=="child_database"]
        for item in l:
            table=PropertyTable(item[0],notion,item[1])
            ts[item[1]]=table
        return ts

    def define_many_to_many_tables(self,configs):
        ts={}
        for pair in configs["MANY_TO_MANY"]:
            table=self.property_tables[pair[0]]
            t=BridgeTable(pair,table)
            ts[t.title]=t
        return ts

    def define_requirement_tables(self,configs):
        ts={}
        for tabl in configs["HAS_PREREQS"]:
            table=self.property_tables[tabl]
            prq_table=RequirementTable(tabl,"Requires",table)
            pst_table=RequirementTable(tabl,"Required For",table)
            ts[prq_table.title]=prq_table
            ts[pst_table.title]=pst_table
        return ts

    def to_dataframe(self,table):
        records=[]
        for item in table.data:
            if type(item)==dict:
                records.append(item)
            else:
                records.append(item.__dict__)
        fr=pd.DataFrame.from_records(records)
        return self.format_dataframe(fr)

    def format_dataframe(self,frame):
        frame.columns=[f.replace(" ","_").lower() for f in frame.columns]
        sus=self.get_suspicious_columns(frame)
        dels=[]
        for l in sus:
            for i in range(len(frame[l])):
                if len(frame[l][i])==1:
                    frame[l][i]=frame[l][i][0]
                elif len(frame[l][i])==0:
                    frame[l][i]=None
                elif len(frame[l][i])>1:
                    dels.append(l)
        frame=frame.drop(columns=dels)
        if "requires" in frame.columns:
            frame=frame.drop(columns="requires")
        if "required_for" in frame.columns:
            frame=frame.drop(columns="required_for")
        return frame
        
    def get_suspicious_columns(self,frame):
        lists=[]
        for i in range(len(frame.values[0])):
            if type(frame.values[0][i])==list:
                lists.append(frame.columns[i])
        return lists
    
    def write_table(self,table,con):
        table.data.to_sql(table.name,con,if_exists="replace")
        print(f'Table {table.name} written to database.')

    def from_sql(self, tbl_name,con):
        with con.connect() as c:
            ext=pd.read_sql(sqa.text(f'''SELECT * FROM {tbl_name}'''),c)
            c.close()
        return ext
    
    def is_updated(self,table,con):
        extant=self.from_sql(table.name,con)
        if extant.equals(table.data) and extant.columns==table.columns:
            return True
        else:
            return False
    
    def output(self,table,con):
        exists=self.table_names(con)
        if table.name not in exists or self.is_updated(table,con)==False:
            self.write_table(table,con)
        else:
            print(f'Table {table.name} is up to date.')
    
    def table_names(self,con):
        with con.connect() as c:
            tabls=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),c).values.tolist()
            c.close()
        tabls=list(chain(*tabls))
        return tabls

class PropertyTable:

    def __init__(self,id, notion,name):
        self.id=id
        self.title=name.replace(" ","_").lower()
        self.fields=self.parse_fields(id,notion)[0]
        self.related_to=self.parse_fields(id,notion)[1]
        self.data=self.read_db(id,self.fields,notion)
    
    def parse_fields(self,id,notion):
        res=notion.databases.query(id)
        rel_fields=[]
        spec_fields=res["results"][0]["properties"].keys()
        for s in spec_fields:
            if res["results"][0]["properties"][s]["type"]=="relation":
                rel_fields.append(s)
        return spec_fields, rel_fields
    
    def read_db(self,id,fields,notion):
            entries=[]
            for page in notion.databases.query(id)["results"]:
                e=Entry(page["id"])
                for field in fields:
                    data=self.extract_data(page,field)
                    e.__setattr__(field,data)
                entries.append(e)
            return entries
    
    def extract_data(self,page,field):
        property=page["properties"][field]
        if property["type"]=="title":
            return property["title"][0]["text"]["content"]
        if property["type"]=="relation":
            r=[p["id"] for p in property["relation"]]
            return r
        if property["type"]==["rich_text"]:
            s=""
            return property["rich_text"].join(s)
        if property["type"]==["plain_text"]:
            return property["plain_text"]
        if property["type"]=="select":
            return property["select"]["name"]
        if property["type"]=="number":
            return property["number"]
        
class Entry:
    def __init__(self,id):
        self.id=id

class RequirementTable:
    def __init__(self,parent,rel,table):
        self.parent=parent
        self.relation=rel
        self.data=self.get_data(table)
        self.title=self.define_title(parent,rel)

    def get_data(self,table):
        rows=[]
        for entry in table.data:
            elem=getattr(entry,self.relation)
            for e in elem:
                row={}
                row[entry.id]=e
                rows.append(row)
        return rows
    
    def define_title(self,parent,rel):
        pair=[parent,rel]
        s="__"
        return s+s.join(pair).lower().replace(" ","_")

class BridgeTable:
    def __init__(self,pair,table):
        self.data=self.get_data(pair,table)
        self.title=self.define_title(pair)
    
    def get_data(self,pair,table):
        rows=[]
        for entry in table.data:
            prop_id=entry.id
            rel_id=entry.__getattribute__(pair[1])
            if len(rel_id)>0:
                for item in rel_id:
                    row={}
                    row[item]=prop_id
                    rows.append(row)
        return rows

    def define_title(self,pair):
        s="__"
        return s+s.join(pair).lower()
    
    
load_dotenv(dotenv_path="/home/el_hudson/projects/HUBRIS/sticky_note.env")
token="secret_oPnTR8UwwPWeDeJReXH7rZwRb2ILunhXd35AQOn2xmY"
link=create_engine(f"sqlite:///{os.getenv('DB_PATH')}")
notion=Client(auth=token)
dbid="0e2c8717f10341a2a2d30f48eb2c6677"

hubris=Database(dbid,configs)
hubris.populate(notion)