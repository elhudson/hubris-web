import sqlite3
import pandas as pd
import numpy as np
import sys
import json

db_path="/storage/HUBRIS.db"

from db import generate_abilities, feature, skill_proficiency, power, effect, duration, rng, background, tag_feature, class_feature, pcclass

class Character:
    def __init__(self,id,con):
        sql=f'SELECT * FROM characters WHERE player="{player}"'
        df=pd.read_sql(sql,con)
        self.str=df["str"][0]
        self.dex=df["dex"][0]
        self.con=df["con"][0]
        self.int=df["int"][0]
        self.wis=df["wis"][0]
        self.cha=df["cha"][0]
        self.name=df["name"][0]
        self.xp_earned=df["xp_earned"][0]
        self.xp_spent=df["xp_spent"][0]
        self.alignment=df["alignment"][0]
        self.ability_ids=df["abilities"][0] 
        self.char_class={}
        self.backgrounds={}
        self.effects={}
        self.ranges={}
        self.durations={}
        self.skills={}
        self.tag_features={}
        self.class_features={}

        self.define_abilities(con)
        self.bin_abilities()
        self.set_tier()
        self.set_hp_max()
        
        del self.abilities
        del self.ability_ids

        self.json_prep()
          
    def define_abilities(self,con):
        ids_list=self.ability_ids.split(",")
        abs=generate_abilities(ids_list,con)
        d={v: k for v, k in enumerate(abs)}
        self.abilities=d

    def set_tier(self):
        spent=self.xp_spent
        self.tier=None
        if 0<spent<=25:
            self.tier=1
        elif 25<spent<=75:
            self.tier=2
        elif 75<spent<=135:
            self.tier=3
        elif 135<spent:
            self.tier=4
        
    def set_hp_max(self):
        self.hp_max=(3*(self.tier))+self.con


    def bin_abilities(self):
        for ability_index in self.abilities.keys():
            ability=self.abilities[ability_index]
            if type(ability)==background:
                target=self.backgrounds
            if type(ability)==pcclass:
                target=self.char_class
            if type(ability)==effect:
                target=self.effects
            if type(ability)==rng:
                target=self.ranges
            if type(ability)==duration:
                target=self.durations
            if type(ability)==skill_proficiency:
                target=self.skills
            if type(ability)==tag_feature:
                target=self.tag_features
            if type(ability)==class_feature:
                target=self.class_features
            target_length=len(target.keys())
            slot=target_length+1
            target[slot]=ability
    
    def json_prep(self):
        master={}
        for attr in self.__dict__.keys():
            if type(self.__dict__[attr])!=dict:
                master[attr]=self.__dict__[attr]
            if type(self.__dict__[attr])==dict:
                container={}
                for item in self.__dict__[attr].keys():          
                   base_dict=self.__dict__[attr][item].__dict__
                   for key in base_dict.copy().keys():
                       if key=="rec":
                           del base_dict[key]
                   container[item]=base_dict
                master[attr]=container
        self.jsonready=master
        
