import sys
from dotenv import load_dotenv
import os
import sqlalchemy as sqa

load_dotenv("/home/el_hudson/Projects/HUBRIS-1/sticky_note.env")
sys.path.append(os.getenv("PROCESSING_PATH"))
sys.path.append("/home/el_hudson/Projects/HUBRIS-1/web/templates/generators")

import jinja2 as j
from flask import Flask, render_template, request
from db import Character

char_name="Archie Radcliffe"
engine=sqa.create_engine("sqlite:///"+os.getenv("DB_PATH"))

app = Flask(__name__)
app.config['SECRET_KEY']=os.urandom(19)


def get_tag_overlap(effect,char):
    char_tags=[getattr(item,"title") for item in char.classes[0].tags]
    char_tags.append("Agility")
    char_tags.append("Conjuration")
    char_tags.append("Abjuration")
    effect_tags=[str.capitalize(getattr(item,"title")) for item in effect.tags]
    print(char_tags)
    print(effect_tags)
    for i in char_tags:
        if i in effect_tags:
            return i
        
@app.route("/sheet")
def sheet():
    con=engine.connect()
    char=Character(char_name,con)
    char.attributes(con)
    for e in char.effects:
        setattr(e,"tag",get_tag_overlap(e,char))
    return render_template("sheet.html",character=char,path="/static/characters/archie_radcliffe.json")


@app.route("/", methods=('GET','POST'))
def wizard():
    if request.method== 'GET':
        return render_template("/walkthrough/wizard.html")
    if request.method=='POST':
        name=request.form["char_name"]
        con=engine.connect()
        char=Character(name,con)
        char.attributes(con)
        return render_template("sheet.html",character=char)


@app.route("/character_creation/basic_info")
def basic_info():
    return render_template("walkthrough/character_creation/basic_info.html")