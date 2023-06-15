from flask import Flask
from flask_session import Session
import os
from srd import tools
import sqlalchemy as sqa

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.config["SESSION_TYPE"]='filesystem'
app.json_encoder=tools.CharacterEncoder
if 'el_hudson' in os.path.expanduser('~'):
    app.database=sqa.create_engine("sqlite:///"+os.path.expanduser('~')+"/projects/hubris-database/HUBRIS.db")
else:
    app.database=sqa.create_engine("sqlite:///"+os.path.expanduser('~')+"/hubris-database/HUBRIS.db")
Session(app)

from user_management import *
from character_management import *
from character_creation import *