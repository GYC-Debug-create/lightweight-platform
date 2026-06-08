import { getStorage, setStorage } from "../utils/storage";
import { generateOrderId, formatDate } from "../utils/format";
import { getCurrentUser } from "./authService";

function getOrdersKey() {
  const currentUser = getCurrentUser();
  if (!currentUser) return "mall_orders_anonymous";
  // 兼容旧版开发数据
  if (currentUser.username === "member") {
    if (!localStorage.getItem("mall_orders_member") && localStorage.getItem("mall_orders")) {
      return "mall_orders";
    }
  }
  return `mall_orders_${currentUser.username}`;
}

export function createOrder(items, receiverInfo) {
  const key = getOrdersKey();
  const orders = getStorage(key, []);
  const currentUser = getCurrentUser();
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const order = {
    id: generateOrderId(),
    username: currentUser ? currentUser.username : "anonymous",
    items,
    totalPrice,
    status: "待支付",
    receiver: receiverInfo.receiver || "",
    phone: receiverInfo.phone || "",
    address: receiverInfo.address || "",
    createTime: formatDate(new Date()),
    payTime: "",
  };
  orders.push(order);
  setStorage(key, orders);
  return order;
}

export function getOrders() {
  const key = getOrdersKey();
  return getStorage(key, []);
}

export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export function payOrder(orderId) {
  const key = getOrdersKey();
  const orders = getStorage(key, []);
  const order = orders.find((o) => o.id === orderId);
  if (!order) return false;
  order.status = "已支付";
  order.payTime = formatDate(new Date());
  setStorage(key, orders);
  return true;
}

export function shipOrder(orderId) {
  const key = getOrdersKey();
  const orders = getStorage(key, []);
  const order = orders.find((o) => o.id === orderId);
  if (!order) return false;
  order.status = "已发货";
  setStorage(key, orders);
  return true;
}

