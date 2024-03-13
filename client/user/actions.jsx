import { useNavigate } from "react-router-dom";
import { useUser } from "contexts";

export default () => {
  const user = useUser();
  const navigate=useNavigate()
  const menu = [];
  user.logged_in &&
    menu.push(
      {
        label: "My Stuff",
        action: () => navigate(`/user/${user.username}`),
      },
      {
        label: "Create New...",
        children: [
          {
            label: "New Character",
            action: () => navigate(`/character/create`),
          },
          {
            label: "New Campaign",
            action: () => navigate(`/campaign/create`),
          },
        ],
      },
      {
        label: "Log Out",
        action: () => window.location.assign("/logout"),
      }
    );

  return menu;
};
