from flask import session, render_template, request, redirect, url_for, flash
from srd.character import create_character
from pandas import read_sql
from sqlalchemy import text, exc
from itertools import chain
import os
import uuid
import json
from werkzeug import exceptions
from db_connect import tunnel, engine
from HUBRIS import app


@app.route('/login',methods=['POST'])
def login():        
    data=json.loads(request.get_data())
    username=data['username']
    password=data['password']
    q=read_sql(text(f"SELECT * FROM users WHERE username='{username}'"),app.database)
    if q.empty:
        return redirect(url_for('wizard',error='no-account'))
    elif q['password'][0]!=password:
        return redirect(url_for('wizard',error='wrong-password'))
    else:
        session['user_id']=read_sql(text(f"SELECT id FROM users WHERE username='{username}'"),app.database)['id'][0]
        return redirect(url_for('my_characters'))

@app.route('/register',methods=['POST'])
def register():
    data=json.loads(request.get_data())
    username=data['username']
    password=data['password']
    user_id=uuid.uuid4()
    exists=read_sql(text(f'''SELECT * FROM users WHERE username='{username}' '''),app.database)
    if exists.empty:
        add=text(f"INSERT INTO users VALUES('{str(user_id)}','{username}','{password}')")
        with app.database.connect() as con:
            con.execute(add)
            con.commit()
            con.close()
            session['user_id']=str(user_id)
            return redirect(url_for('my_characters'))
    else :
        return redirect(url_for('wizard',error='account-exists'))
    
@app.errorhandler(exceptions.InternalServerError)
def handle_server_disconnect(e):
    t=tunnel()
    e=engine(t)
    app.database=e
    return redirect(request.base_uri)

@app.route('/characters',methods=['GET','POST'])
def my_characters():
    if request.method=='GET':
        user_id=session.get('user_id')
        ids=list(chain(*read_sql(text(f"SELECT id FROM characters WHERE user='{user_id}'"),app.database).values.tolist()))
        return render_template('characters/characters.html',ids=ids)
    if request.method=='POST':
        id=request.form['character_selection']
        return redirect(url_for('sheet',character_id=id))

@app.route('/get/<id>',methods=['GET'])
def get_character(id):
    char=create_character(id, app.database)
    js=char.to_json()
    return js

