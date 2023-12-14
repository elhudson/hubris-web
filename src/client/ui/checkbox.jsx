import * as Checkbox from '@radix-ui/react-checkbox';

export default ({label, checked}) => (
  <Checkbox.Root checked={checked}>
    <Checkbox.Indicator>X</Checkbox.Indicator>
  </Checkbox.Root>
);
