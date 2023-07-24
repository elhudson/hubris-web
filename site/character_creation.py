from flask import session, render_template, request, redirect, url_for, app
from srd.ruleset import all_in_table
from srd.character import create_character, fetch_character, deserialize_character
import uuid
import json

from HUBRIS import app

@app.route("/class", methods=("GET","POST"))
def choose_class():
    if request.method=="GET":
        new_id=uuid.uuid4()
        session['character_id']=str(new_id)
        return render_template("character_creation/class.html", id=str(new_id))
    
@app.route("/backgrounds", methods=("GET", "POST"))
def choose_backgrounds():
    if request.method=="GET":
        return render_template("character_creation/backgrounds.html",id=session.get('character_id'))

@app.route("/stats", methods=("GET","POST"))
def allocate_stats():
    if request.method=="GET":
        return render_template("character_creation/stats.html",
                               id=session.get('character_id'))
    
@app.route("/xp", methods=("GET","POST"))
def spend_xp():
    if request.method=="GET":
        return render_template("character_creation/spend_xp.html",id=session.get('character_id'))
    if request.method=="POST":
        character=deserialize_character(json.loads(request.form.get('character')))
        character.to_file()
        return redirect(url_for('addtl_info'))

@app.route("/fluff",methods=("GET","POST"))
def addtl_info():
    if request.method=="GET":
        return render_template("character_creation/fluff.html")
    if request.method=='POST':
        con=app.database.connect()
        character=fetch_character(app,session.get('character_id'))
        character.name=request.form.get('char_name')
        character.alignment=request.form.get('char_alignment')
        character.gender=request.form.get('char_gender')
        character.appearance=request.form.get('char_appearance')
        character.backstory=request.form.get('char_backstory')
        print(character.ability_scores)
        character.write_to_database(con)
        return redirect(url_for('sheet',character_id=session.get('character_id')))
    
