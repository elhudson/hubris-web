import { Client } from "@notionhq/client";

import "dotenv/config";

import _ from "lodash";

import { get_schema } from "~database/schema.js";
import { sql_safe } from "~database/utils.js";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

export async function get_tables(client) {
  return await client.databases
    .query({
      database_id: process.env.NOTION_CORE_RULES
    })
    .then((r) =>
      r.results
        .filter((r) => r.object == "database")
        .map(
          async (r) => await client.databases.retrieve({ database_id: r.id })
        )
    )
    .then((r) => Promise.all(r));
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const property_parser = async ([label, data], client = null) => {
  var extracted;
  const handler = (property, alg) => {
    try {
      return alg(property);
    } catch (Error) {
      return property.type == "number" ? 0 : "";
    }
  };
  switch (data.type) {
    case "formula": {
      extracted = label.includes("Id")
        ? await get_linked_page(data.formula.string, client)
        : handler(data, (d) => [
            {
              index: 0,
              plaintext: d.formula.string
            }
          ]);
      break;
    }
    case "title": {
      extracted = handler(data, (d) => d.title[0].plain_text);
      break;
    }
    case "checkbox": {
      extracted = handler(data, (d) => (d.checkbox == true ? true : false));
      break;
    }
    case "rich_text": {
      extracted = handler(data, (d) => {
        return parse_block(d);
      });
      break;
    }
    case "select": {
      extracted = handler(data, (d) =>
        label == "Tier"
          ? Number(d.select.name.split("T").at(-1))
          : d.select.name
      );
      break;
    }
    case "number": {
      extracted = handler(data, (d) => d.number);
      break;
    }
    case "relation": {
      const ids = data.relation.map((a) => a.id);
      const ps = [];
      for (var id of ids) {
        const obj = await get_linked_page(id, client);
        ps.push(obj);
      }
      extracted = ps;
      break;
    }
  }
  return [sql_safe(label.replace("Id", "")), extracted];
};

async function get_linked_page(id, client) {
  const res = await get_page(client, id);
  const props = await Promise.all(
    Object.entries(res.properties)
      .filter((f) => f[1].type != "relation" && !f[0].includes("Id"))
      .map((prop) => property_parser(prop, client))
  );
  const obj = {
    id: res.id,
    ...Object.fromEntries(props)
  };
  // const desc = await get_description(id, client);
  // obj.description = desc;
  return obj;
}

export const get_page = async (cl, id) => {
  return await cl.pages
    .retrieve({
      page_id: id
    })
    .catch(async (err) => {
      console.log(err);
      if (err?.status == 429) {
        await sleep(1000 * err.headers["retry-after"]);
        return await get_page(cl, id);
      }
    });
};

const parse_block = (block) => {
  const self = [];
  if (block?.type == "paragraph") {
    block.paragraph.rich_text.forEach((node) => {
      const item = {
        plaintext: node.plain_text
      };
      if (node.type == "mention" && node?.mention.page?.id) {
        item.link = {
          target: {
            title: node.plain_text,
            id: node.mention.page.id
          }
        };
      }
      self.push(item);
    });
  }
  if (block?.has_children) {
    self.push(...parse_block(block.children));
  }
  return self.map((s) => ({
    ...s,
    index: self.indexOf(s)
  }));
};

export async function get_description(id, client) {
  const { results } = await client.blocks.children
    .list({
      block_id: id
    })
    .catch(async (err) => {
      console.log(err);
      if (err?.status == 429) {
        await sleep(1000 * err.headers["retry-after"]);
        return await get_description(id, client);
      }
    });
  const res = _.flatMap(results, (p) => parse_block(p));
  return res;
}

export async function parse_page(page, client, filter = []) {
  var props = Object.entries(page.properties);
  filter.length > 0 && (props = props.filter((f) => filter.includes(f)));
  const obj = {
    id: page.id
  };
  for (var [label, data] of props) {
    const [field, info] = await property_parser([label, data], client);
    obj[field] = info;
  }
  return obj;
}

export function get_fields(table_name) {
  const schema = get_schema(table_name);
  return {
    scalars: schema.fields
      .filter((f) => f.kind == "scalar")
      .map((f) => f.name)
      .filter((f) => !f.includes("Id")),
    ones: schema.fields
      .filter(
        (f) => f.kind == "object" && f.name != "entry" && f.isList == false
      )
      .map((f) => f.name),
    manys: schema.fields
      .filter((f) => f.kind == "object" && f.isList)
      .map((f) => f.name)
  };
}

export function make_query({ ones, manys }, data) {
  return {
    ...data,
    ...Object.fromEntries(
      manys
        .filter((r) => _.has(data, r))
        .map((r) => [
          r,
          {
            connectOrCreate: data[r].map((tie) => ({
              where: {
                id: tie.id
              },
              create: tie
            }))
          }
        ])
    ),
    ...Object.fromEntries(
      ones
        .filter((r) => _.has(data, r))
        .map((r) => [
          r,
          {
            connectOrCreate: {
              where: {
                id: data[r][0].id
              },
              create: data[r][0]
            }
          }
        ])
    )
  };
}
