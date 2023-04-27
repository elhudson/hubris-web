import sqlite3
import sqlalchemy as sqa
import pandas as pd
from itertools import chain
import os
from dump import NpEncoder
import json
from dotenv import load_dotenv

load_dotenv(dotenv_path="/home/el_hudson/projects/HUBRIS/sticky_note.env")

engine=sqa.create_engine(f"sqlite:///{os.getenv('DB_PATH')}")
con=engine.connect()
name="Archie Radcliffe"

class Character:
    def __init__(self,char_name,con):
        self.name=char_name
        self.basic_info(con)
        self.set_tier()
        self.attributes(con)
        self.designate_tag()
    
    def __repr__(self):
        return self.to_JSON()
    
    def designate_tag(self):
        for e in self.effects:
            e.tag=self.get_tag_overlap(e)

    def get_tag_overlap(self,effect):
        char_tags=[getattr(item,"title") for item in self.classes[0].tags]
        char_tags.append("Agility")
        char_tags.append("Conjuration")
        char_tags.append("Abjuration")
        effect_tags=[str.capitalize(getattr(item,"title")) for item in effect.tags]
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
        sql=sqa.text(f'''SELECT id, str, dex, con, int, wis, cha, xp_earned, xp_spent, alignment FROM characters WHERE name='{self.name}' ''') 
        r=pd.read_sql(sql,con)
        self.id=r["id"][0]
        self.str=r["str"][0]
        self.dex=r["dex"][0]
        self.con=r["con"][0]
        self.int=r["int"][0]
        self.wis=r["wis"][0]
        self.cha=r["cha"][0]
        self.xp_earned=int(r["xp_earned"][0])
        self.xp_spent=int(r["xp_spent"][0])
        self.alignment=r["alignment"][0]

    def attributes(self,con):
        res=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values
        names=[names[0] for names in res if "__characters" in names[0]]
        r={}
        for name in names:
            prop_name=name[14::]
            q=sqa.text(f'''SELECT {prop_name}_id FROM {name} WHERE character_id='{self.id}' ''')
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
                if entry.is_independent(con)==False:
                    entry.build_pre_and_postreqs(con)
                    entry.build_pre_and_postreqs(con,type="post")
                abilities.append(entry)
            setattr(self,table,abilities)
    
    def to_JSON(self,out=False,fp=None):
        base= self.__dict__.copy()
        for item in self.__dict__:
            entry=getattr(self,item)
            if type(entry)==list:
                e={}
                for i in range(len(entry)):
                    e[i]=entry[i].to_JSON()
                base[item]=e
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
    def __init__(self,table,id,con):
        self.table=table
        self.id=id
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
                    if isinstance(val,str):
                        if val.count("-")==4:
                            self.relate[field]=val
                        else:
                            setattr(self,field,val)
                    else:
                        setattr(self,field,val)

    def build_single_relations(self,con):
        for table in self.relate.keys():
            if table!="requires" and table!="required_for":
                setattr(self,table,create_entry(table,self.relate[table],con))

    def build_plural_relations(self,con):
        tables=get_tables(con)
        ts=[]
        for table in tables:
            if "__" in table and "characters" not in table and self.table in table and "require" not in table:
                ts.append(table)
        for tabl in ts:
            rs=[]
            q=sqa.text(f'''SELECT * FROM {tabl} WHERE {self.table}='{self.id}' ''')
            res=pd.read_sql(q,con)
            rel_name=[item for item in res.columns if self.table not in item and "index" not in item][0]
            res=res.drop(columns=[f"{self.table}","index"]).values.tolist()
            res=list(chain(*res))
            for r in res:
                rs.append(create_entry(rel_name,r,con))
            setattr(self,rel_name,rs)
            res=None
    
    def is_independent(self,con):
        t=get_tables(con)
        rs=[]
        for r in self.relate:
            l={r,self.table}
            rs.append(l)
        rel_tables=[item for item in t if "__" in item and "characters" not in item]
        if "requires" not in self.__dict__.keys() and "required_for" not in self.__dict__.keys():
            for table in rel_tables:
                for pair in rs:
                    if list(pair)[0] in table and list(pair)[1] in table:
                        return False
        return True

    def build_pre_and_postreqs(self,con,type="pre"):
        tables=get_tables(con)
        if type=="pre":
            pre_reqs=[]
            pre=self.locate_pre_and_postreqs(tables)[0]
            if self.is_table(pre):
                pre_query=f'''SELECT requires FROM {pre} WHERE {self.table}= '{self.id[0]}' '''
                table=pre
            else:
                pre_query=f'''SELECT id FROM {self.table} WHERE {pre}='{self.id[0]}' '''
                table=self.table
            pre_res=pd.read_sql(sqa.text(pre_query),con).values.tolist()
            for r in pre_res:
                pre_reqs.append(create_entry(table,r,con))
            setattr(self,"requires",pre_reqs)
        if type=="post":
            post_reqs=[]
            post=self.locate_pre_and_postreqs(tables)[1]
            if self.is_table(post):
                post_query=f'''SELECT required_for FROM {post} WHERE {self.table}='{self.id[0]}' '''
                table=post
            else:
                post_query=f'''SELECT id FROM {self.table} WHERE {post}='{self.id[0]}' '''
                table=self.table
            post_res=pd.read_sql(sqa.text(post_query),con).values.tolist()
            for r in post_res:
                post_reqs.append(create_entry(table,r,con))
            setattr(self,"required_for",post_reqs)
        
    def locate_pre_and_postreqs(self,tables):
        pre_tables=[item for item in tables if "requires" in item]
        post_tables=[item for item in tables if "required_for" in item]
        pre="requires"
        post="required_for"
        for item in pre_tables:
            if self.table in item:
                pre=item
                break
        for item in post_tables:
            if self.table in item:
                post=item
                break
        return (pre,post)
    
    def is_table(self,req):
        if "__" in req:
            return True
        else:
            return False        
    
    def to_JSON(self):
        base= self.__dict__.copy()
        for item in self.__dict__:
            entry=getattr(self,item)
            if entry.__class__==Entry or entry.__class__ in Entry.__subclasses__():
                base[item]=entry.to_JSON()
            if type(entry)==list:
                e={}
                for i in range(len(entry)):
                    e[i]=entry[i].to_JSON()
                base[item]=e
        return base

def get_tables(con):
    tables=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values.tolist()
    return list(chain(*tables))
        
def create_entry(table,id,con):
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
        if self.title=="Barbarian":
            self.hit_die="2d4"
        if self.title in ["Sharpshooter","Knight","Fighter"]:
            self.hit_die="d6"
        if self.title in ["Rogue","Priest"]:
            self.hit_die="d4"
        if self.title in ["Elementalist","Beguiler"]:
            self.hit_die="d3"
        if self.title=="Wizard":
            self.hit_die="d2"

class Skill(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)

class Background(Entry):
    def _init__(self,id,con):
        super().__init__(id,con)
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