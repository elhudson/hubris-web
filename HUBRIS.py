import mimetypes
mimetypes.add_type('application/javascript', '.js')
import json
from flask import Flask, redirect, request, render_template, session, url_for, make_response
from flask_session import Session
import os
from sqlalchemy import create_engine, text
import uuid
from filters import *
from db_connect import address
from pandas import read_sql
import sqlalchemy
from itertools import chain

class Database:
    def __init__(self, address):
        self.address=address
    def create_engine(self):
        self.engine=create_engine(self.address)
    def run_query(self, txt):
        try:
            fr=read_sql(text(txt), self.engine) 
        except sqlalchemy.exc.OperationalError:
            self.create_engine()
            fr=read_sql(text(txt), self.engine)
        return fr
    def write_data(self, txt, obj=None):
        try:
            cnx=self.engine.connect()
        except sqlalchemy.exc.OperationalError:
            self.create_engine()
            cnx=self.engine.connect()
        if obj==None:
            cnx.execute(text(txt))
        else:
            stmt=text(txt)
            v=stmt.bindparams(obj=obj)
            cnx.execute(v)
        cnx.commit()
        cnx.close()
    def as_list(self, txt):
        fr=self.run_query(txt)
        return list(chain(*fr.values.tolist()))
    def as_item(self, txt):
        fr=self.run_query(txt)
        return fr['data'].values.tolist()

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.config["SESSION_TYPE"]='filesystem'
app.database=Database(address)
app.database.create_engine()
app.template_folder='./web'

receipts=[]


@app.route("/create")
def creation():
    return render_template("base.html", script='creation')

@app.route("/new_character")
def init_character():
    args=request.args
    user=args.get('user')
    char_id=str(uuid.uuid4())
    data=json.dumps({'id':char_id})
    app.database.write_data(f'''INSERT INTO characters (id, user, data) VALUES('{char_id}', '{user}', :obj)''', obj=data)
    return redirect(url_for('creation', character=char_id, stage='class'))


@app.route('/login',methods=['POST'])
def login():        
    data=json.loads(request.get_data())
    username=data['username']
    password=data['password']
    q=app.database.run_query(f"SELECT * FROM users WHERE username='{username}'")
    if q.empty:
        return redirect(url_for('wizard',error='no-account'))
    elif q['password'][0]!=password:
        return redirect(url_for('wizard',error='wrong-password'))
    else:
        user_id=app.database.as_item(f"SELECT id FROM users WHERE username='{username}'")
        return redirect(url_for('my_characters', user=user_id))

@app.route('/register',methods=['POST'])
def register():
    data=json.loads(request.get_data())
    username=data['username']
    password=data['password']
    id=str(uuid.uuid4())
    exists=app.database.run_query(f'''SELECT * FROM users WHERE username='{username}' ''')
    if exists.empty:
        app.database.write_data(f"INSERT INTO users VALUES('{id}','{username}','{password}')")
        return redirect(url_for('my_characters', user=id))
    else :
        return redirect(url_for('wizard',error='account-exists'))

@app.route("/sheet")
def sheet():
    return render_template("base.html", script='sheet')

@app.route("/level")
def spend_xp():
    return render_template("base.html", script='levelup')

@app.route("/")
def wizard(error=None):
    return render_template("base.html", script='login')
    
@app.route('/characters')
def my_characters():
    return render_template('base.html', script='characters')

@app.route('/user')
def get_characters():
    args=request.args
    user=args.get('user')
    q=f"SELECT id FROM characters WHERE user='{user}'"
    return app.database.as_list(q)
   
    
@app.route('/character',methods=['GET', 'POST'])
def character():
    args=request.args
    id=args.get('id')
    if request.method=='GET':
        return app.database.as_item(f'''SELECT data FROM characters WHERE id='{id}' ''')
    if request.method=='POST':
        receipts.append(request.get_json())
        if (len(receipts)==11):
           data=json.dumps({k:v for d in receipts for k, v in d.items()})
           if app.database.run_query(f"SELECT * FROM characters WHERE id='{id}'").empty==True:
               app.database.write_data(f'''INSERT INTO characters (id, user, data) VALUES('{id}', '{session.get('user_id')}' ''', obj=data)
           else:
               app.database.write_data(f'''UPDATE characters SET data=:obj WHERE id='{id}' ''', obj=data)
        return('Character saved.')

@app.route('/delete', methods=['POST'])
def delete_character():
    args=request.args
    query=f'''DELETE FROM characters WHERE id='{args.get(id)}' '''
    app.database.write_data(query)
    
    
