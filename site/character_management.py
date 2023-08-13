from flask import session, render_template, request, redirect, url_for
from srd.character import create_character
from pandas import read_sql
from itertools import chain
import json
from sqlalchemy import text

from HUBRIS import app

receipts=[]

@app.route("/sheet/<character_id>")
def sheet(character_id):
    return render_template("sheet/sheet.html",id=character_id)

@app.route("/level/<character_id>")
def spend_xp(character_id):
    return render_template("levelup/levelup.html",id=character_id)


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
    
@app.route('/characters',methods=['GET','POST'])
def my_characters():
    if request.method=='GET':
        user_id=session.get('user_id')
        ids=list(chain(*read_sql(text(f"SELECT id FROM characters WHERE user='{user_id}'"),app.database).values.tolist()))
        return render_template('characters/characters.html',ids=ids)
    if request.method=='POST':
        id=request.form['character_selection']
        return redirect(url_for('sheet',character_id=id))

@app.route('/<id>',methods=['GET', 'POST'])
def character(id):
    if request.method=='GET':
        data=read_sql(f'''SELECT data FROM characters WHERE id='{id}' ''', app.database).values.tolist()[0][0]
        return json.loads(data)
    if request.method=='POST':
        receipts.append(request.get_json())
        if (len(receipts)==11):
           data=json.dumps({k:v for d in receipts for k, v in d.items()})
           cnx=app.database.connect()
           if read_sql(text(f"SELECT * FROM characters WHERE id='id'"), app.database).empty==True:
                cnx.execute(text(f'''INSERT INTO characters (id, user, data) VALUES('{id}', '{session.get('user_id')}', :obj)'''),{'obj':data})
                
           else:
                cnx.execute(text(f'''UPDATE characters SET data=:obj WHERE id='{id}' '''), {'obj':data})
           cnx.commit()
        return('Character saved.')

