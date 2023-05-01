import sys
from dotenv import load_dotenv
import os
import pandas as pd
import sqlalchemy as sqa
import random
import string
import json
from itertools import chain

load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")
sys.path.append(os.getenv("PROCESSING_PATH"))

import jinja2 as j
from flask import Flask, render_template, request, url_for, redirect, session
from flask_session import Session
from db import create_character, create_entry
from dump import NpEncoder
from ruleset import all_in_table
engine=sqa.create_engine("sqlite:///"+os.getenv("DB_PATH"))


app = Flask(__name__)
app.config['SECRET_KEY']=os.urandom(19)
app.config['SESSION_TYPE']="filesystem"
app.json_encoder=NpEncoder
Session(app)

## serve the character sheet
        
@app.route("/sheet")
def sheet():
    character=session.get("character")
    return render_template("sheet.html",character=character,path="/static/characters/archie_radcliffe.json")

## serve the introductory dialogue

@app.route("/", methods=('GET','POST'))
def wizard():
    if request.method== 'GET':
        return render_template("wizard.html")
    if request.method=='POST':
        name=request.form["char_name"]
        query=sqa.text(f'SELECT id FROM characters WHERE name="{name}"')
        con=engine.connect()
        id=pd.read_sql(query,con).values.tolist()[0][0]
        character=create_character(id,con)
        session["character"]=character
        con.close()
        return redirect(url_for('sheet'))
    
## serve the class choice dialogue and save the user's response

@app.route("/class", methods=("GET","POST"))
def choose_class():
    if request.method=="GET":
        con=engine.connect()
        classes=all_in_table("classes",con)
        con.close()
        classes_markup=templatify(classes)
        return render_template("class.html",classes=classes_markup)
    if request.method=="POST":
        con=engine.connect()
        new=create_character(new_char_id(),con)
        session["new_character"]=new
        class_id=request.form.get("class")
        new.add_entry(con,class_id,"classes")
        con.close()
        return redirect(url_for('choose_backgrounds'))
    
## serve the background choice dialogue and save the user's response

@app.route("/backgrounds", methods=("GET", "POST"))
def choose_backgrounds():
    if request.method=="GET":
        con=engine.connect()
        backgrounds=all_in_table("backgrounds",con)
        backgrounds_markup=templatify(backgrounds)
        con.close()
        return render_template("backgrounds.html",backgrounds=backgrounds_markup,character=session.get('new_character'))
    if request.method=="POST":
        con=engine.connect()
        char=session.get('new_character')
        background_1_id=request.form.getlist("background")[0]
        background_2_id=request.form.getlist("background")[1]
        char.add_entry(con,background_1_id,"backgrounds")
        char.add_entry(con,background_2_id,"backgrounds")
        session["new_character"]=char
        return redirect(url_for("allocate_stats"))

@app.route("/stats", methods=("GET","POST"))
def allocate_stats():
    if request.method=="GET":
        return render_template("basic_info.html",character=session.get("new_character"))
    if request.method=="POST":
        stats=json.loads(list(request.cookies.keys())[-1])
        character=session.get("new_character")
        for s in stats.keys():
            setattr(character,s,int(stats[s]))
        session["new_character"]=character
        return redirect(url_for("spend_xp"))
    
@app.route("/xp", methods=("GET","POST"))
def spend_xp():
    if request.method=="GET":
        con=engine.connect()
        character=session.get("new_character")
        classes_query=sqa.text(f'''SELECT id FROM class_features WHERE classes='{character.classes[0].id}' AND tier='T1' ''')
        classes_ids=list(chain(*pd.read_sql(classes_query,con).values.tolist()))
        classes=[]
        for class_id in classes_ids:
            ent=create_entry("class_features",class_id,con)
            ent.build_prereqs(con)
            ent.build_postreqs(con)
            classes.append(ent)
        character.classes[0].build_single_relations(con)
        character.classes[0].build_plural_relations(con)
        char_tags=[tag.id for tag in character.classes[0].tags]
        tag_features=[]
        effects=[]
        for tag in char_tags:
            tag_query=sqa.text(f'''SELECT id FROM tag_features WHERE tag='{tag}' AND tier='T1' ''')
            result=list(chain(*pd.read_sql(tag_query,con).values.tolist()))
            for r in result:
                entry=create_entry("tag_features",r,con)
                entry.build_prereqs(con)
                entry.build_postreqs(con)
                tag_features.append(entry)
        for tag in char_tags:
            effect_query=sqa.text(f'''SELECT effects FROM __effects__tags WHERE tags='{tag}' ''')
            result=list(chain(*pd.read_sql(effect_query,con).values.tolist()))
            for r in result:
                f=create_entry("effects",r,con)
                f.build_prereqs(con)
                f.build_postreqs(con)
                effects.append(f)
        return render_template("spend_xp.html",effects=effects,tag_features=tag_features,class_features=classes,character=character)



## helper functions 

def templatify(entries):
    entries_markup=[]
    for entry in entries:
        markup={}
        for attr in entry.__dir__():
            item=getattr(entry,attr)
            if type(item)!=list:
                markup[attr]=item
            else:
                markup[attr]=[]
                for sub in item:
                    if type(sub)==list:
                        markup[attr].append(templatify(sub))
                    if hasattr(sub,"title"):
                        markup[attr].append(sub.title)
        entries_markup.append(markup)
    return entries_markup

def new_char_id():
    letters = string.ascii_letters
    result_str = ''.join(random.choice(letters) for i in range(19))
    return result_str
