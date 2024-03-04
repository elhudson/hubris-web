import Dialog from "@ui/dialog";
import _ from "lodash";
import Item from "@items/item";

export default ({ table }) => {
  var add;
  if (table == "weapons") {
    add = {
      name: "",
      martial: false,
      heavy: false,
      tags: []
    };
  }
  if (table == "armor") {
    add = {
      name: "",
      class: "None"
    };
  }
  if (table == "items") {
    add = { name: "" };
  }
  return (
    <Dialog trigger={<button>New Item</button>}>
      <Item
        data={add}
        type={table}
      />
    </Dialog>
  );
};
