import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { getCategories, getHotGoods, searchGoods } from "../services/goodService";
import { getCart } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import "./DesktopHeader.css";

const DesktopHeader = ({ isAdminPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const user = getCurrentUser();

  const activeNavCatId = useMemo(() => {
    if (location.pathname !== "/category") return null;
    return searchParams.get("cat") || "all";
  }, [location.pathname, searchParams]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    const cart = getCart();
    setCartCount(cart.length);
    const handleFocus = () => {
      const cart = getCart();
      setCartCount(cart.length);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [location.pathname]);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    navigate("/", { state: { searchKeyword: trimmed } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (isAdminPage) return null;

  return (
    <header className="desktop-header">
      <div className="desktop-header-top">
        <div className="desktop-header-logo" onClick={() => navigate("/")}>
          商城
        </div>

        <div className="desktop-header-search">
          <SearchOutlined className="desktop-search-icon" />
          <input
            type="text"
            className="desktop-search-input"
            placeholder="搜索商品"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="desktop-search-btn" onClick={handleSearch}>
            搜索
          </button>
        </div>

        <div className="desktop-header-actions">
          <div
            className={`desktop-header-action-item ${cartCount > 0 ? "has-badge" : ""}`}
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartOutlined />
            <span>购物车</span>
            {cartCount > 0 && (
              <span className="desktop-cart-badge">{cartCount}</span>
            )}
          </div>
          <div
            className="desktop-header-action-item"
            onClick={() => navigate(user ? "/orders" : "/login")}
          >
            <OrderedListOutlined />
            <span>我的订单</span>
          </div>
          <div
            className="desktop-header-action-item"
            onClick={() => navigate(user ? "/mine" : "/login")}
          >
            <UserOutlined />
            <span>{user ? user.username : "登录"}</span>
          </div>
        </div>
      </div>

      <nav className="desktop-header-nav">
        <div
          className={`desktop-nav-item ${location.pathname === "/" ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          首页
        </div>
        <div
          className={`desktop-nav-item ${activeNavCatId === "all" ? "active" : ""}`}
          onClick={() => navigate("/category")}
        >
          全部
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`desktop-nav-item ${activeNavCatId === cat.id ? "active" : ""}`}
            onClick={() => {
              navigate(`/category?cat=${cat.id}`);
            }}
          >
            {cat.name}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default DesktopHeader;
