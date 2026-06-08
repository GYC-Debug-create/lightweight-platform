import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

const tabs = [
  { path: "/", label: "首页", icon: <HomeOutlined /> },
  { path: "/category", label: "分类", icon: <AppstoreOutlined /> },
  { path: "/cart", label: "购物车", icon: <ShoppingCartOutlined /> },
  { path: "/mine", label: "我的", icon: <UserOutlined /> },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={location.pathname === tab.path ? "active" : ""}
        >
          <span style={{ fontSize: "18px" }}>{tab.icon}</span>
          <span style={{ fontSize: "12px", marginTop: "2px" }}>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
