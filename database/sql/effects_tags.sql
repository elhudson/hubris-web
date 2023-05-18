SELECT effects.id, effects.title
FROM effects
JOIN __effects__tags ON effects.id=__effects__tags.effects
WHERE tier='T1'



SELECT class_paths.title AS tit, class_features.title
FROM class_features 
INNER JOIN class_paths ON class_features.path=class_paths.id

SELECT class_paths FROM class_features

SELECT class_features.id as fid
FROM class_features 
JOIN class_paths ON class_features.classes=class_paths.classes

SELECT class_paths.title as path
FROM class_paths
JOIN classes ON class_paths.classes=classes.id

CREATE TABLE __characters__ranges(char_id varchar(255), ranges_id varchar(255))


CREATE TABLE __characters__durations(char_id varchar(255), durations_id varchar(255))


CREATE TABLE __characters__class_features(char_id varchar(255), class_features_id varchar(255))


CREATE TABLE __characters__classes(char_id varchar(255), class_id varchar(255))


CREATE TABLE __characters__tag_features(char_id varchar(255), tag_features_id varchar(255))


CREATE TABLE __characters__skills(char_id varchar(255), skills_id varchar(255))


CREATE TABLE __characters__backgrounds(char_id varchar(255), backgrounds_id varchar(255))

ALTER TABLE characters DROP skills