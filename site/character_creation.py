from flask import session, render_template, request, redirect, url_for, app
from srd.ruleset import all_in_table
from srd.character import create_character, fetch_character, deserialize_character
from srd.tools import in_dev
import uuid
import json

from HUBRIS import app

@app.route("/class", methods=("GET","POST"))
def choose_class():
        new_id=uuid.uuid4()
        session['character_id']=str(new_id)
        return render_template("creation/creation.html", id=str(new_id))
    
@app.route("/backgrounds", methods=("GET", "POST"))
def choose_backgrounds():
        return render_template("creation/creation.html",id=session.get('character_id'))

@app.route("/stats", methods=("GET","POST"))
def allocate_stats():
    return render_template("creation/creation.html", id=session.get('character_id'))
    
@app.route("/xp", methods=("GET","POST"))
def spend_xp():
    return render_template("creation/creation.html",id=session.get('character_id'))

@app.route("/fluff",methods=("GET","POST"))
def addtl_info():
    if request.method=='GET':
        return render_template("creation/creation.html", id=session.get('character_id'))
    if request.method=='POST':
        ch=json.loads(request.get_data())
        fil=open(f"tmp/{ch['id']}.json",'w+')
        json.dump(ch,fil)
