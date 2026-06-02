import { getStorage, setStorage, removeStorage } from "../utils/storage";

const USER_KEY = "mall_user";
const ADMIN_KEY = "mall_admin";

const FIXED_USER = { username: "member", password: "123456", role: "user" };
const FIXED_ADMIN = { username: "admin", password: "123456", role: "admin" };

export function login(username, password) {
  if (username === FIXED_USER.username && password === FIXED_USER.password) {
    const user = { username: FIXED_USER.username, role: FIXED_USER.role };
    setStorage(USER_KEY, user);
    return user;
  }
  return null;
}

export function logout() {
  removeStorage(USER_KEY);
}

export function getCurrentUser() {
  return getStorage(USER_KEY, null);
}

export function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

export function adminLogin(username, password) {
  if (username === FIXED_ADMIN.username && password === FIXED_ADMIN.password) {
    const admin = { username: FIXED_ADMIN.username, role: FIXED_ADMIN.role };
    setStorage(ADMIN_KEY, admin);
    return admin;
  }
  return null;
}

export function adminLogout() {
  removeStorage(ADMIN_KEY);
}

export function getCurrentAdmin() {
  return getStorage(ADMIN_KEY, null);
}

export function isAdminLoggedIn() {
  return getCurrentAdmin() !== null;
}
