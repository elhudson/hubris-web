import * as dialog from "@radix-ui/react-dialog";

export default ({ trigger, children }) => {
  return (
    <dialog.Root>
      <dialog.Trigger>{trigger}</dialog.Trigger>
      <dialog.Portal>
        <dialog.Overlay className="overlay"/>
        <dialog.Content
          className={"shadow popup"}>
          {children}
        </dialog.Content>
      </dialog.Portal>
    </dialog.Root>
  );
};
