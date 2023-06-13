from flask import session, render_template, request, redirect, url_for
from srd.character import create_character
from pandas import read_sql
from sqlalchemy import text

from instance import app
        
@app.route("/sheet")
def sheet():
    character=session.get("character")
    character.to_file()
    return render_template("sheet.html",character=character)


@app.route("/", methods=('GET','POST'))
def wizard():
    if request.method== 'GET':
        return render_template("home.html")
    if request.method=='POST':
        name=request.form["char_name"]
        query=text(f'SELECT id FROM characters WHERE name="{name}"')
        id=read_sql(query,app.database).values.tolist()[0][0]
        character=create_character(id,app.database)
        session["character"]=character
        return redirect(url_for('sheet'))