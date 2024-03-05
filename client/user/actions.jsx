import { useUser } from "contexts";

export default () => {
  const user = useUser();
  const menu = [];
  user.logged_in &&
    menu.push(
      {
        label: "My Stuff",
        action: () => window.location.assign(`/${user.username}/creations`)
      },
      {
        label: "Create New...",
        children: [
          {
            label: "New Character",
            action: () =>
              window.location.assign(`/${user.username}/create/character`)
          },
          {
            label: "New Campaign",
            action: () =>
              window.location.assign(`/${user.username}/create/campaign`)
          }
        ]
      },
      {
        label: "Log Out",
        action: () => window.location.assign("/logout")
      }
    );

  return menu;
};
