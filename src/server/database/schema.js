import {
  mysqlTable,
  float,
  unique,
  uniqueIndex,
  int,
  text,
  datetime,
  date,
  json
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

const base = {
  name: text("name"),
  id: text("id").primaryKey().unique(),
  description: text("description")
};

export const tags = mysqlTable("tags", {
  ...base
});

export const effects = mysqlTable("effects", {
  ...base,
  xp: int("xp"),
  power: float("power"),
  tree: int("tree"),
  tier: int("tier")
});

export const effects_relations = relations(effects, ({ many, one }) => ({
  tags: many(tags),
  trees: one(trees, {
    fields: [effects.tree],
    references: [trees.id]
  }),
  requires: many(effects),
  required_for: many(effects)
}));

export const classes = mysqlTable("classes", {
  ...base,
  weaponry: text("weaponry"),
  armor: text("armor")
});

export const classes_relations = relations(classes, ({ many }) => ({
  tags: many(tags),
  skills: many(skills),
  abilities: many(abilities),
  class_features: many(class_features)
}));

export const abilities = mysqlTable("abilities", {
  ...base,
  skills: int("skills"),
  backgrounds: int("backgrounds")
});

export const abilities_relations = relations(abilities, ({ many }) => ({
  skills: many(skills),
  classes: many(classes)
}));

export const skills = mysqlTable("skills", {
  ...base,
  backgrounds: int("backgrounds"),
  abilities: int("abilities")
});

export const skills_relations = relations(skills, ({ one, many }) => ({
  backgrounds: one(backgrounds, {
    fields: [skills.backgrounds],
    references: [backgrounds.id]
  }),
  abilities: one(abilities, {
    fields: [skills.abilities],
    references: [abilities.id]
  }),
  classes: many(classes)
}));

export const backgrounds = mysqlTable("backgrounds", {
  ...base,
  skills: int("skills"),
  abilities: int("abilities")
});

export const backgrounds_relations = relations(backgrounds, ({ one }) => ({
  skills: one(skills, {
    fields: [backgrounds.skills],
    references: [skills.id]
  }),
  abilities: one(abilities, {
    fields: [backgrounds.abilities],
    references: [abilities.id]
  })
}));

export const tag_features = mysqlTable("tag_features", {
  ...base,
  tags: int("tags"),
  tier: int("tier")
});

export const tag_features_relations = relations(
  tag_features,
  ({ one, many }) => ({
    tags: one(tags, {
      fields: [tag_features.tags],
      references: [tags.id]
    }),
    requires: many(tag_features),
    required_for: many(tag_features)
  })
);

export const class_features = mysqlTable("class_features", {
  ...base,
  tier: int("tier"),
  classes: int("classes")
});

export const class_features_relations = relations(
  class_features,
  ({ one }) => ({
    classes: one(classes, {
      fields: [class_features.classes],
      references: [classes.id]
    })
  })
);

export const ranges = mysqlTable("range", {
  ...base,
  tier: int("tier"),
  power: float("power"),
  xp: int("xp")
});

export const ranges_relations = relations(ranges, ({ many }) => ({
  requires: many(ranges),
  required_for: many(ranges),
  trees: many(trees)
}));

export const durations = mysqlTable("duration", {
  ...base,
  tier: int("tier"),
  power: float("power"),
  xp: int("xp")
})

export const durations_relations = relations(durations, ({ many }) => ({
  requires: many(durations),
  required_for: many(durations),
  trees: many(trees)
}))

export const trees = mysqlTable("trees", {
  ...base
});

export const users = mysqlTable('users', {
  id: text('id').primaryKey().unique(),
  username: text('username'),
  password: text('password')
})

export const characters = mysqlTable('characters', {
  id: text('id'),
  instance: text('instance').primaryKey().unique(),
  created: datetime('created'),
  updated: datetime('updated'),
  bio: json('bio'),
  attributes: json('attributes'),
  progression: json('progression'),
  inventory: json('inventory'),
  user: int('user')
})

export const characters_relations = relations(characters, ({ one, many }) => ({
  user: one(users, {
    fields: [characters.user],
    references: [users.id]
  }),
  backgrounds: many(backgrounds),
  classes: many(classes),
  class_features: many(class_features),
  tag_features: many(tag_features),
  skills: many(skills),
  effects: many(effects),
  ranges: many(ranges),
  durations: many(durations)
}))

export const users_relations = relations(users, ({ many }) => ({
  characters: many(characters)
}))