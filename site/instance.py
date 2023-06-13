from flask import Flask
from flask_session import Session
import os
from srd import tools
import sqlalchemy as sqa

def create_app():
    app = Flask(__name__)
    app.secret_key=os.urandom(19)
    app.config["SESSION_TYPE"]='filesystem'
    app.json_encoder=tools.CharacterEncoder
    APP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app.template_folder = os.path.join(APP_PATH, 'templates/')
    app.static_folder= os.path.join(APP_PATH, 'static/')
    app.database=sqa.create_engine("sqlite:///"+os.environ['PWD']+"/database/HUBRIS.db")
    Session(app)
    return app

app=create_app()