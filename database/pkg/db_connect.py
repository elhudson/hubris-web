import json
import sshtunnel
import sqlalchemy
import pandas as pd
import os

address=f"mysql+pymysql://ehudson19:cicero63@ehudson19.mysql.pythonanywhere-services.com/ehudson19$HUBRIS"

host='ssh.pythonanywhere.com'
username='ehudson19'
password='cicero63'
passphrase='cicero63'
dbar='ehudson19.mysql.pythonanywhere-services.com'

def tunnel():
    server = sshtunnel.SSHTunnelForwarder(
        ('ssh.pythonanywhere.com'),
        ssh_username='ehudson19', 
        ssh_password='cicero63',
        remote_bind_address=(dbar, 3306) ) 
    server.start()
    return server


def engine(server):
    configs=json.load(open(os.path.abspath(os.curdir)+'/database/db_config.json'))
    local_port = str(server.local_bind_port)
    engine = sqlalchemy.create_engine(f"mysql+pymysql://{configs['SERVER_USERNAME']}:{configs['DB_PWD']}@127.0.0.1:{local_port}/{configs['DB_NAME']}")
    return engine

