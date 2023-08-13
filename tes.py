import json
import db_connect
import sqlalchemy
import json
import requests
import pandas as pd
con=db_connect.engine(db_connect.tunnel()).connect()

query=sqlalchemy.text('''SELECT * FROM characters''')
