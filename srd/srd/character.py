import json
import os
from itertools import chain
import pandas as pd
import sqlalchemy as sqa
from srd.entry import Entry, create_entry
from srd.ruleset import all_in_table
from srd.tools import CharacterEncoder

def create_character(char_id,con):
    char=Character(char_id)
    if exists(char_id,con):
        char.basic_info(con)
        char.build_entries(con)
        char.xp_spent=char.count_xp()
        char.set_tier()
        if hasattr(char,"effects"):
            char.trees_known=char.set_trees()
    return char

def fetch_character(app,character_id):
    file=open(f'{app.home}/static/characters/{character_id}.json')
    js=json.load(file)
    return deserialize_character(js)

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
        self.str=-2
        self.dex=-2
        self.con=-2
        self.int=-2
        self.wis=-2
        self.cha=-2
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
    
    def fetch_quals(self,con):
        q={}
        q["skills"]=self.classes[0].skills
        q["class_features"]=[]
        q["tag_features"]=[]
        q["effects"]=[]
        q["ranges"]=[]
        q["durations"]=[]
        for t in self.tags:
            t.build_extensions(con)
            for e in t.effects:
                if self.is_qualified(e,con)==True and e.id not in [i.id for i in q["effects"]]:
                    e.build_extensions(con)
                    e.range.build_extensions(con)
                    e.duration.build_extensions(con)
                    q["effects"].append(e)
            for tf in t.tag_features:
                if self.is_qualified(tf,con)==True:
                    tf.build_extensions(con)
                    q["tag_features"].append(tf)
        for f in self.classes[0].class_features:
            f.build_extensions(con)
            if self.is_qualified(f,con)==True:
                q["class_features"].append(f)
        for r in all_in_table("ranges",con):
            if self.is_qualified(r,con)==True and r.id not in [i.id for i in q["ranges"]]:
                r.build_extensions(con)
                q["ranges"].append(r)
        for d in all_in_table("durations",con):
            if self.is_qualified(d,con)==True and d.id not in [i.id for i in q["durations"]]:
                d.build_extensions(con)
                q["durations"].append(d)
        return q
    
    def assign_default_metadata(self):
        for e in self.effects:
            if hasattr(self,"ranges"):
                if e.range.id not in [i.id for i in self.ranges]:
                    self.ranges.append(e.range)
            else:
                self.ranges=[e.range]
            if hasattr(self,"durations"):
                if e.duration.id not in [i.id for i in self.durations]:
                    self.durations.append(e.duration)
            else:
                self.durations=[e.duration]

    def is_qualified(self,entry,con):
        if hasattr(self,entry.table):
            preexist=getattr(self,entry.table)
            if entry.id in [i.id for i in preexist]:
                return False
        if entry.table in ("effects","class_features","tag_features","ranges","durations"):   
            if entry.table in ("ranges","durations"):
                if hasattr(self,"trees_known")==False or entry.tree not in self.trees_known:
                    return False      
            if entry.has_prerequisites(con) and hasattr(self,entry.table)==False:
                return False       
            if entry.has_prerequisites(con) and hasattr(self,entry.table):
                entry.build_extensions(con)
                prereqs=entry.requires
                character_has=self.__getattribute__(entry.table)                    
                prereq_ids=[prereq.id for prereq in prereqs]
                character_has_ids=[ability.id for ability in character_has]
                overlap=[i for i in prereq_ids if i in character_has_ids]
                if len(overlap)>0:
                    return True
                else:
                    return False
            else:
                return True
    

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

    def set_trees(self):
        trees=[t.tree for t in self.effects]
        return list(set(trees))

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
        self.tags=self.classes[0].tags

    def add_entry(self,table,id,con):
        if hasattr(self,table)==False:
            setattr(self,table,[])
        properties=getattr(self,table)
        prop_ids=[p.id for p in properties]
        if id not in prop_ids:
            if table=="effects":
                ent=create_entry("effects",id,con)
                self.add_entry("ranges",ent.duration.id,con)
                self.add_entry("durations",ent.duration.id,con)
                if ent.id not in [e.id for e in self.effects]:
                    self.effects.append(ent)
            if table=="backgrounds":
                bg=create_entry("backgrounds",id,con)
                bg.build_extensions(con)
                self.add_entry("skills",bg.relate["skills"],con)
                boost=str.lower(bg.attributes.name)[0:3]
                setattr(self,boost,getattr(self,boost)+1)
                if not hasattr(self,"boosts"):
                    self.boosts=[]
                self.boosts.append(boost)
                self.backgrounds.append(bg)
            else:
                properties.append(create_entry(table,id,con))
        

    def to_dict(self):
        base= self.__dict__.copy()
        for item in self.__dict__:
            entry=getattr(self,item)
            if type(entry)==dict:
                base[item]=entry
            if type(entry)==list:
                e=[]
                for i in range(len(entry)):
                    if type(entry[i]) in Entry.__subclasses__() or type(entry[i])==Entry:
                        e.append(entry[i].to_dict())
                    else:
                        e.append(entry[i])
                base[item]=e
        return base

    def to_JSON(self,base,out=False,fp=None):
        if out==True:
            json.dump(base,fp=fp,cls=CharacterEncoder,separators=(",",":"),indent=None)
        else:
            return json.dumps(base,cls=NpEncoder,separators=(",",":"),indent=None)
    
    def to_file(self):
        if self.name!=None:
            file_name=self.name.replace(" ","_").lower()
        else:
            file_name=self.id
        char_path=os.getenv("PWD")+f"/static/characters/{file_name}.json"
        base=self.to_dict()
        return self.to_JSON(base,out=True,fp=open(char_path,"w+"))

    def from_file(self):
        char_filename=str.lower(self.name.replace(" ","_"))
        char_path=os.getenv("CHAR_PATH")+f'/{char_filename}.json'
        with open(char_path) as f:
            char=json.load(f)
        return char

    def write_to_database(self,con):
        res=pd.read_sql(sqa.text("SELECT tbl_name FROM sqlite_master WHERE type='table'"),con).values
        names=[names[0] for names in res if "__characters" in names[0]]
        d=self.to_dict()
        queries={}
        for targ in d.keys():
            for t in names:
                if targ in t and type(d[targ])==list:
                    l=[]
                    for item in d[targ]:
                        l.append((self.id,item['id']))
                    queries[t]=l
        for q in queries.keys():
            prop_name=q.replace("__characters__","")+"_id"
            for pair in queries[q]:
                sql=sqa.text(f'''INSERT INTO {q} (char_id, {prop_name}) 
                             VALUES('{pair[0]}','{pair[1]}')''')
                con.execute(sql)
                con.commit()
        fields=pd.read_sql(sqa.text('SELECT * FROM characters'),con).columns.tolist()
        vals=[str(d[field]) for field in fields]
        j='","'
        v=j.join(vals)
        query=sqa.text(f'INSERT INTO characters VALUES("{v}")')
        con.execute(query)
        con.commit()
    