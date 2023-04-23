import sqlalchemy as sqa
import sqlite3
import json
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="sticky_note.env")
con=sqa.create_engine(f"sqlite:///{os.getenv('DB_PATH')}").connect()

archie={"id":"abc","name":"Archie Radcliffe","str":"-1","dex":"4","con":"0","int":"5","wis":"-2","cha":"3","attributes":"null","backgrounds":"83c7f04e-d03f-478a-b7c2-04c173c640d7,d337469c-51a9-4e1b-ab60-3712745f1c28","class_features":"3b095b3a-2ec4-48f8-8e71-a4564a611bca,6b484d06-7af3-4598-9999-3a55e8405bdf","classes":"63237e64-e287-4619-a286-e62e0d52ee4a","durations":"5cd109a9-52a4-4e5a-80e7-07ca0643c977,5a5197f2-b212-464e-9631-b131f4b1c639","effects":"07cfaefa-a707-40cd-b48d-265bca17e055,a5647756-a057-4017-ae88-09ba273c8315","ranges":"5c3075fc-d223-4683-9287-33ddffa9ee1a,9fc5e86c-665d-44ea-8bbf-1b3ddd9bcd54","skills":"1fa2dac5-59d3-4353-b8dc-1fb5d8f03c34,41f2bca1-7e61-4c4a-a18a-54ef2e5e5ea5,4c0961a0-b36b-4425-ad3d-d00cbf6f1f73","tag_features":"","tags":"b5f1bdd7-c831-4eee-bdfd-d5bbf672ce69"}
archie.keys()
rels={}
for k in archie.keys():
    if len(archie[k].split(","))>1:
        rels[k]=archie[k].split(",")
chid=archie["id"]

def gen():
    for rel in rels.keys():
        tabl_name="__characters__"+rel
        sql=f'''CREATE TABLE {tabl_name} (character_id varchar(255), {rel}_id varchar(255))'''
        con.execute(sqa.text(sql))
        con.commit()

def delete():
    for rel in rels.keys():
        tabl_name="__characters__"+rel
        sql=f'''DROP TABLE {tabl_name}'''
        con.execute(sqa.text(sql))
        con.commit()

def tabl():
    for rel in rels.keys():
        tabl_name="__characters__"+rel
        for r in rels[rel]:
            sql=f'''INSERT INTO {tabl_name} (character_id, {rel}_id) VALUES ('{chid}', '{r}')'''
            con.execute(sqa.text(sql))
            con.commit()