import mimetypes
mimetypes.add_type('application/javascript', '.js')
import json
from flask import Flask, redirect, request, render_template, session, url_for, make_response
import os
import uuid
from db_connect import address

from flask_vite import Vite
from vite.views import bp
from filesystem import Database

app = Flask(__name__)
vite=Vite(app)
app.secret_key=os.urandom(19)
app.register_blueprint(bp)
app.database=Database(address)
app.database.create_engine()

@app.route("/new_character")
def init_character():
    args=request.args
    user=args.get('user')
    char_id=str(uuid.uuid4())
    data={'id':char_id, 'user':user, 'url':url_for('vite.creation', character=char_id, stage='class')}
    app.database.save_character(data, user)
    return json.dumps(data)

@app.route('/user')
def get_characters():
    i=request.args.get('user')
    return app.database.get_usr_characters(i)

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
        return redirect(url_for('vite.wizard',error='account-exists'))

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
            'url':url_for('vite.my_characters', user=user_id),
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

    
