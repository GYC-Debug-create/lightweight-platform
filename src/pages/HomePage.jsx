import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
// 依赖 M1 提供的服务
import { getHotGoods, searchGoods } from '../services/goodService';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [goods, setGoods] = useState([]);

  // 初始化加载热门商品
  useEffect(() => {
    const hotGoods = getHotGoods(); // 假设 service 是同步读取 localStorage 的
    setGoods(hotGoods);
  }, []);

  // 搜索处理
  const handleSearch = () => {
    if (keyword.trim() === '') {
      setGoods(getHotGoods());
    } else {
      const results = searchGoods(keyword);
      setGoods(results);
    }
  };

  return (
    // 最外层加上了 paddingBottom 防遮挡
    <div className="home-page" style={{ padding: '20px', paddingBottom: '80px' }}>
      {/* 1. 搜索框 */}
      <div className="search-bar" style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="搜索商品..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '8px 16px' }}>
          搜索
        </button>
      </div>

      {/* 2. 轮播图区域 (静态占位，符合文档要求) */}
      <div className="carousel" style={{ height: '150px', background: '#ccc', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>热门活动轮播图区域</h2>
      </div>

      {/* 3. 热门/搜索商品列表 */}
      <h3>{keyword ? '搜索结果' : '热门商品'}</h3>
      <div 
        className="goods-list" 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}
      >
        {goods.length > 0 ? (
          goods.map(good => (
            <ProductCard key={good.id} product={good} />
          ))
        ) : (
          <p>暂无相关商品</p>
        )}
      </div>
    </div>
  );
}