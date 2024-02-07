import Dialog from "@ui/dialog";
import _ from "lodash";
import Item from "@items/item";

export default ({ table }) => {
  var add;
  if (table == "weapons") {
    add = {
      name: "",
      martial: false,
      heavy: false
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
    <Dialog trigger={"New Item"}>
      <Item
        data={add}
        type={table}
      />
    </Dialog>
  );
};
