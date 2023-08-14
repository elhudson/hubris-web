from flask import session, render_template, request, redirect, url_for, app
from srd.ruleset import all_in_table
from srd.character import create_character, fetch_character, deserialize_character
from srd.tools import in_dev
import uuid
import json

from HUBRIS import app

