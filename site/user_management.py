from flask import session, render_template, request, redirect, url_for, flash
from srd.character import create_character
from pandas import read_sql
from sqlalchemy import text, exc
from itertools import chain
import uuid

from HUBRIS import app


@app.route('/login',methods=['POST'])
def login():
    username=request.form.get('username')
    password=request.form.get('password')
    q=read_sql(text(f"SELECT * FROM users WHERE username='{username}'"),app.database)
    if q.empty or q['password'][0]!=password:
        return render_template('home.html',error='Incorrect password; please try again.')
    else:
        session['user_id']=read_sql(text(f"SELECT id FROM users WHERE username='{username}'"),app.database)['id'][0]
        return redirect(url_for('my_characters'))

@app.route('/characters',methods=['GET','POST'])
def my_characters():
    if request.method=='GET':
        user_id=session.get('user_id')
        ids=list(chain(*read_sql(text(f"SELECT id FROM characters WHERE user='{user_id}'"),app.database).values.tolist()))
        chars=[create_character(id,app.database) for id in ids]
        return render_template('characters.html',characters=chars)
    if request.method=='POST':
        id=request.form['character_selection']
        return redirect(url_for('sheet',character_id=id))

@app.route('/new_user',methods=['GET','POST'])
def new_user():
    if request.method=='GET':
        return render_template('new_user.html')
    if request.method=='POST':
        username=request.form.get('username')
        password=request.form.get('password')
        user_id=uuid.uuid4()
        q=text(f"INSERT INTO users VALUES('{str(user_id)}','{username}','{password}')")
        with app.database.connect() as con:
            try:
                con.execute(q)
                con.commit()
                con.close()
                session['user_id']=str(user_id)
                return redirect(url_for('my_characters'))
            except exc.IntegrityError:
                return render_template('home.html',error="Account with this username already exists. If you forgot your password, ping El on Discord and she'll get it for you.")
