import mimetypes
mimetypes.add_type('application/javascript', '.js')
import json
from flask import Flask, redirect, request, render_template, session, url_for
from flask_session import Session
import os
from sqlalchemy import create_engine, text
import uuid
from filters import *
from db_connect import address
from pandas import read_sql
import sqlalchemy
from itertools import chain

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.config["SESSION_TYPE"]='filesystem'
app.database=create_engine(address)
app.template_folder='./web'

receipts=[]


@app.route("/class")
def choose_class():
    return render_template("base.html", script='creation')

@app.route("/backgrounds")
def choose_backgrounds():
    return render_template("base.html", script='creation')

@app.route("/stats")
def allocate_stats():
    return render_template("base.html", script='creation')
    
@app.route("/fluff")
def addtl_info():
    return render_template("base.html", script='creation')

@app.route('/login',methods=['POST'])
def login():        
    data=json.loads(request.get_data())
    username=data['username']
    password=data['password']
    print(username, password)
    q=read_sql(text(f"SELECT * FROM users WHERE username='{username}'"),app.database)
    if q.empty:
        return redirect(url_for('wizard',error='no-account'))
    elif q['password'][0]!=password:
        return redirect(url_for('wizard',error='wrong-password'))
    else:
        user_id=read_sql(text(f"SELECT id FROM users WHERE username='{username}'"),app.database)['id'][0]
        return redirect(url_for('my_characters', user=user_id))

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
            return redirect(url_for('my_characters', user=user_id))
    else :
        return redirect(url_for('wizard',error='account-exists'))

@app.route("/sheet/<character_id>")
def sheet(character_id):
    return render_template("base.html",id=character_id, script='sheet')

@app.route("/level/<character_id>")
def spend_xp(character_id):
    return render_template("base.html",id=character_id, script='levelup')

@app.route("/")
def wizard(error=None):
    return render_template("base.html", script='login')
    
@app.route('/characters')
def my_characters(user):
    ids=list(chain(*read_sql(text(f"SELECT id FROM characters WHERE user='{user}'"),app.database).values.tolist()))
    return render_template('base.html', script='characters')


@app.route('/<id>',methods=['GET', 'POST'])
def character(id):
    if request.method=='GET':
        try:
            data=read_sql(f'''SELECT data FROM characters WHERE id='{id}' ''', app.database).values.tolist()[0][0]
        except sqlalchemy.exc.OperationalError:
            app.database=create_engine(address)
            data=read_sql(f'''SELECT data FROM characters WHERE id='{id}' ''', app.database).values.tolist()[0][0]
        return json.loads(data)
    if request.method=='POST':
        receipts.append(request.get_json())
        if (len(receipts)==11):
           data=json.dumps({k:v for d in receipts for k, v in d.items()})
           try:
               write_out(app.database,data)
           except sqlalchemy.exc.OperationalError:
               app.database=create_engine(address)
               write_out(app.database, data)
        return('Character saved.')


@app.route('/delete/<id>', methods=['POST'])
def delete_character(id):
    query=text(f'''DELETE FROM characters WHERE id='{id}' ''')
    cnx=app.database.connect()
    cnx.execute(query)
    cnx.commit()
    cnx.close()
    
def write_out(con, data):
    cnx=app.database.connect()
    if read_sql(text(f"SELECT * FROM characters WHERE id='{id}'"), app.database).empty==True:
        cnx.execute(text(f'''INSERT INTO characters (id, user, data) VALUES('{id}', '{session.get('user_id')}', :obj)'''),{'obj':data})
    else:
        cnx.execute(text(f'''UPDATE characters SET data=:obj WHERE id='{id}' '''), {'obj':data})
    cnx.commit()