from flask import session, render_template, Response, request, redirect, url_for, flash
from srd.character import create_character
from pandas import read_sql
from sqlalchemy import text, exc
from itertools import chain
import os
import uuid
import json
from werkzeug import exceptions
from db_connect import tunnel, engine
from HUBRIS import app
import requests
import gzip


