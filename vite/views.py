from flask import Blueprint

bp = Blueprint('vite', __name__, static_folder='dist', static_url_path='/')

@bp.route("/create")
def creation():
    return bp.send_static_file("index.html")

@bp.route("/sheet")
def sheet():
    return bp.send_static_file("index.html")

@bp.route("/levelup")
def spend_xp():
    return bp.send_static_file("index.html")

@bp.route("/")
def wizard(error=None):
    return bp.send_static_file("index.html")
    
@bp.route('/characters')
def my_characters():
    return bp.send_static_file('index.html')
