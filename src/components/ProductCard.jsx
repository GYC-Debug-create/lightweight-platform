import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // 跳转到商品详情页，对应路由规范 /detail/:id
  const handleClick = () => {
    navigate(`/detail/${product.id}`);
  };

  return (
    <div 
      className="product-card" 
      onClick={handleClick}
      style={{ border: '1px solid #eee', padding: '10px', cursor: 'pointer', borderRadius: '8px' }}
    >
      {/* 统一使用文档规定的 image 字段 */}
      <img 
        src={product.image} 
        alt={product.name} 
        style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
      />
      <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{product.name}</h3>
      <p style={{ color: 'red', fontWeight: 'bold' }}>¥{product.price}</p>
    </div>
  );
}