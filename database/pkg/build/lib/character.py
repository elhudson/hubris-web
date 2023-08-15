import json
import os
from itertools import chain
import pandas as pd
import sqlalchemy as sqa
from sqlalchemy.exc import IntegrityError
from srd.entry import Entry, create_entry, EntryEncoder
from srd.ruleset import all_in_table

def create_character(id, con):
    sql=pd.read_sql(sqa.text(f"SELECT data FROM characters WHERE id='{id}'"), con).values.tolist()[0]
    data=json.load(sql)
    return data

def fetch_character(app,character_id):
    file=open(f'{app.home}/static/characters/{character_id}.json')
    js=json.load(file)
    return deserialize_character(js)

def deserialize_character(d):
    me=Character(d["id"])
    for item in d.keys():
        if item=='ability_scores':
            s={}
            s['str']=int(d[item]['str'])
            s['dex']=int(d[item]['dex'])
            s['con']=int(d[item]['con'])
            s['int']=int(d[item]['int'])
            s['wis']=int(d[item]['wis'])
            s['cha']=int(d[item]['cha'])
            setattr(me,'ability_scores',s)
        elif type(d[item])==dict:
            down=deserialize_entry(d[item])
            setattr(me,item,down)
        elif type(d[item])==list and item!='boosts':
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
    sql=sqa.text(f'''SELECT * FROM characters WHERE id="{char_id}" ''') 
    r=pd.read_sql(sql,con)
    if r.empty:
        return False
    else:
        return True

class Character:
    def __init__(self,char_id):
        self.id=char_id
    
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
        sql=sqa.text(f'''SELECT * FROM characters WHERE id='{self.id}' ''')
        r=pd.read_sql(sql,con)
        for a in r.columns:
            setattr(self,a,r[a][0])        

    def set_trees(self):
        trees=[t.tree for t in self.effects]
        return list(set(trees))

    def build_entries(self,con):
        res=list(chain(*pd.read_sql(sqa.text("SELECT table_name FROM information_schema.tables WHERE table_schema='ehudson19$HUBRIS'"),con).values.tolist()))
        names=[n for n in res if "__characters" in n and '.csv' not in n]
        print(names)
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
                self.add_entry("skills",bg.relate["skills"],con)
                if bg.id not in [f.id for f in self.backgrounds]:
                    self.backgrounds.append(bg)
            if table=='classes':
                cl=create_entry('classes',id,con)
                cl.build_extensions(con)
                if hasattr(self,'tags')==False:
                        self.tags=[]
                for t in cl.tags:
                    self.tags.append(t)
                self.classes.append(cl)
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

    def to_json(self):
        return json.dumps(self.__dict__,cls=EntryEncoder)
    
    def to_file(self):
        file_name=self.id
        char_path=os.getenv("PWD")+f"/static/characters/{file_name}.json"
        json.dump(self.__dict__,open(char_path,"w"),cls=EntryEncoder)

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
                    if targ=='skills':
                        s=[t for t in d[targ] if t['proficient']==True]
                        for item in s:
                            l.append((self.id,item['id']))
                    else:
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
        for f in ['str','dex','con','int','wis','cha']:
            d[f]=int(d['ability_scores'][f])
        vals=[str(d[field]) for field in fields]
        j='","'
        v=j.join(vals)
        query=sqa.text(f'INSERT INTO characters VALUES("{v}")')
        try:
            con.execute(query)
            con.commit()
        except IntegrityError:
            de=sqa.text(f"DELETE FROM characters WHERE id='{str(self.id)}'")
            con.execute(de)
            con.execute(query)
            con.commit()


    

