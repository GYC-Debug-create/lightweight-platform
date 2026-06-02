import { useContext } from "react";
import { useParams } from "react-router";
import { ServiceContext } from "../contexts/ServiceContext";

const DetailPage = () => {
  const { id } = useParams();
  const services = useContext(ServiceContext);

  const good = services.good.getGoodById(id);

  if (!good) {
    return (
      <div>
        <h2>商品详情</h2>
        <p>商品不存在</p>
      </div>
    );
  }

  return (
    <div>
      <h2>商品详情</h2>
      <p>{good.name}</p>
      <p>¥{good.price}</p>
      {good.image && <img src={good.image} alt={good.name} />}
      <p>{good.description}</p>
    </div>
  );
};

export default DetailPage;
