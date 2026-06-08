import { getStorage, setStorage } from "../utils/storage";

const CART_KEY = "mall_cart";

export function getCart() {
  return getStorage(CART_KEY, []);
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
  setStorage(CART_KEY, cart);
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
  setStorage(CART_KEY, cart);
}

export function toggleCartItem(productId, checked) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.checked = checked;
  setStorage(CART_KEY, cart);
}

export function toggleAllCartItems(checked) {
  const cart = getCart();
  cart.forEach((item) => {
    item.checked = checked;
  });
  setStorage(CART_KEY, cart);
}

export function removeCartItem(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.productId !== productId);
  setStorage(CART_KEY, cart);
}

export function clearCheckedCartItems() {
  let cart = getCart();
  cart = cart.filter((i) => !i.checked);
  setStorage(CART_KEY, cart);
}

export function getCheckedCartItems() {
  const cart = getCart();
  return cart.filter((i) => i.checked);
}

export function getCartTotal() {
  const checked = getCheckedCartItems();
  return checked.reduce((sum, i) => sum + i.price * i.count, 0);
}
