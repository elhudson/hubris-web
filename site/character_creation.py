from flask import session, render_template, request, redirect, url_for, app
from srd.ruleset import all_in_table
from srd.character import create_character, fetch_character, deserialize_character
import uuid
import json

from HUBRIS import app

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
        new.xp_spent=0
        new.xp_earned=6
        new.set_tier()
        class_id=request.form.get("class")
        new.add_entry("classes",class_id,con)
        new.to_file()
        session['character_id']=new.id
        con.close()
        return redirect(url_for('choose_backgrounds'))
    
@app.route("/backgrounds", methods=("GET", "POST"))
def choose_backgrounds():
    if request.method=="GET":
        con=app.database.connect()
        backgrounds=all_in_table("backgrounds",con)
        con.close()
        return render_template("character_creation/backgrounds.html",
                               backgrounds=backgrounds,character_id=session.get('character_id'))
    if request.method=="POST":
        con=app.database.connect()
        character_id=session.get('character_id')
        character=fetch_character(app, character_id)
        character.add_entry("backgrounds",request.form.getlist('background')[0],con)
        character.add_entry("backgrounds",request.form.getlist('background')[1],con)
        character.to_file()
        return redirect(url_for("allocate_stats"))

@app.route("/stats", methods=("GET","POST"))
def allocate_stats():
    if request.method=="GET":
        return render_template("character_creation/stats.html",
                               character_id=session.get('character_id'))
    if request.method=="POST":
        character=fetch_character(app,session.get('character_id'))
        print(character.backgrounds)
        for attr in ['str','dex','con','int','wis','cha']:
            character.__setattr__(attr,request.form.get(attr))
        character.to_file()
        return redirect(url_for("spend_xp"))
    
@app.route("/xp", methods=("GET","POST"))
def spend_xp():
    if request.method=="GET":
        return render_template("character_creation/spend_xp.html",character_id=session.get('character_id'))
    if request.method=="POST":
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