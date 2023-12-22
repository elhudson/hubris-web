import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";

export default ({ id, name }) => {
  return (
    <Tooltip
      preview={
        <Icon
          id={id}
          sz={17}
        />
      }>
      {name}
    </Tooltip>
  );
};

