import nopy
import pandas as pd
from key_generator.key_generator import generate
from nopy import NotionClient
from sqlalchemy import create_engine
import sqlite3
import sqlalchemy as sqa
import httpx
from dotenv import load_dotenv
from itertools import chain
import os

ones=("backgrounds","class_features","skills")
manies=("attributes", "classes","attributes")
class Directory:
    def __init__(self):
        self.effects="3b66c0a5ff9a42aca5f47a262c62b27a"
        self.durations="1da81c78e7934c4ca2144477e5efcf8b"
        self.ranges="b46cefa2bf344557b2c5fd362d7eb7b9"
        self.class_features="4eaa6b73c3c84189943de75ed709d7eb"
        self.tag_features="04a91868699f4afc8c0280ff4ac1e3ad"
        self.classes="3df41ba0adef41da89da5873f4b7f7b0"
        self.backgrounds="367c52ae497f430b98ccc7716c8cae3f"
        self.skills="194cfc4a2a7e49c7a3bda3f7d65fd870"
        self.tags="c932f3aa6db54aa2a4efad6fd38a2c63"
        self.attributes="0c18e1f7462e45a0ba2a025e9d25184a"

class NotionLink:

    def __init__(self, token, directory):
        self.directory=directory
        self.con=NotionClient(token)
        
    def db(self,target):
        id=getattr(self.directory,target)
        return self.con.retrieve_db(id)
    
class Database:

    def __init__(self,token,directory):
        self.notion=NotionLink(token,directory)
        self.properties={}
        self.pivots={}
        self.fails=[]
        
    def generate_property_table(self,name,con):
        db=self.notion.db(name)
        table=PropertyTable(db)
        self.properties[table.name]=table
        self.pivots[table.name]=table.pivs
        self.output(table,con)
        
    def write_table(self,table,con):
        table.data.to_sql(table.name,con,if_exists="replace")
        print(f'Table {table.name} written to database.')
        
    def generate_properties(self,con,targets=None):
        if targets==None:
            targets=self.notion.directory.__dict__.keys()
        for t in targets:
            try:
                self.generate_property_table(t,con)
            except httpx.ReadTimeout:
                self.fails.append(t)
        self.handle_fails(con)
            
    def handle_fails(self,con):
        for fail in self.fails:
            for i in range(1000):
                try:
                    self.generate_property_table(fail,con)
                    break
                except:
                    pass
        
    def generate_relationships(self,con,targets=None):
        pairs=self.get_relationships()
        for pair in pairs:
            primary=list(pair)[0]
            secondary=list(pair)[1]
            if primary in self.properties.keys():
                parent=primary
                rel=secondary
            else:
                parent=secondary
                rel=primary
            pivot=PivotTable(parent,rel,self.properties[parent].from_notion)
            if len(pivot.data[pivot.data.columns[0]].values.tolist())!=len(set(pivot.data[pivot.data.columns[0]].values.tolist())):
                if len(pivot.data[pivot.data.columns[1]].values.tolist())!=len(set(pivot.data[pivot.data.columns[1]].values.tolist())):
                    self.output(pivot,con)
    
    def get_relationships(self):
        combs=[]
        for p in self.pivots:
            for piv in self.pivots[p]:
                c={}
                c[txt_processing(piv)]=txt_processing(p)
                rel=set(list(c.items())[0])
                if rel not in combs:
                    combs.append(rel)
        return combs

    def from_sql(self, tbl_name,con):
        with con.connect() as c:
            ext=pd.read_sql(sqa.text(f'''SELECT * FROM {tbl_name}'''),c)
            c.close()
        return ext
    
    def is_updated(self,table,con):
        extant=self.from_sql(table.name,con)
        if extant.equals(table.data):
            return False
        else:
            return True
    
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

    def drop_superfluous_pivots(self,con):
        tabls=self.table_names(con)
        drop=[]
        n=[frozenset(tab.split("__")[1::]) for tab in tabls if "__" in tab and "characters" not in tab]
        if len(n)!=len(set(n)):
            new=set([item for item in n if n.count(item)>1])
            for item in new:
                d="__"
                d+=d.join(list(item))
                drop.append(d)
            for title in drop:
                q=sqa.text(f"DROP TABLE {title}")
                try:
                    link.connect().execute(q)
                except sqlite3.OperationalError:
                    continue

