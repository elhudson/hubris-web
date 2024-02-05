
export async function get_tables(client) {
    return await client.databases
      .query({
        database_id: process.env.NOTION_DB
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
  
  export const property_parser = ([label, data]) => {
    var extracted;
    const handler = (property, alg) => {
      try {
        return alg(property);
      } catch (Error) {
        return property.type == "number" ? 0 : "";
      }
    };
    switch (data.type) {
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
        extracted = handler(data, (d) => d.relation.map((a) => a.id));
        break;
      }
    }
    return [sql_safe(label), extracted];
  };
  