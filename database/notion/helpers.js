import { sql_safe } from "utilities";
import _ from "lodash";
import { createBlockRenderer, NotionRenderer } from "@notion-render/client";
import { get_description } from "./downloader.js";
import { parse } from "uuid";
import dash from 'add-dashes-to-uuid'

export async function get_tables(client) {
  return await client.databases
    .query({
      database_id: process.env.NOTION_CORE_RULES,
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

function sleep(ms) {
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
        ? await get_linked_page(dash(data.formula.string), client)
        : handler(data, (d) => d.formula.string);
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
        var str = "";
        for (var part of d.rich_text) {
          if (part.type == "text") {
            str += part.plain_text;
          }
          if (part.type == "mention") {
            str += `[[${part.plain_text}|${part.mention.page.id}]]`;
          }
        }
        return str;
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
  return [sql_safe(label.replace('Id', '')), extracted];
};

async function get_linked_page(id, client) {
  const res = await get_page(client, id);
  const props = await Promise.all(
    Object.entries(res.properties)
      .filter((f) => f[1].type != "relation" && !f[0].includes('Id'))
      .map((prop) => property_parser(prop, client))
  );
  const obj = {
    id: id,
    ...Object.fromEntries(props),
  };
  const desc = await get_description(id, client);
  obj.description = desc;
  return obj;
}

export const get_page = async (cl, id) => {
  return await cl.pages
    .retrieve({
      page_id: id,
    })
    .catch(async (err) => {
      console.log(err);
      await sleep(3000);
      return await get_page(cl, id);
    });
};
