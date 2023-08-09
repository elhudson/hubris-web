from flask import session, render_template, request, redirect, url_for
from srd.character import create_character
from pandas import read_sql
from sqlalchemy import text

from HUBRIS import app

        
@app.route("/sheet/<character_id>")
def sheet(character_id):
    return render_template("sheet/sheet.html",id=character_id)


@app.route("/", methods=('GET','POST'))
def wizard(error=None):
    if request.method== 'GET':
        return render_template("login/login.html")
    if request.method=='POST':
        name=request.form["char_name"]
        query=text(f'SELECT id FROM characters WHERE name="{name}"')
        id=read_sql(query,app.database).values.tolist()[0][0]
        character=create_character(id,app.database)
        session["character"]=character
        return redirect(url_for('sheet'))
    
