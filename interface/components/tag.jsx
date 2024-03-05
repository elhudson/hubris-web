import { Icon, Tooltip } from "@interface/ui";

export default ({ id, title }) => {
  return (
    <Tooltip
      preview={
        <Icon
          id={id}
          sz={17}
        />
      }
    >
      {title}
    </Tooltip>
  );
};
