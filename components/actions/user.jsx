import { useUser } from "@contexts/user";

export default () => {
  const user = useUser();
  return [
    {
      label: "New Character",
      action: () => window.location.assign(`/${user.username}/create/character`)
    },
    {
      label: "New Campaign",
      action: () => window.location.assign(`/${user.username}/create/campaign`)
    }
  ];
};
