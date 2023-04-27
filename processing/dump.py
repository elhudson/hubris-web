import json
import numpy as np

home="/home/el_hudson/projects/HUBRIS"

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def dump_json(chardata):
    file_name=chardata.name.replace(" ","_").lower()
    charpath=home+f"/web/static/characters/{file_name}.json"
    c=f"./static/characters/{file_name}.json"
    f=open(charpath,"w")
    json.dump(chardata.jsonready,f,cls=NpEncoder)
    return c