from flask import request,render_template,g,redirect,url_for
import sqlalchemy as sqa
from srd.character import create_character
import pandas as pd
from app import app 

@app.route("/", methods=('GET','POST'))
def homepage():
    if request.method== 'GET':
        return render_template("home.html")
    if request.method=='POST':
        if 'db' not in g:
            g.db=sqa.create_engine(app.config['DATABASE'])
        name=request.form["char_name"]
        query=sqa.text(f'SELECT id FROM characters WHERE name="{name}"')
        id=pd.read_sql(query,g.db).values.tolist()[0][0]
        character=create_character(id,g.db)
        app.session["character"]=character
        return redirect(url_for('sheet'))