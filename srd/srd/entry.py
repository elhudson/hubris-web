from itertools import chain
import os
from dotenv import load_dotenv

import pandas as pd
import sqlalchemy as sqa
from srd.tools import get_schema, get_tables

class Entry:
    def __init__(self,table=None,id=None,con=None):
        self.table=table
        self.id=id
        if con!=None:
            self.build_core(con)
        if table in ("classes","class_paths","tags","backgrounds","skills","attributes", "effects"):
            self.load_icon()
    
    def has_prerequisites(self,con):
        if self.tier!="T1":
            return True
        query=sqa.text(f"SELECT {self.table} FROM __{self.table}__requires WHERE {self.table}='{self.id}'")
        if pd.read_sql(query,con).empty==True:
            return False
        else:
            return True

    def load_icon(self):
        if type(self)==Effect:
            l="tree__"+self.tree.lower()+".svg"
        else:
            l=f"{self.table}__"+self.name.lower().replace(" ","_")+".svg"
        path=os.getenv("PWD")+f"/icons/{l}"
        self.icon=open(path,"r").read()

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

    def build_extensions(self,con):
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
            if type(entry)==list and len(entry)>0:
                e=[]
                for i in range(len(entry)):
                    e.append(entry[i].to_dict())
                base[item]=e
        return base

        
def create_entry(table=None,id=None,con=None):
    if table=="classes":
        return Class("classes",id,con)
    if table=="class_features":
        return ClassFeature("class_features",id,con)
    if table=="tags":
        return Tag("tags",id,con)
    if table=="tag_features":
        return TagFeature("tag_features",id,con)
    if table=="backgrounds":
        return Background("backgrounds",id,con)
    if table=="effects":
        e=Effect("effects",id,con)
        e.default_metadata(con)
        return e
    if table=="durations":
        return Duration("durations",id,con)
    if table=="ranges":
        return Range("ranges",id,con)
    if table=="class_paths":
        return ClassPath("class_paths",id,con)
    if table=="attributes":
        return Attribute("attributes",id,con)
    if table=="skills":
        return Skill("skills",id,con)

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
            
class Background(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)
        self.split_feat()
    def split_feat(self):
        self.feature_name=self.feature.split(":")[0]
        self.feature_desc=self.feature.split(":")[1]

class ClassFeature(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)

class Skill(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)

class Effect(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)
    def default_metadata(self,con):
        if self.tree=="Damage" or self.tree=="Healing":
            tree="Damage/Healing"
        else:
            tree=self.tree
        range_id=pd.read_sql(sqa.text(f"SELECT id FROM ranges WHERE xp=1 AND tree='{tree}'"),con).values.tolist()[0][0]
        duration_id=pd.read_sql(sqa.text(f"SELECT id FROM durations WHERE xp=1 AND tree='{tree}'"),con).values.tolist()[0][0]
        self.range=create_entry("ranges",range_id,con)
        self.duration=create_entry("durations",duration_id,con)

class Duration(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)

class Range(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)

class Tag(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)
        

class TagFeature(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)

class Attribute(Entry):
    def _init__(self,table,id,con):
        super().__init__(table,id,con)

class ClassPath(Entry):
    def __init__(self,table,id,con):
        super().__init__(table,id,con)
