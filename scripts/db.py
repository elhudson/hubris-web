import json
from db_connect import engine, tunnel
from sqlalchemy import text
import sqlalchemy as s
import sqlalchemy.orm as o

engine=engine(tunnel())
meta=s.MetaData()

r=json.load(open('/home/el_hudson/projects/hubris-dev/hubris-web/database/ruleset.json'))

characters=s.Table('characters',meta,s.Column('id', s.String, primary_key=True),s.Column('user', s.String),s.Column('data', s.JSON))

class Base(o.DeclarativeBase):
    pass

class Characters(Base):

    __tablename__='characters'

    id: o.Mapped[str]=o.mapped_column(s.String, primary_key=True)
    user: o.Mapped[str]=o.mapped_column(s.String)
    data: o.Mapped[dict]=o.mapped_column(s.JSON)

with o.Session(engine) as session:
    test=Characters(
        id='test',
        user='test',
        data=r
    )
    session.commit()