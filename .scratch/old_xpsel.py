paths_query=sqa.text(f'''
        SELECT class_paths.id as path
        FROM class_paths
        JOIN classes ON class_paths.classes=classes.id
        WHERE classes.name='{character.classes[0].name}'
        ''')
        paths=list(chain(*pd.read_sql(paths_query,con).values.tolist()))
        class_features={}
        for path in paths:
            path_name=list(chain(*pd.read_sql(sqa.text(f'''
            SELECT name
            FROM class_paths
            WHERE id='{path}'
            '''),con).values.tolist()))[0]
            classes_query=sqa.text(f'''
            SELECT DISTINCT class_features.id AS feature_id
            FROM class_features 
            WHERE class_features.classes='{character.classes[0].id}' 
            AND class_features.class_paths='{path}'
            AND tier='T1' ''')
            classes_ids=list(chain(*pd.read_sql(classes_query,con).values.tolist()))
            features=[]
            for class_id in classes_ids:
                ent=create_entry("class_features",class_id,con)
                ent.build_extensions(con)
                features.append(ent)
            class_features[path_name]=features
        c=character.classes[0].build_core(con)
        character.classes[0].build_plural_relations(con)
        char_tags=[tag.id for tag in character.classes[0].tags]
        tag_features={}
        for tag in char_tags:
            features=[]
            tag_query=sqa.text(f'''
            SELECT id 
            FROM tag_features 
            WHERE tags='{tag}' 
            AND tier='T1' 
            ORDER BY xp asc''')
            result=list(chain(*pd.read_sql(tag_query,con).values.tolist()))
            for r in result:
                entry=create_entry("tag_features",r,con)
                entry.build_extensions(con)
                features.append(entry)
            tag_name=list(chain(*pd.read_sql(sqa.text(f'''
            SELECT name
            FROM tags
            WHERE id='{tag}'
            '''),con).values.tolist()))[0]
            tag_features[tag_name]=features
        effects={}
        effects["Buffs"]=[]
        effects["Debuffs"]=[]
        effects["Damage/Healing"]=[]
        for tag in char_tags:
            effect_query=sqa.text(f'''
            SELECT id
            FROM effects
            JOIN __tags__effects ON effects.id=__tags__effects.effects
            WHERE tier='T1'
            AND tags='{tag}'
            ''')
            result=list(chain(*pd.read_sql(effect_query,con).values.tolist()))
            for r in result:
                f=create_entry("effects",r,con)
                f.build_extensions(con)
                for tree in effects.keys():
                    if hasattr(f,"tree"):
                        if f.tree==tree:
                            effects[tree].append(f)