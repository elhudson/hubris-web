import json
import sshtunnel
import sqlalchemy
import pandas as pd
import os
import paramiko

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

cli=paramiko.SSHClient()
cli.set_missing_host_key_policy(paramiko.AutoAddPolicy)
cli.connect(hostname=host, username=username, password=password, passphrase=passphrase)

def engine(server):
    configs=json.load(open('/home/el_hudson/projects/HUBRIS/database/db_config.json'))
    local_port = str(server.local_bind_port)
    engine = sqlalchemy.create_engine(f"mysql+pymysql://{configs['SERVER_USERNAME']}:{configs['DB_PWD']}@127.0.0.1:{local_port}/{configs['DB_NAME']}")
    return engine

