import { getStorage, setStorage } from "../utils/storage";
import { getCurrentUser } from "./authService";

function getCartKey() {
  const currentUser = getCurrentUser();
  if (!currentUser) return "mall_cart_anonymous";
  // 兼容老版本开发数据：如果测试账号 member 并且还没有 mall_cart_member 键，但存有老的 mall_cart，就沿用老的
  if (currentUser.username === "member") {
    if (!localStorage.getItem("mall_cart_member") && localStorage.getItem("mall_cart")) {
      return "mall_cart";
    }
  }
  return `mall_cart_${currentUser.username}`;
}

export function getCart() {
  return getStorage(getCartKey(), []);
}

export function addToCart(good, count) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === good.id);
  if (existing) {
    existing.count += count;
  } else {
    cart.push({
      productId: good.id,
      name: good.name,
      price: good.price,
      image: good.image,
      stock: good.stock,
      count,
      checked: true,
    });
  }
  setStorage(getCartKey(), cart);
}

export function updateCartItem(productId, count) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.count = count;
  if (item.count <= 0) {
    removeCartItem(productId);
    return;
  }
  setStorage(getCartKey(), cart);
}

export function toggleCartItem(productId, checked) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.checked = checked;
  setStorage(getCartKey(), cart);
}

export function toggleAllCartItems(checked) {
  const cart = getCart();
  cart.forEach((item) => {
    item.checked = checked;
  });
  setStorage(getCartKey(), cart);
}

export function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.productId !== productId);
  setStorage(getCartKey(), cart);
}

export function clearCheckedCartItems() {
  let cart = getCart();
  cart = cart.filter((i) => !i.checked);
  setStorage(getCartKey(), cart);
}

export function getCheckedCartItems() {
  const cart = getCart();
  return cart.filter((i) => i.checked);
}

export function getCartTotal() {
  const checked = getCheckedCartItems();
  return checked.reduce((sum, i) => sum + i.price * i.count, 0);
}
