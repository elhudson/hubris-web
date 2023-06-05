import sys
from dotenv import load_dotenv
import os
import pandas as pd
import sqlalchemy as sqa
import uuid
import json
from itertools import chain

load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")
sys.path.append(os.getenv("PROCESSING_PATH"))

import jinja2 as j
from flask import Flask, render_template, request, url_for, redirect, session
from flask_session import Session
from character import create_character, Character
from entry import create_entry, Entry
from ruleset import all_in_table,fetch_metadata
from tools import NpEncoder,find_table,parse_name,get_configs
engine=sqa.create_engine("sqlite:///"+os.getenv("DB_PATH"))

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.config["SESSION_TYPE"]='filesystem'
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
        return render_template("class.html",classes=classes)
    if request.method=="POST":
        con=engine.connect()
        new=create_character(uuid.uuid4(),con)
        session["new_character"]=new
        class_id=request.form.get("class")
        new.add_entry("classes",class_id,con)
        con.close()
        return redirect(url_for('choose_backgrounds'))
    
## serve the background choice dialogue and save the user's response

@app.route("/backgrounds", methods=("GET", "POST"))
def choose_backgrounds():
    if request.method=="GET":
        con=engine.connect()
        backgrounds=all_in_table("backgrounds",con)
        con.close()
        return render_template("backgrounds.html",backgrounds=backgrounds,character=session.get('new_character'))
    if request.method=="POST":
        con=engine.connect()
        char=session.get('new_character')
        background_1_id=request.form.getlist("background")[0]
        background_2_id=request.form.getlist("background")[1]
        char.add_entry("backgrounds",background_1_id,con)
        char.add_entry("backgrounds",background_2_id,con)
        session["new_character"]=char
        return redirect(url_for("allocate_stats"))

@app.route("/stats", methods=("GET","POST"))
def allocate_stats():
    if request.method=="GET":
        con=engine.connect()
        character=session.get("new_character")
        character.backgrounds[0].build_single_relations(con)
        character.backgrounds[1].build_single_relations(con)
        boost1=str.lower(character.backgrounds[0].attributes.name[0:3])
        boost2=str.lower(character.backgrounds[1].attributes.name[0:3])
        return render_template("basic_info.html",character=character,boost1=boost1,boost2=boost2)
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
        character.xp_earned=6
        character.xp_spent=0
        character.set_tier()
        character.to_file()
        return render_template("spend_xp.html",character=character)
    if request.method=="POST":
        con=engine.connect()
        character=session.get("new_character")
        choices=set(json.loads(list(request.cookies.keys())[-1]))
        for c in choices:
            table=find_table(c,con)
            character.add_entry(table,c,con)
        session["new_character"]=character
        return redirect(url_for("addtl_info"))


@app.route("/fluff",methods=("GET","POST"))
def addtl_info():
    if request.method=="GET":
        con=engine.connect()
        character=session.get("new_character")
        return render_template("fluff.html",character=character)