import { useUser } from "@contexts/user";

export default () => {
  const user = useUser();
  return [
    {
      label: "New Character",
      action: () => window.location.assign(`/characters/${user.username}/create`)
    },
    {
      label: "New Campaign",
      action: () => window.location.assign(`/campaigns/${user.username}/create`)
    }
  ];
};
