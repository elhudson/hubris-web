import * as alert from "@radix-ui/react-alert-dialog";
export default ({ button, confirm, children }) => {
  return (
    <alert.Root>
      <alert.Trigger>{button}</alert.Trigger>
      <alert.Portal>
        <alert.Overlay className="overlay" />
        <alert.Content className="popup">
          {children}
          <alert.Cancel className="cancel">Never mind</alert.Cancel>
          <alert.Action onClick={confirm}>Confirm</alert.Action>
        </alert.Content>
      </alert.Portal>
    </alert.Root>
  );
};
