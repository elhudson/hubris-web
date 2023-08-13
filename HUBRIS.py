import mimetypes
mimetypes.add_type('application/javascript', '.js')

from flask import Flask, redirect, request
from flask_session import Session
import os
from srd.entry import EntryEncoder
from srd.tools import parse_path
import sqlalchemy as sqa
from filters import *
from db_connect import engine, tunnel

app = Flask(__name__)
app.secret_key=os.urandom(19)
app.config["SESSION_TYPE"]='filesystem'
app.jinja_env.filters['listify']=listify
app.template_folder='./web/pages'
parse_path(app)
Session(app)

tunnel=tunnel()
app.database=engine(tunnel)



class Database:
    def __init__(self, tunnel):
        self.connection=tunnel
    def reconnect(self):
        self.connection=engine(tunnel())

from user_management import *
from character_management import *
from character_creation import *