class PropertyTable:

    def __init__(self,notion):
        self.notion=notion
        self.name=txt_processing(self.notion.title)
        self.data=self.read_db()
        self.from_notion=self.data.copy()
        self.related_to=self.define_relations()
        self.pivs=self.pivots() 
        self.sanitize_names()
        # self.drop_relations()

    def sanitize_names(self,ignore=["none"]):
        new_names=[]
        for f in self.data.columns:
            if f!="title" and f!="id" and f not in ignore:
                prop=self.notion.properties.get(f)
                if isinstance(prop,nopy.props.page_props.PRelation):
                    new_names.append("__"+txt_processing(f))
                else:
                    new_names.append(txt_processing(f))
            else:
                new_names.append(txt_processing(f))
        self.data.columns=new_names


    def drop_relations(self):
        reversed_pivs=[txt_processing(item) for item in self.pivs]
        for col in self.data.columns:
            if col in reversed_pivs:
                self.data=self.data.drop(col,axis=1)

    def define_db(self):  
        fields=['title','id']
        for p in self.notion.properties:
            fields.append(p.name)
        return fields
    
    def pivots(self):
        rels=[]
        for r in self.related_to:
            r_property=self.notion.properties.get(r).name
            for entry in self.notion.get_pages():
                if len(entry.properties.get(r_property).relations)>1:
                    rels.append(r)
                    break
        return rels
    
    def define_relations(self):
        relations=[]
        for p in self.notion.properties:
            if isinstance(p,nopy.props.db_props.DBRelation):
                relations.append(p.name)
        return relations   
            
    def read_db(self):
        fields=self.define_db()
        entries=[]
        for page in self.notion.get_pages():
            entry={}
            entry["title"]=page.title
            entry["id"]=page.id
            for i in range(2,len(fields)):
                field=fields[i]
                entry[field]=self.extract_data(page,field)
            entries.append(entry)
        data=pd.DataFrame.from_records(entries)
        data=data.reset_index(drop=True)
        return data
    
    def extract_data(self,page,property_name):
        property=page.properties.get(property_name)
        if isinstance(property,nopy.props.page_props.PSelect):
            if property.option==None:
                return None
            else:
                return property.option.name
        if isinstance(property,nopy.props.page_props.PNumber):
            return property.number
        if isinstance(property,nopy.props.page_props.PRelation):
            return list_processing(property.relations)
        if isinstance(property,nopy.props.page_props.PRichtext):
            if len(page.properties[property_name].rich_text)==0:
                return None
            else:
                all= [text.plain_text for text in property.rich_text]
                d=""
                return d.join(all)
 


def txt_processing(txt):
    return str.lower(txt).replace(" ","_")

def reverse_txt(txt):
    return str.title(txt.replace("_"," "))

def list_processing(l):
    delim=","
    return delim.join(l)

class PivotTable:

    def __init__(self,parent_table,parent_relationship,parent_db):
        self.parent_table=parent_table
        self.parent_relationship=parent_relationship
        self.data=self.gen_data(parent_db)
        self.name=self.define_name()
    
    def is_many_to_many(self,parent_db):
        if len(parent_db).columns==len(self.data.columns):
            return False

    
    def gen_data(self,parent_db):
        rows=[]
        parent_ids=parent_db["id"]
        rel_ids=parent_db[reverse_txt(self.parent_relationship)]
        for i in range(len(parent_ids)):
            rids=rel_ids[i].split(",")
            for rid in rids:
                row={}
                row[self.parent_table]=parent_ids[i]
                row[self.parent_relationship]=rid
                rows.append(row)
        fr=pd.DataFrame(rows)
        return fr
    
    def define_name(self):
        name="__"
        n=list(self.data.columns)
        n.sort()
        name+=name.join(n)
        return name
    
load_dotenv(dotenv_path="/home/el_hudson/Projects/HUBRIS-1/sticky_note.env")
token="secret_TrlevNz6r9aY0bTxYzu2ytLwSbkIkibkbTDUfpTCiHI"
link=create_engine(f"sqlite:///{os.getenv('DB_PATH')}")
map=Directory()

hubris=Database(token,map)

hubris.generate_properties(link)
hubris.generate_relationships(link)
hubris.drop_superfluous_pivots(link)