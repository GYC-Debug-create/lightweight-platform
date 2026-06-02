import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
// 依赖 M1 提供的服务
import { getCategories, getGoodsByCategory } from '../services/goodService';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [goods, setGoods] = useState([]);

  // 初始化加载所有分类
  useEffect(() => {
    const cats = getCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setActiveCategoryId(cats[0].id); // 默认选中第一个分类
    }
  }, []);

  // 监听选中分类的变化，加载对应商品
  useEffect(() => {
    if (activeCategoryId) {
      const categoryGoods = getGoodsByCategory(activeCategoryId);
      setGoods(categoryGoods);
    }
  }, [activeCategoryId]);

  return (
    // 最外层加上了 paddingBottom 防遮挡，以及 boxSizing 保证高度不越界
    <div className="category-page" style={{ display: 'flex', height: '100vh', paddingBottom: '60px', boxSizing: 'border-box' }}>
      {/* 左侧分类索引 */}
      <div className="sidebar" style={{ width: '100px', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        {categories.map(cat => (
          <div 
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            style={{ 
              padding: '15px 10px', 
              cursor: 'pointer',
              background: activeCategoryId === cat.id ? '#f0f0f0' : 'white',
              fontWeight: activeCategoryId === cat.id ? 'bold' : 'normal'
            }}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* 右侧商品列表 */}
      <div className="content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          {goods.length > 0 ? (
            goods.map(good => (
              <ProductCard key={good.id} product={good} />
            ))
          ) : (
            <p>该分类下暂无商品</p>
          )}
        </div>
      </div>
    </div>
  );
}