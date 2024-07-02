import {
    faUserPlus,
    faListAlt,
    faPlus,
    faShoppingBag,
    faUsers,
    faReceipt,
    faShoppingCart,
    faTachometerAlt,
    faUserFriends

  } from "@fortawesome/free-solid-svg-icons";
export const Links = [
  {
    path: "/dashboard",
    role: ["1", "2"],
    icon: faTachometerAlt,
    name: "dashboard",
  },
  
  {
    path: "/dashboard/users",
    role: "1",
    icon: faUsers,
    name: "Users",
  },
  {
    path: "/dashboard/AddUser",
    role: "1",
    icon: faUserPlus,
    name: "Add User",
  },
  {
    path: "/dashboard/categories",
    role: ["1", "2"],
    icon: faListAlt,
    name: "Categories",
  },
  {
    path: "/dashboard/AddCategory",
    role: ["1", "2"],
    icon: faPlus,
    name: "Add Categories",
  },
  {
    path: "/dashboard/products",
    role: ["1", "2"],
    icon: faShoppingBag,
    name: "Products",
  },
  {
    path: "/dashboard/AddProduct",
    role: ["1", "2"],
    icon: faPlus,
    name: "Add Products",
  },
  {
    path: "/dashboard/orders",
    role: ["1", "2"],
    icon: faReceipt,
    name: "orders",
  },
  {
    path: "/dashboard/customers",
    role: ["1", "2"],
    icon: faUserFriends,
    name: "customers",
  },
];
