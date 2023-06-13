from flask import session, render_template, request, redirect, url_for, app
from srd.ruleset import all_in_table
from srd.character import create_character, deserialize_character
import uuid
import json

from instance import app
    
## serve the class choice dialogue and save the user's response

@app.route("/class", methods=("GET","POST"))
def choose_class():
    if request.method=="GET":
        con=app.database.connect()
        classes=all_in_table("classes",con)
        con.close()
        return render_template("character_creation/class.html",classes=classes)
    if request.method=="POST":
        con=app.database.connect()
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
        con=app.database.connect()
        backgrounds=all_in_table("backgrounds",con)
        con.close()
        return render_template("character_creation/backgrounds.html",backgrounds=backgrounds,character=session.get('new_character'))
    if request.method=="POST":
        con=app.database.connect()
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
        con=app.database.connect()
        character=session.get("new_character")
        character.backgrounds[0].build_single_relations(con)
        character.backgrounds[1].build_single_relations(con)
        boost1=str.lower(character.backgrounds[0].attributes.name[0:3])
        boost2=str.lower(character.backgrounds[1].attributes.name[0:3])
        return render_template("character_creation/stats.html",character=character,boost1=boost1,boost2=boost2)
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
        con=app.database.connect()
        character=session.get("new_character")
        character.xp_earned=6
        character.xp_spent=0
        character.set_tier()
        character.to_file()
        return render_template("character_creation/spend_xp.html",character=character)
    if request.method=="POST":
        character=deserialize_character(json.loads(request.form.get('character')))
        character.to_file()
        session['new_character']=character
        return redirect(url_for('addtl_info'))

@app.route("/fluff",methods=("GET","POST"))
def addtl_info():
    if request.method=="GET":
        character=session.get('new_character')
        return render_template("character_creation/fluff.html",character=character)
    if request.method=='POST':
        con=app.database.connect()
        character=session.get('new_character')
        character.name=request.form.get('char_name')
        character.alignment=request.form.get('char_alignment')
        character.gender=request.form.get('char_gender')
        character.appearance=request.form.get('char_appearance')
        character.backstory=request.form.get('char_backstory')
        character.write_to_database(con)
        session['character']=character
        return redirect(url_for('sheet'))


