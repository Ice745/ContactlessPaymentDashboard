import Home from "./pages/Home/Home";
// import Profile from "views/examples/Profile.js";
import Transactions from "./pages/Transactions/transactions";
// import Tables from "views/examples/Tables.js";
import Users from "./pages/Users/users";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Home,
    layout: "/admin"
  },
  {
    path: "/users",
    name: "Users",
    icon: "ni ni-archive-2 text-blue",
    component: Users,
    layout: "/admin"
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: "ni ni-books text-orange",
    component: Transactions,
    layout: "/admin"
  },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin"
  // },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin"
  // },
];
export default routes;
