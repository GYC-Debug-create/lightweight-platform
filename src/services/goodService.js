import { getStorage, setStorage } from "../utils/storage";
import initialGoods from "../data/initialGoods";
import initialCategories from "../data/initialCategories";

const GOODS_KEY = "mall_goods";
const CATEGORIES_KEY = "mall_categories";

export function initGoodsIfNeeded() {
  if (!localStorage.getItem(GOODS_KEY)) {
    setStorage(GOODS_KEY, initialGoods);
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    setStorage(CATEGORIES_KEY, initialCategories);
  }
}

export function getGoods() {
  return getStorage(GOODS_KEY, []);
}

export function getHotGoods() {
  const goods = getGoods();
  return goods.filter((g) => g.hot === true);
}

export function getGoodById(id) {
  const goods = getGoods();
  return goods.find((g) => g.id === id) || null;
}

export function searchGoods(keyword) {
  const goods = getGoods();
  if (!keyword) return goods;
  const kw = keyword.toLowerCase();
  return goods.filter(
    (g) =>
      g.name.toLowerCase().includes(kw) ||
      (g.description && g.description.toLowerCase().includes(kw))
  );
}

export function getCategories() {
  return getStorage(CATEGORIES_KEY, []);
}

export function getGoodsByCategory(categoryId) {
  const goods = getGoods();
  return goods.filter((g) => g.categoryId === categoryId);
}

export function createGood(good) {
  const goods = getGoods();
  goods.push(good);
  setStorage(GOODS_KEY, goods);
}

export function updateGood(id, partialGood) {
  const goods = getGoods();
  const idx = goods.findIndex((g) => g.id === id);
  if (idx === -1) return false;
  goods[idx] = { ...goods[idx], ...partialGood };
  setStorage(GOODS_KEY, goods);
  return true;
}

export function deleteGood(id) {
  const goods = getGoods();
  const index = goods.findIndex((g) => g.id === id);
  if (index === -1) return false;
  goods.splice(index, 1);
  setStorage(GOODS_KEY, goods);
  return true;
}
