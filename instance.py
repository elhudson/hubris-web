from flask import Flask
from flask_session import Session
import os
from srd import tools
import sqlalchemy as sqa
import json
from importlib import import_module

def create_app():
    app = Flask(__name__)
    app.secret_key=os.urandom(19)
    app.config["SESSION_TYPE"]='filesystem'
    app.json_encoder=tools.CharacterEncoder
    app.database=sqa.create_engine("sqlite:///"+os.environ['PWD']+"/database/HUBRIS.db")
    Session(app)
    return app

