import json
from database import Database  
from notion_client import Client
from db_connect import address
from database.to_json import 

notion=Client(auth=configs['NOTION_TOKEN'])

hubris=Database(configs['NOTION_DB'],configs)
hubris.populate(notion)
hubris.sqlify()
hubris.write_tables(engine)