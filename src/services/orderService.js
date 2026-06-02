import { getStorage, setStorage } from "../utils/storage";
import { generateOrderId, formatDate } from "../utils/format";

const ORDERS_KEY = "mall_orders";

export function createOrder(items, receiverInfo) {
  const orders = getStorage(ORDERS_KEY, []);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const order = {
    id: generateOrderId(),
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
  setStorage(ORDERS_KEY, orders);
  return order;
}

export function getOrders() {
  return getStorage(ORDERS_KEY, []);
}

export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find((o) => o.id === orderId) || null;
}

export function payOrder(orderId) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return false;
  order.status = "已支付";
  order.payTime = formatDate(new Date());
  setStorage(ORDERS_KEY, orders);
  return true;
}

export function shipOrder(orderId) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return false;
  order.status = "已发货";
  setStorage(ORDERS_KEY, orders);
  return true;
}
