import json
import os
from itertools import chain

import pandas as pd
import sqlalchemy as sqa
from entry import Entry, create_entry

from db_toolbox import NpEncoder, has_prereqs

con=sqa.create_engine("sqlite:////home/el_hudson/projects/HUBRIS/database/HUBRIS.db").connect()
id="e5231255-5dbb-4d02-8133-fe23dcac6599"

def create_character(char_id,con):
    char=Character(char_id)
    if exists(char_id,con):
        char.basic_info(con)
        char.build_entries(con)
        char.xp_spent=char.count_xp()
        char.set_tier()
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
        features=self.fetch_attrs()
        xp=0
        for f in features:
            items=getattr(self,f)
            for item in items:
                if hasattr(item,"xp"):
                    xp+=item.xp
        return xp
    
    def fetch_attrs(self):
        features=[]
        for k in self.__dict__.keys():
            if type(getattr(self,k))==list:
                features.append(k)
        return features
    
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

    def fetch_fulfilled_prereqs(self,con):
        self.extend_entries(con)
        q={}
        for a in self.fetch_attrs():
            if len(getattr(self,a))>0:
                quals=[]
                for item in getattr(self,a):
                    if hasattr(item,"required_for"):
                        for it in item.required_for:
                            quals.append(it)
                if len(quals)>0:
                    q[a]=quals
        return q
    
    def fetch_quals_from_class(self,con):
        q={}
        q["skills"]=self.classes[0].skills
        fx={}
        tx={}
        for t in self.classes[0].tags:
            t.build_extensions(con)
            fx[t.name]=[e for e in t.effects if len(e.requires)==0 and e.tier=="T"+self.tier]
            tx[t.name]=[ta for ta in t.tag_features if len(ta.requires)==0 and ta.tier=="T"+self.tier]
        q["effects"]=fx
        q["tag_features"]=tx
        q["class_features"]=[c for c in self.classes[0].class_features if len(c.requires)==0 and c.tier=="T"+self.tier]
        return q

    def fetch_metadata_quals(self,con):
        trees=[e.tree for e in self.effects]
        trees=set(trees)
        metadata={}
        for e in trees:
            durs=list(chain(*pd.read_sql(sqa.text(f"SELECT id FROM durations WHERE tree='{e}' AND tier='T{self.tier}'"),con).values))
            durs=[d for d in durs if not has_prereqs(d,"durations",con)]
            rngs=list(chain(*pd.read_sql(sqa.text(f"SELECT id FROM ranges WHERE tree='{e}' AND tier='T{self.tier}'"),con).values))
            rngs=[r for r in rngs if not has_prereqs(r,"ranges",con)]
            metadata[e]={}
            metadata[e]["durations"]=[]
            for d in durs:
                metadata[e]["durations"].append(create_entry("durations",d,con))
            metadata[e]["ranges"]=[]
            for r in rngs:
                metadata[e]["ranges"].append(create_entry("ranges",r,con))
        return metadata



    def fetch_quals_from_bg(self,con):
        pass

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
                abilities.append(entry)
            setattr(self,table,abilities)

    def extend_entries(self,con):
        categories=self.fetch_attrs()
        for c in categories:
            entries=getattr(self,c)
            for e in entries:
                e.build_single_relations(con)
                e.build_plural_relations(con)
                e.build_other_relations(con)

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
