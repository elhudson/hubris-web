import mimetypes
mimetypes.add_type('application/javascript', '.js')
import json
from flask import Flask, redirect, request, url_for, make_response
import os
import uuid
from db_connect import address

from flask_vite import Vite
from vite.views import bp
from filesystem import start_engine

from db import Character, User, Base, CharacterError, UserError

from sqlalchemy.exc import OperationalError

app = Flask(__name__)
vite=Vite(app)
app.secret_key=os.urandom(19)
app.register_blueprint(bp)

app.engine=start_engine()
Base.metadata.create_all(app.engine)

app.characters=Character
app.users=User

@app.errorhandler(OperationalError)
def handle_disconnect(e):
    print(e)

@app.route("/new_character")
def init_character():
    user=request.args.get('user')
    char_id=str(uuid.uuid4())
    data={
        'id':char_id, 
        'user':user,
        'url':url_for('vite.creation', character=char_id, stage='class')}
    app.characters.set(app.engine, data)
    return json.dumps(data)

@app.route('/user')
def get_characters():
    res=app.characters.by_user(app.engine, request.args.get('user'))
    return json.dumps(res)

@app.route('/login',methods=['POST'])
def login():        
    try:
        data=app.users.validate(app.engine, request.get_json())
        return redirect(url_for('vite.my_characters', user=data.id))
    except UserError:
        return redirect(url_for('vite.wizard', error='no-user'))
    
@app.route('/register',methods=['POST'])
def register():
    data=json.loads(request.get_data())
    data['id']=str(uuid.uuid4())
    try:
        app.users.set(app.engine, data)
    except UserError:
        data['url']=url_for('vite.wizard', error='account-exists')
        data['validated']=False
    else:
        data['url']=url_for('vite.my_characters', user=data['id'])
        data['validated']=True
    return json.dumps(data)

@app.route('/character',methods=['GET', 'POST'])
def character():
    args=request.args
    if request.method=='GET':
        return json.dumps(app.characters.get(app.engine, args.get('character')))
    if request.method=='POST':
        character=request.get_json()
        app.characters.set(app.engine, character)
        data={'msg':f'Character saved', 'user':character['user'], 'character':character}
        response={
            'url':url_for('vite.my_characters', user=character['user']),
            'body':json.dumps(data)
        }
        return make_response(response)
    
@app.route('/delete')
def delete_character():
    args=request.args
    app.database.delete_character(args.get('character'))
    return json.dumps({'msg':'Character deleted.'})
    
@app.route('/rules')
def get_rules():
    rules=json.load(open(f'{os.getcwd()}/database/ruleset.json'))
    return json.dumps(rules)

