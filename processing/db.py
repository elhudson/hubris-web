import sqlalchemy as sqa
import pandas as pd
from itertools import chain
import uuid
import os
from dump import NpEncoder
import json
from dotenv import load_dotenv

load_dotenv(dotenv_path="/home/el_hudson/projects/HUBRIS/sticky_note.env")

engine=sqa.create_engine(f"sqlite:///{os.getenv('DB_PATH')}")
con=engine.connect()

def create_character(char_id,con):
    char=Character(char_id)
    if exists(char_id,con):
        char.basic_info(con)
        char.build_entries(con)
        char.xp_spent=char.count_xp()
        char.set_tier()
        char.designate_tag()
    return char

def deserialize_character(d):
    me=Character(d["id"])
    for item in d.keys():
        if type(d[item])==dict:
            down=deserialize_entry(d[item])
            setattr(me,down)
        elif type(d[item])==list:
            e=[]
            for i in range(len(d[item])):
                e.append(deserialize_entry(d[item][i]))
            setattr(me,item,e)
        else:
            setattr(me,item,d[item])
    return me

def deserialize_entry(d):
    me=Entry()
    for item in d.keys():
        if type(d[item])==dict:
            down=deserialize_entry(d[item])
            setattr(me,item,down)
        elif type(d[item])==list:
            e=[]
            for i in range(len(d[item])):
                e.append(deserialize_entry(d[item][i]))
            setattr(me,item,e)
        else:
            setattr(me,item,d[item])
    return me

def exists(char_id,con):
    sql=sqa.text(f'''SELECT name, str, dex, con, int, wis, cha, xp_earned, xp_spent, alignment FROM characters WHERE id="{char_id}" ''') 
    r=pd.read_sql(sql,con)
    if r.empty:
        return False
    else:
        return True

class Character:
    def __init__(self,char_id):
        self.id=char_id
        self.name=None
        self.str=None
        self.dex=None
        self.con=None
        self.int=None
        self.wis=None
        self.cha=None
        self.xp_earned=None
        self.xp_spent=None
        self.alignment=None
    
    def count_xp(self):
        features=[]
        for k in self.__dict__.keys():
            if type(getattr(self,k))==list:
                features.append(k)
        xp=0
        for f in features:
            items=getattr(self,f)
            for item in items:
                if hasattr(item,"xp"):
                    xp+=item.xp
        return xp

    def designate_tag(self):
        for e in self.effects:
            e.tag=self.get_tag_overlap(e)

    def get_tag_overlap(self,effect):
        char_tags=[getattr(item,"name") for item in self.classes[0].tags]
        effect_tags=[str.capitalize(getattr(item,"name")) for item in effect.tags]
        for i in char_tags:
            if i in effect_tags:
                return i
            
    def set_tier(self):
        if self.xp_spent<25:
            self.tier=1
        if 25<=self.xp_spent<75:
            self.tier=2
        if 75<=self.xp_spent<150:
            self.tier=3
        if 150<=self.xp_spent:
            self.tier=4

    def basic_info(self,con):
        sql=sqa.text(f'''SELECT name, str, dex, con, int, wis, cha, xp_earned, xp_spent, alignment FROM characters WHERE id='{self.id}' ''') 
        r=pd.read_sql(sql,con)
        self.name=r["name"][0]
        self.str=r["str"][0]
        self.dex=r["dex"][0]
        self.con=r["con"][0]
        self.int=r["int"][0]
        self.wis=r["wis"][0]
        self.cha=r["cha"][0]
        self.xp_earned=int(r["xp_earned"][0])
        self.xp_spent=int(r["xp_spent"][0])
        self.alignment=r["alignment"][0]

    def build_entries(self,con):
        res=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values
        names=[names[0] for names in res if "__characters" in names[0]]
        r={}
        for name in names:
            prop_name=name[14::]
            q=sqa.text(f'''SELECT {prop_name}_id FROM {name} WHERE char_id='{self.id}' ''')
            res=pd.read_sql(q,con)
            l=res.values.tolist()
            l=frozenset(list(chain(*l)))
            r[prop_name]=l
        for table in r.keys():
            ids=r[table]
            abilities=[]
            for id in ids:
                entry=create_entry(table,id,con)
                entry.build_single_relations(con)
                entry.build_plural_relations(con)
                abilities.append(entry)
            setattr(self,table,abilities)

    def add_entry(self,con,id,table):
        if hasattr(self,table)==False:
            setattr(self,table,[])
        getattr(self,table).append(create_entry(table,id,con))

    def to_dict(self):
        base= self.__dict__.copy()
        for item in self.__dict__:
            entry=getattr(self,item)
            if type(entry)==dict:
                base[item]=entry
            if type(entry)==list:
                e=[]
                for i in range(len(entry)):
                    e.append(entry[i].to_dict())
                base[item]=e
        return base

    def to_JSON(self,base,out=False,fp=None):
        if out==True:
            json.dump(base,fp=fp,cls=NpEncoder,separators=(",",":"),indent=None)
        else:
            return json.dumps(base,cls=NpEncoder,separators=(",",":"),indent=None)
    
    def to_file(self):
        file_name=self.name.replace(" ","_").lower()
        char_path=os.getenv("CHAR_PATH")+f"/{file_name}.json"
        f=open(char_path,"w")
        return self.to_JSON(out=True,fp=f)

    def from_file(self):
        char_filename=str.lower(self.name.replace(" ","_"))
        char_path=os.getenv("CHAR_PATH")+f'/{char_filename}.json'
        with open(char_path) as f:
            char=json.load(f)
        return char

    def write_to_database(self,j,con):
        res=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values
        names=[names[0] for names in res if "__characters" in names[0]]
        d={}
        for item in j.keys():
            if type(j[item])==dict:
                l=[]
                sub1=j[item]
                for p in sub1.keys():
                    l.append(json.loads(sub1[p])["id"])
                d[item]=l
        queries={}
        for targ in d.keys():
            for t in names:
                if targ in t:
                    l=[]
                    for item in d[targ]:
                        l.append((self.id,item))
                    queries[t]=l
        for q in queries.keys():
            prop_name=q.replace("__characters__","")+"_id"
            for pair in queries[q]:
                sql=sqa.text(f'''INSERT INTO {q} (character_id, {prop_name}) VALUES('{pair[0]}','{pair[1]}') WHERE NOT EXISTS(SELECT (character_id, {prop_name} FROM {q}))''')
                con.execute(sql)
                con.commit()

class Entry:
    def __init__(self,table=None,id=None,con=None):
        self.table=table
        self.id=id
        if con!=None:
            self.build_core(con)

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

    def build_single_relations(self,con):
        for table in self.relate.keys():
            setattr(self,table,create_entry(table,self.relate[table],con))
        del self.relate

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

def get_tables(con):
    tables=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values.tolist()
    return list(chain(*tables))
        
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
        Entry.__init__(table="backgrounds",id=id,con=con)
        print("HEY")
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

