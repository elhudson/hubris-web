import sys
from dotenv import load_dotenv
import os
import sqlalchemy as sqa

load_dotenv("/home/el_hudson/projects/HUBRIS/sticky_note.env")
sys.path.append(os.getenv("PROCESSING_PATH"))

import jinja2 as j
from flask import Flask, render_template, request
from db import Character
from ruleset import all_in_table
char_name="Archie Radcliffe"
engine=sqa.create_engine("sqlite:///"+os.getenv("DB_PATH"))

app = Flask(__name__)
app.config['SECRET_KEY']=os.urandom(19)

## serve the character sheet
        
@app.route("/sheet")
def sheet():
    con=engine.connect()
    char=Character(char_name,con)
    return render_template("sheet.html",character=char,path="/static/characters/archie_radcliffe.json")

## serve the introductory dialogue

@app.route("/", methods=('GET','POST'))
def wizard():
    if request.method== 'GET':
        return render_template("wizard.html")
    if request.method=='POST':
        name=request.form["char_name"]
        con=engine.connect()
        char=Character(name,con)
        char.attributes(con)
        return app.redirect(location="/sheet")

## serve the class choice dialogue and save the user's response to a JSON object

@app.route("/class", methods=("GET","POST"))
def choose_class():
    if request.method=="GET":
        con=engine.connect()
        classes=all_in_table("classes",con)
        classes_markup=templatify(classes)
        con.close()
        return render_template("class.html",classes=classes_markup)
    if request.method=="POST":
        data=request._load_form_data()
        print(data)


@app.route("/backgrounds", methods=("GET", "POST"))
def choose_backgrounds():
    if request.method=="GET":
        con=engine.connect()
        backgrounds=all_in_table("backgrounds",con)
        backgrounds_markup=templatify(backgrounds)
        con.close()
        return render_template("backgrounds.html")

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
                    if hasattr(sub,"title"):
                        markup[attr].append(sub.title)
        entries_markup.append(markup)
    return entries_markup

