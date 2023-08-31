import mimetypes
mimetypes.add_type('application/javascript', '.js')
import json
from flask import Flask, redirect, request, render_template, session, url_for, make_response
from flask_session import Session
import os
from sqlalchemy import create_engine, text
import uuid
from db_connect import address, tunnel, engine
from pandas import read_sql
import sqlalchemy
from itertools import chain

class Database:
    def __init__(self, address):
        self.address=address
        self.storage=f'{os.path.expanduser("~")}/storage'
    def create_engine(self):
        if os.path.expanduser('~')=='/home/ehudson19':
            self.engine=create_engine(self.address)
        else:
            self.create_dev_engine()
    def create_dev_engine(self):
        self.engine=engine(tunnel())
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
            cnx.execute(text(txt), obj)
        cnx.commit()
        cnx.close()
    def get_filename(self, char, usr):
        return f'{char}__{usr}.json'
    def get_all(self):
        return os.listdir(self.storage)
    def save_character(self, char, usr):
        with open(f'{self.storage}/{self.get_filename(char["id"], usr)}', 'w+') as blob:
            json.dump(char, blob)
    def get_usr_characters(self, usr):
        files=self.get_all()
        chars=[f for f in files if usr in f]
        char_ids=[f.split('__')[0] for f in chars]
        return char_ids
    def get_character(self, id):
        files=self.get_all()
        me=[f for f in files if id in f][0]
        usr_id=me.split('__')[1].split('.')[0]
        with open(f'{self.storage}/{me}') as loc:
            js=json.load(loc)
            js['user']=usr_id
            return js
    def as_list(self, txt):
        fr=self.run_query(txt)
        return list(chain(*fr.values.tolist()))
    def get_user(self, id):
        q=f"SELECT * FROM users WHERE id={id}"
        return self.run_query(q)
    def delete_character(self, id):
        files=self.get_all()
        me=[f for f in files if id in f][0]
        os.remove(me)
    def get_char_owner(self, char):
        char=[f for f in self.get_all() if char in f][0]
        usr=char.split('__')[1].split('.')[0]
        return usr
    def as_item(self, txt):
        fr=self.run_query(txt)
        attr=txt.split('SELECT ')[1].split(' ')[0]
        return fr[attr][0]

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.database=Database(address)
app.database.create_engine()
app.template_folder='./web'

@app.route("/create")
def creation():
    return render_template("base.html", script='creation')

@app.route("/new_character")
def init_character():
    args=request.args
    user=args.get('user')
    char_id=str(uuid.uuid4())
    data={'id':char_id, 'user':user, 'url':url_for('creation', character=char_id, stage='class')}
    app.database.save_character(data, user)
    return json.dumps(data)

@app.route('/login',methods=['POST'])
def login():        
    data=request.get_json()
    username=data['username']
    password=data['password']
    q=app.database.run_query(f"SELECT * FROM users WHERE username='{username}'")
    if q.empty:
        return redirect(url_for('wizard',error='no-account'))
    elif q['password'][0]!=password:
        return redirect(url_for('wizard',error='wrong-password'))
    else:
        user_id=app.database.as_item(f"SELECT id FROM users WHERE username='{username}'")
        r={'id':user_id, 'msg':f'Welcome, back, {username}!'}
        return json.dumps(r)

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

@app.route("/levelup")
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
    return app.database.get_usr_characters(user)
   
@app.route('/rules')
def get_rules():
    rules=json.load(open(f'{os.getcwd()}/database/ruleset.json'))
    return json.dumps(rules)

@app.route('/character',methods=['GET', 'POST'])
def character():
    args=request.args
    if request.method=='GET':
        return json.dumps(app.database.get_character(args.get('character')))
    if request.method=='POST':
        user_id=app.database.get_char_owner(args.get('character'))
        character=request.get_json()
        app.database.save_character(character, user_id)
        data={'msg':f'Character saved', 'user':user_id, 'character':character}
        response={
            'url':url_for('my_characters', user=user_id),
            'body':json.dumps(data)
        }
        return make_response(response)
    
@app.route('/delete')
def delete_character():
    args=request.args
    app.database.delete_character(args.get('character'))
    return json.dumps({'msg':'Character deleted.'})
    
    
