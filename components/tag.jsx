import Icon from "@ui/icon";
import Tooltip from "@ui/tooltip";

export default ({ id, title }) => {
  return (
    <Tooltip
      preview={
        <Icon
          id={id}
          sz={17}
        />
      }>
      {title}
    </Tooltip>
  );
};

