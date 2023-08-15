import json
from from_notion import Database  
from notion_client import Client
from db_connect import address
from to_json import rulesetify
from sqlalchemy import create_engine

engine=create_engine(address)
configs=json.load(open('db_config.json'))

# notion=Client(auth=configs['NOTION_TOKEN'])
# hubris=Database(configs['NOTION_DB'],configs)
# hubris.populate(notion)
# hubris.sqlify()
# hubris.write_tables(engine)

rulesetify(configs, engine)