import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "首页" },
  { path: "/category", label: "分类" },
  { path: "/cart", label: "购物车" },
  { path: "/mine", label: "我的" },
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
          {tab.label}
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
