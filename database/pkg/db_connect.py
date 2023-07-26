import json
import sshtunnel
import sqlalchemy
import pandas as pd
import os
import paramiko

address=f"mysql+pymysql://ehudson19:cicero63@ehudson19.mysql.pythonanywhere-services.com/ehudson19$HUBRIS"


def tunnel():
    configs=json.load(open('/home/el_hudson/projects/HUBRIS/database/db_config.json'))
    server = sshtunnel.SSHTunnelForwarder(
        ('ssh.pythonanywhere.com'),
        ssh_username=configs['SERVER_USERNAME'], 
        ssh_password=configs['SERVER_PWD'],
        remote_bind_address=(configs['DB_ADDRESS'], 3306) ) 
    server.start()
    return server

def engine(server):
    configs=json.load(open('/home/el_hudson/projects/HUBRIS/database/db_config.json'))
    local_port = str(server.local_bind_port)
    engine = sqlalchemy.create_engine(f"mysql+pymysql://{configs['SERVER_USERNAME']}:{configs['DB_PWD']}@127.0.0.1:{local_port}/{configs['DB_NAME']}")
    return engine

def file_putter():
    configs=json.load(open('/home/el_hudson/projects/HUBRIS/database/db_config.json'))
    ssh_client = paramiko.SSHClient() 
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy()) 
    ssh_client.connect(
        'ssh.pythonanywhere.com',
        username=configs['SERVER_USERNAME'],
        password=configs['SERVER_PWD'])
    return ssh_client