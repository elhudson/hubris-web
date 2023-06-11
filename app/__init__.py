from flask import Flask, render_template, request, url_for, redirect, session, current_app, g
import json
from flask_session import Session
from srd.tools import NpEncoder
from srd.character import create_character
import sqlalchemy as sqa
import pandas as pd


app = Flask(__name__)
app.config.from_file('config.json',load=json.load)
from app import home