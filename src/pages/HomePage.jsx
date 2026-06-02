import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h2>商城首页</h2>
      <p>页面待实现</p>
      <p>
        <Link to="/detail/g001">查看示例商品</Link>
      </p>
    </div>
  );
};

export default HomePage;
