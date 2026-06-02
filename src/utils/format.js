export function formatPrice(price) {
  if (price == null || isNaN(price)) return "¥0.00";
  return `¥${Number(price).toFixed(2)}`;
}

export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}:${s}`;
}

export function generateOrderId() {
  return `ORDER_${Date.now()}`;
}
