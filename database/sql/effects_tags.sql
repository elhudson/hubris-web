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