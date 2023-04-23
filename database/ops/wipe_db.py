import sqlalchemy as sqa
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="/home/el_hudson/Projects/HUBRIS-1/sticky_note.env")
engine=sqa.create_engine(f"sqlite:///{os.getenv('DB_PATH')}")
con=engine.connect()


def to_delete(cnx,exclude=[None],include=[None]):
    names=[]
    if include[0]!=None:
        names=include
    else:
        res=cnx.execute(sqa.text("SELECT * FROM sqlite_master"))
        for n in res:
            names.append(n[2])
        names=set(names)
        for item in exclude:
            names.remove(item)
    return names

def wipe_db(cnx,tables):
    for table in tables:
        cnx.execute(sqa.text(f"DROP TABLE {table}"))
        cnx.commit()

tbls=to_delete(con,exclude=["characters"],include=["__attributes__backgrounds","__attributes__skills","__class_features__classes"])
wipe_db(con,tbls)
con.close()