import pandas as pd
from notion_client import Client
import json
import requests
import sqlalchemy as sqa
from itertools import chain
import os
from db_connect import connect

engine=connect()

with open("db_config.json") as config_file:
    configs=json.load(config_file)

notion=Client(auth=configs['NOTION_TOKEN'])

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

    def write_tables(self,con):
        for item in self.__dict__:
            if item not in ("configs","id"):
                table=self.__getattribute__(item)
                table.to_sql(item,con,if_exists="replace",index=False)
                print(f'Table {item} written to database.')
                
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
        return self.format_dataframe(fr,table.title)

    def format_dataframe(self,frame,title):
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
        if "requires" in frame.columns and "requires" not in title:
            frame=frame.drop(columns="requires")
        if "required_for" in frame.columns and "required_for" not in title:
            frame=frame.drop(columns="required_for")
        return frame
        
    def get_suspicious_columns(self,frame):
        lists=[]
        for i in range(len(frame.values[0])):
            if type(frame.values[0][i])==list:
                lists.append(frame.columns[i])
        return lists
    
    def from_sql(self, tbl_name,con):
        with con.connect() as c:
            ext=pd.read_sql(sqa.text(f'''SELECT * FROM {tbl_name}'''),c)
            c.close()
        return ext
    
    def is_updated(self,title,table,con):
        extant=self.from_sql(title,con)
        if extant.compare(table) and extant.columns==table.columns:
            return True
        else:
            return False
    
    def table_names(self,con):
        with con.connect() as c:
            tabls=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),c).values.tolist()
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
            title=property["title"][0]["text"]["content"]
            # if page["icon"]!=None:
            #     self.save_icon(page,title)
            return title
        if property["type"]=="relation":
            r=[p["id"] for p in property["relation"]]
            return r
        if property["type"]=="rich_text":
            if len(property["rich_text"])>0:
                return property["rich_text"][0]["plain_text"]
        if property["type"]=="select":
            if property["select"]==None:
                return property["select"]
            else:
                return property["select"]["name"]
        if property["type"]=="number":
            return property["number"]
        
    # def save_icon(self,page,title):
    #     url=page["icon"]["file"]["url"]
    #     t=title.lower().replace(" ","_")
    #     loc=self.title.lower().replace(" ","_")
    #     path=configs['ICON_PATH']+f"/{loc}__{t}.svg"
    #     bytes=requests.get(url)
    #     if "svg" in str(bytes._content):
    #         file=open(path,"wb")
    #         file.write(bytes._content)
    #         file.close()
            
class Entry:
    def __init__(self,id):
        self.id=id

class RequirementTable:
    def __init__(self,parent,rel,table):
        self.parent=parent
        self.relation=rel
        self.title=self.define_title(parent,rel)
        self.data=self.get_data(table)

    def get_data(self,table):
        rows=[]
        for entry in table.data:
            elem=entry.__dict__[self.relation]
            for e in elem:
                row={}
                row[self.parent]=entry.id
                row[self.relation]=e
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
                    row[pair[0]]=prop_id
                    row[pair[1]]=item
                    rows.append(row)
        return rows

    def define_title(self,pair):
        s="__"
        return s+s.join(pair).lower()
    
    
notion=Client(auth=configs['NOTION_TOKEN'])

hubris=Database(configs['NOTION_DB'],configs)
hubris.populate(notion)
hubris.sqlify()
hubris.write_tables(engine)