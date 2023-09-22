from flask import Blueprint, request
import mimetypes
mimetypes.add_type('application/javascript', '.js')
import json
from flask import Flask, redirect, request, render_template, session, url_for, make_response
from flask_session import Session
import os
from sqlalchemy import create_engine, text
import uuid
from db_connect import address, tunnel, engine
from pandas import read_sql
import sqlalchemy
from itertools import chain

class Database:
    def __init__(self, address):
        self.address=address
        self.storage=f'{os.path.expanduser("~")}/storage'
    def create_engine(self):
        if os.path.expanduser('~')=='/home/ehudson19':
            self.engine=create_engine(self.address)
        else:
            self.create_dev_engine()
    def create_dev_engine(self):
        self.engine=engine(tunnel())
    def run_query(self, txt):
        try:
            fr=read_sql(text(txt), self.engine) 
        except sqlalchemy.exc.OperationalError:
            self.create_engine()
            fr=read_sql(text(txt), self.engine)
        return fr
    def write_data(self, txt, obj=None):
        try:
            cnx=self.engine.connect()
        except sqlalchemy.exc.OperationalError:
            self.create_engine()
            cnx=self.engine.connect()
        if obj==None:
            cnx.execute(text(txt))
        else:
            cnx.execute(text(txt), obj)
        cnx.commit()
        cnx.close()
    def get_filename(self, char, usr):
        return f'{char}__{usr}.json'
    def get_all(self):
        return os.listdir(self.storage)
    def save_character(self, char, usr):
        with open(f'{self.storage}/{self.get_filename(char["id"], usr)}', 'w+') as blob:
            json.dump(char, blob)
    def get_usr_characters(self, usr):
        files=self.get_all()
        chars=[f for f in files if usr in f]
        char_ids=[f.split('__')[0] for f in chars]
        return char_ids
    def get_character(self, id):
        files=self.get_all()
        me=[f for f in files if id in f][0]
        usr_id=me.split('__')[1].split('.')[0]
        with open(f'{self.storage}/{me}') as loc:
            js=json.load(loc)
            js['user']=usr_id
            return js
    def as_list(self, txt):
        fr=self.run_query(txt)
        return list(chain(*fr.values.tolist()))
    def get_user(self, id):
        q=f"SELECT * FROM users WHERE id={id}"
        return self.run_query(q)
    def delete_character(self, id):
        files=self.get_all()
        me=[f for f in files if id in f][0]
        os.remove(me)
    def get_char_owner(self, char):
        char=[f for f in self.get_all() if char in f][0]
        usr=char.split('__')[1].split('.')[0]
        return usr
    def as_item(self, txt):
        fr=self.run_query(txt)
        attr=txt.split('SELECT ')[1].split(' ')[0]
        return fr[attr][0]
