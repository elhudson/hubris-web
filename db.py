from typing import Dict 
from datetime import datetime
import json
from uuid import uuid4
from db_connect import engine, tunnel, address
from sqlalchemy import String, JSON, create_engine, select, delete, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship, Session

from sqlalchemy.exc import IntegrityError

class UserError(LookupError):
    def __init__(self, msg):
        codes={
            'id-exists':'A user with that ID hash already exists.',
            'username-exists':'A user with that username already exists.',
            'bad-password':'That password was incorrect.',
            'no-id':'A user with that ID hash does not exist.',
            'no-user':'A user with that username does not exist.'
        }
        return super().__init__(codes[msg])
    

class CharacterError(LookupError):
    def __init__(self, msg):
        codes={
            'instance-exists':'An instance with that ID hash already exists',
            'not-found':'A character with that ID does not exist.'
        }
        return super().__init__(codes[msg])

class Base(DeclarativeBase):
    pass


            
class User(Base):
    __tablename__='users'
    
    id:Mapped[str]=mapped_column(String(36),primary_key=True)
    username:Mapped[str]=mapped_column(String(120))
    password:Mapped[str]=mapped_column(String(120))
    
    @staticmethod 
    def validate(engine, data):
        print(data)
        stmt=(select(User)
              .where(User.username==data['username'])
              .where(User.password==data['password']))
        with Session(engine) as session:
            res=session.scalar(stmt)
            if res==None:
                raise UserError('bad-password')
            else:
                return res
    
    @staticmethod
    def get(engine, username):
        stmt=select(User).where(User.username==username)
        with Session(engine) as session:
            res=session.scalar(stmt)
            if res==None:
                raise UserError('no-user')
            else:
                return res
            
    @staticmethod
    def set(engine, data):
        usr=User(id=data['id'], username=data['username'], password=data['password'])
        with Session(engine) as session:
            try:
                session.add(usr)
                session.commit()
            except IntegrityError:
                raise UserError('id-exists')
        
    

class Character(Base):
    __tablename__='characters'
    
    body:Mapped[Dict]=mapped_column(JSON)
    instance:Mapped[str]=mapped_column(String(36), primary_key=True)
    id:Mapped[str]=mapped_column(String(36))
    user:Mapped[str]=mapped_column(String(36))
    timestamp:Mapped[datetime]=mapped_column(DateTime, index=True)
    
    @staticmethod
    def get(engine, id):
        latest_save=select(func.max(Character.timestamp)).where(Character.id==id)
        with Session(engine) as session:
            timestamp=session.scalar(latest_save)
            stmt=select(Character.body).where(Character.timestamp==timestamp).where(Character.id==id)
            return session.scalar(stmt)
    
    @staticmethod
    def set(engine, data):
        ch=Character(body=data, id=data['id'], user=data['user'], instance=str(uuid4()), timestamp=datetime.now())
        with Session(engine) as session:
            session.add(ch)
            session.commit()
            
    @staticmethod
    def delete(engine, id):
        stmt=delete(Character).where(Character.id==id)
        with Session(engine) as session:
            session.execute(stmt) 
            session.commit() 
            
    @staticmethod 
    def by_user(engine, user):
        stmt=(
              select(Character.id)
              .where(user==Character.user)
        )
        with Session(engine) as session:
            ids=list(set(session.scalars(stmt)))
            return [Character.get(engine, i) for i in ids]