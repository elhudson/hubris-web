from itertools import chain
import os
from dotenv import load_dotenv

import pandas as pd
import sqlalchemy as sqa
from tools import get_schema, get_tables
load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")


class Entry:
    def __init__(self,table=None,id=None,con=None):
        self.table=table
        self.id=id
        if con!=None:
            self.build_core(con)

    def load_icon(self):
        l=self.name.lower().replace(" ","_")
        path=os.getenv("ROOT_PATH")+f"/icons/{self.table}__{l}.svg"
        self.icon=open(path,"r")

    def query(self,con):
        sql=sqa.text(f'''SELECT * FROM {self.table} WHERE id='{self.id}' ''')
        result=pd.read_sql(sql,con)
        return result
    
    def build_core(self,con):
        r=self.query(con)
        self.relate={}
        for field in r.columns:
            if len(r[field])>0:
                if field!="id":
                    val=r[field][0]
                    if "name" in field:
                        self.name=val
                    elif isinstance(val,str):
                        if val.count("-")==4:
                                self.relate[field]=val
                        else:
                            setattr(self,field,val)
                    else:
                        setattr(self,field,val)

    def build_extensions(self,con,icons=False):
        self.build_single_relations(con)
        self.build_plural_relations(con)
        self.build_other_relations(con)

    def build_single_relations(self,con):
        if hasattr(self,"relate"):
            for table in self.relate.keys():
                setattr(self,table,create_entry(table,self.relate[table],con))

    def build_plural_relations(self,con):
        tables=get_tables(con)
        targets=[t for t in tables if self.table in t and "characters" not in t and "__" in t]
        for t in targets:
            col_name=t.replace(self.table,"").replace("__","",2)
            sql=sqa.text(f"SELECT {col_name} FROM {t} WHERE {self.table}='{self.id}'")
            ids=list(chain(*pd.read_sql(sql,con).values))
            entries=[]
            for id in ids:
                if "require" in col_name:
                    e=create_entry(self.table,id,con)
                else:
                    e=create_entry(col_name,id,con)
                entries.append(e)
            setattr(self,col_name,entries)    

    def build_other_relations(self,con):
        targets=[]
        schema=get_schema(con)
        for k in schema.keys():
            if self.table in schema[k]:
                targets.append(k)
        for t in targets:
            ids=list(chain(*pd.read_sql(sqa.text(f"SELECT id FROM {t} WHERE {self.table}='{self.id}'"),con).values))
            features=[]
            for id in ids:
                features.append(create_entry(t,id,con))
            setattr(self,t,features)    
            

    def to_dict(self):
        base= self.__dict__.copy()
        for item in self.__dict__:
            entry=getattr(self,item)
            if entry.__class__==Entry or entry.__class__ in Entry.__subclasses__():
                base[item]=entry.to_dict()
            if type(entry)==list:
                e=[]
                for i in range(len(entry)):
                    e.append(entry[i].to_dict())
                base[item]=e
        return base

        
def create_entry(table=None,id=None,con=None):
    if table=="classes":
        return Class(table,id,con)
    if table=="class_features":
        return ClassFeature(table,id,con)
    if table=="tags":
        return Tag(table,id,con)
    if table=="tag_features":
        return TagFeature(table,id,con)
    if table=="backgrounds":
        return Background(table,id,con)
    if table=="effects":
        return Effect(table,id,con)
    if table=="durations":
        return Duration(table,id,con)
    if table=="ranges":
        return Range(table,id,con)
    else:
        return Entry(table,id,con)

class Class(Entry):
    def __init__(self,table,id,con):
        super().__init__(table,id,con)
        self.define_hd()
    def define_hd(self):
        if self.name=="Barbarian":
            self.hit_die="2d4"
        if self.name in ["Sharpshooter","Knight","Fighter"]:
            self.hit_die="d6"
        if self.name in ["Rogue","Priest"]:
            self.hit_die="d4"
        if self.name in ["Elementalist","Beguiler"]:
            self.hit_die="d3"
        if self.name=="Wizard":
            self.hit_die="d2"

class Skill(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Background(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)
        self.split_feat()
    def split_feat(self):
        self.feature_name=self.feature.split(":")[0]
        self.feature_desc=self.feature.split(":")[1]

class ClassFeature(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Effect(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Duration(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Range(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Tag(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class TagFeature(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Attribute(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

