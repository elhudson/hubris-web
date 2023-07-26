import mimetypes
mimetypes.add_type('application/javascript', '.js')

from flask import Flask
from flask_session import Session
import os
from srd.entry import EntryEncoder
from srd.tools import parse_path
import sqlalchemy as sqa
from filters import *
from db_connect import engine, tunnel, file_putter

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.config["SESSION_TYPE"]='filesystem'
app.jinja_env.filters['listify']=listify
app.json_encoder=EntryEncoder
parse_path(app)
Session(app)

tunnel=tunnel()
app.database=engine(tunnel)
app.ftp=file_putter()


from user_management import *
from character_management import *
from character_creation import *