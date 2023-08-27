import json
from from_notion import Database  
from notion_client import Client
from db_connect import address, tunnel, engine as eng
from to_json import rulesetify
from sqlalchemy import create_engine

configs=json.load(open('db_config.json'))
engine=eng(tunnel())

notion=Client(auth=configs['NOTION_TOKEN'])
hubris=Database(configs['NOTION_DB'],configs)
hubris.populate(notion)
hubris.sqlify()
hubris.write_tables(engine)

rulesetify(configs, engine)