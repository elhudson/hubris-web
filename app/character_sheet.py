from app import app
from flask import render_template
@app.route("/sheet")
def sheet():
    character=app.Session.get("character")
    character.to_file()
    return render_template("sheet.html",character=character)

